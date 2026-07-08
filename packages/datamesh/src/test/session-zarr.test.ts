import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Connector } from "../lib/connector";
import { Dataset } from "../lib/datamodel";
import { CachedHTTPStore } from "../lib/zarr";

// Helper: mock fetch for the session-acquire and stage endpoints. Session ids
// are handed out sequentially (sess-1, sess-2, ...) with the given lifetime.
const mockConnectorFetch = (sessionLifetimeMs = 3600e3) => {
  let sessions = 0;
  return vi.fn(async (url: string) => {
    const u = String(url);
    if (u.includes("/session/?")) {
      sessions += 1;
      return {
        status: 200,
        json: async () => ({
          id: `sess-${sessions}`,
          user: "u",
          creation_time: new Date().toISOString(),
          end_time: new Date(Date.now() + sessionLifetimeMs).toISOString(),
          write: false,
        }),
      } as unknown as Response;
    }
    if (u.includes("/oceanql/stage/")) {
      return {
        status: 200,
        json: async () => ({
          query: { datasource: "test" },
          qhash: "hash123",
          formats: ["zarr"],
          size: 1,
          dlen: 1,
          coordmap: {},
          coordkeys: {},
          container: "dataset",
          sig: "s",
        }),
      } as unknown as Response;
    }
    return {
      status: 200,
      text: async () => "",
      json: async () => ({}),
    } as unknown as Response;
  });
};

const zarrCalls = () =>
  (Dataset.zarr as unknown as { mock: { calls: unknown[][] } }).mock.calls;

const sessionFetches = (fetchMock: ReturnType<typeof mockConnectorFetch>) =>
  fetchMock.mock.calls.filter(([u]) => String(u).includes("/session/?"));

describe("datamesh v1 sessions", () => {
  beforeEach(() => {
    vi.spyOn(Dataset, "zarr").mockResolvedValue({
      variables: {},
      coordkeys: {},
    } as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("always creates a session and passes it to zarr requests", async () => {
    vi.stubGlobal("fetch", mockConnectorFetch());
    const connector = new Connector("tok", { service: "https://gw.example" });
    await connector.query({ datasource: "test" });

    const headers = zarrCalls()[0]?.[1] as Record<string, string> | undefined;
    expect(headers?.["X-DATAMESH-SESSIONID"]).toBe("sess-1");
  });

  it("always addresses the zarr view via the query path", async () => {
    vi.stubGlobal("fetch", mockConnectorFetch());
    const connector = new Connector("tok", { service: "https://gw.example" });
    await connector.query({ datasource: "test" });

    expect(zarrCalls()[0]?.[0]).toBe("https://gw.example/zarr/query/hash123");
  });

  it("single-flights session acquisition across concurrent requests", async () => {
    const fetchMock = mockConnectorFetch();
    vi.stubGlobal("fetch", fetchMock);
    const connector = new Connector("tok", { service: "https://gw.example" });

    await Promise.all([
      connector.query({ datasource: "test" }),
      connector.query({ datasource: "test" }),
      connector.getSession(),
    ]);

    expect(sessionFetches(fetchMock).length).toBe(1);
  });

  it("acquires a fresh session when the current one has expired", async () => {
    // Lifetime below the 60s reuse margin, so the first session is already
    // considered expired on next use.
    const fetchMock = mockConnectorFetch(1000);
    vi.stubGlobal("fetch", fetchMock);
    const connector = new Connector("tok", { service: "https://gw.example" });

    await connector.query({ datasource: "test" });
    await connector.query({ datasource: "test" });

    expect(sessionFetches(fetchMock).length).toBeGreaterThan(1);
    const lastHeaders = zarrCalls().at(-1)?.[1] as Record<string, string>;
    expect(lastHeaders["X-DATAMESH-SESSIONID"]).not.toBe("sess-1");
  });

  it("CachedHTTPStore forwards the session header on every chunk request", async () => {
    const seen: Record<string, string>[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, opts: RequestInit) => {
        seen.push(opts.headers as Record<string, string>);
        return {
          status: 200,
          arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        } as unknown as Response;
      }),
    );

    const store = new CachedHTTPStore(
      "https://gw.example/zarr/query/abc",
      {
        Authorization: "Token tok",
        "X-DATAMESH-SESSIONID": "sess-abc",
      },
      { ttl: 0 },
    );
    await store.get("/temperature/0.0.0" as `/${string}`);

    expect(seen[0]?.["X-DATAMESH-SESSIONID"]).toBe("sess-abc");
  });
});
