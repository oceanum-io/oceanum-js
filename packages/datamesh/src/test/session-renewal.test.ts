import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CachedHTTPStore } from "../lib/zarr";
import { Connector } from "../lib/connector";

// Regression: an oceanql session can be terminated server-side after a period
// of inactivity, BEFORE its declared end time. Every subsequent request for
// the staged query then returns 401. The zarr store used to freeze the
// session header at construction and treat 401 as a plain HTTP error; it now
// renews the session (single-flight) and retries the request once.

const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));

describe("CachedHTTPStore 401 renewal", () => {
  afterEach(() => vi.unstubAllGlobals());

  const makeStore = (renewHeaders?: () => Promise<Record<string, string>>) =>
    new CachedHTTPStore(
      "https://gateway.test/zarr/query/abc",
      { "X-DATAMESH-SESSIONID": "stale-session", Authorization: "Token t" },
      { parameters: { x: 1 }, renewHeaders },
    );

  it("renews once and retries with fresh headers on 401", async () => {
    const calls: Array<Record<string, string>> = [];
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      calls.push({ ...(init.headers as Record<string, string>) });
      if (calls.length === 1) return new Response("expired", { status: 401 });
      return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const renew = vi.fn(async () => ({
      "X-DATAMESH-SESSIONID": "fresh-session",
    }));
    const store = makeStore(renew);
    const data = await store.get("/.zmetadata");

    expect(Array.from(data!)).toEqual([1, 2, 3]);
    expect(renew).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // retry carries the renewed session id...
    expect(calls[1]["X-DATAMESH-SESSIONID"]).toBe("fresh-session");
    // ...and preserves the store-added zarr headers
    expect(calls[1]["x-parameters"]).toBe(JSON.stringify({ x: 1 }));
    expect(calls[1]["x-filtered"]).toBe("True");
  });

  it("single-flights renewal across concurrent chunk fetches", async () => {
    let renewCount = 0;
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const h = init.headers as Record<string, string>;
      if (h["X-DATAMESH-SESSIONID"] === "stale-session")
        return new Response("expired", { status: 401 });
      return new Response(new Uint8Array([9]), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const renew = vi.fn(async () => {
      renewCount += 1;
      await new Promise((r) => setTimeout(r, 20)); // widen the race window
      return { "X-DATAMESH-SESSIONID": "fresh-session" };
    });
    const store = makeStore(renew);
    const results = await Promise.all([
      store.get("/a/0"),
      store.get("/a/1"),
      store.get("/a/2"),
    ]);

    for (const r of results) expect(Array.from(r!)).toEqual([9]);
    expect(renewCount).toBe(1); // one renewal shared by all three 401s
  });

  it("a second 401 after renewal fails fast — no retry-loop hammering", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    const renew = vi.fn(async () => ({
      "X-DATAMESH-SESSIONID": "still-rejected",
    }));
    const store = makeStore(renew);
    // terminal semantics of the store: unrecoverable failures resolve undefined
    await expect(store.get("/.zmetadata")).resolves.toBeUndefined();
    expect(renew).toHaveBeenCalledTimes(1); // exactly one renewal attempt
    expect(fetchMock).toHaveBeenCalledTimes(2); // original + one retry, no loop
  });

  it("without a renewHeaders callback, 401 keeps its pre-existing behavior", async () => {
    const fetchMock = vi.fn(
      async () => new Response("expired", { status: 401 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    // small timeout keeps the pre-existing generic retry loop short
    const store = new CachedHTTPStore(
      "https://gateway.test/zarr/query/abc",
      { "X-DATAMESH-SESSIONID": "stale-session" },
      { timeout: 400 },
    );
    await expect(store.get("/.zmetadata")).resolves.toBeUndefined();
    expect(fetchMock.mock.calls.length).toBeGreaterThan(1); // legacy retry loop
  });
});

// ---------------------------------------------------------------------------
// Connector-level: renewSession must replace a session the gateway killed
// early (its declared endTime is still in the future), and openZarr must wire
// the whole path together.
// ---------------------------------------------------------------------------

const sessionJson = (id: string) => ({
  id,
  user: "test",
  creation_time: new Date().toISOString(),
  // declared expiry FAR in the future — the point is server-side early death
  end_time: new Date(Date.now() + 3600_000).toISOString(),
  write: false,
  verified: true,
});

const gatewayMock = () => {
  let sessionCount = 0;
  const zmetadataCalls: Array<Record<string, string>> = [];
  const zmetadata = {
    metadata: {
      ".zgroup": { zarr_format: 2 },
      "v/.zarray": {
        zarr_format: 2,
        shape: [1],
        chunks: [1],
        dtype: "<f8",
        compressor: null,
        fill_value: null,
        order: "C",
        filters: null,
      },
      "v/.zattrs": { _ARRAY_DIMENSIONS: ["d0"] },
    },
    zarr_consolidated_format: 1,
  };
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const u = String(url);
    if (u.includes("/session/")) {
      sessionCount += 1;
      return new Response(JSON.stringify(sessionJson(`s-${sessionCount}`)), {
        status: 200,
      });
    }
    if (u.includes(".zmetadata")) {
      const h = (init?.headers ?? {}) as Record<string, string>;
      zmetadataCalls.push({ ...h });
      // the FIRST session is treated as already expired server-side
      if (h["X-DATAMESH-SESSIONID"] === "s-1")
        return new Response("Session ID required", { status: 401 });
      return new Response(enc(zmetadata), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  });
  return { fetchMock, zmetadataCalls, getSessionCount: () => sessionCount };
};

describe("Connector session renewal", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("renewSession replaces a session the gateway killed before its endTime", async () => {
    const { fetchMock } = gatewayMock();
    vi.stubGlobal("fetch", fetchMock);
    const connector = new Connector("test-token", {
      service: "https://gateway.test",
    });
    const first = await connector.getSession();
    expect(first.id).toBe("s-1");
    // endTime is an hour away — getSession alone would keep returning it
    expect(await connector.getSession()).toBe(first);

    const renewed = await connector.renewSession(first);
    expect(renewed.id).toBe("s-2");
    expect(await connector.getSession()).toBe(renewed);
  });

  it("renewSession with a superseded session does not clobber the current one", async () => {
    const { fetchMock } = gatewayMock();
    vi.stubGlobal("fetch", fetchMock);
    const connector = new Connector("test-token", {
      service: "https://gateway.test",
    });
    const first = await connector.getSession();
    const second = await connector.renewSession(first);
    // a straggler still holding `first` renews — must NOT discard `second`
    const third = await connector.renewSession(first);
    expect(third).toBe(second);
  });

  it("openZarr recovers end-to-end from an idle-expired session", async () => {
    const { fetchMock, zmetadataCalls, getSessionCount } = gatewayMock();
    vi.stubGlobal("fetch", fetchMock);
    const connector = new Connector("test-token", {
      service: "https://gateway.test",
    });

    const dataset = await connector.openZarr(
      "https://gateway.test/zarr/query/abc",
      { coordkeys: {} as never },
    );

    expect(dataset).toBeDefined();
    // first .zmetadata attempt used the killed session, retry used the fresh one
    expect(zmetadataCalls[0]["X-DATAMESH-SESSIONID"]).toBe("s-1");
    expect(
      zmetadataCalls[zmetadataCalls.length - 1]["X-DATAMESH-SESSIONID"],
    ).toBe("s-2");
    expect(getSessionCount()).toBe(2);
  });
});
