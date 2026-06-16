import { describe, it, expect, vi, afterEach } from "vitest";
import { Connector } from "../lib/connector";

afterEach(() => {
  vi.unstubAllGlobals();
});

// Mock fetch: /session → 404 (treat as API v0, no session handshake), and the
// staged-data endpoint returns the given bytes/status.
function stubFetch(
  staged: { status?: number; body?: Uint8Array | string } = {},
): string[] {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const u = String(url);
      calls.push(u);
      if (u.includes("/session")) return new Response("", { status: 404 });
      if (u.includes("/oceanql/")) {
        return new Response(staged.body ?? new Uint8Array([1, 2, 3, 4]), {
          status: staged.status ?? 200,
        });
      }
      return new Response("", { status: 404 });
    }),
  );
  return calls;
}

// The constructor kicks off an async _checkApiVersion() that hits /session.
// Our stub answers 404, so the connector settles to API v0 (no session
// handshake). Construct, then let that fetch resolve before exercising
// getDataObject, otherwise the default _isV1=true races us into createSession.
async function makeConnector(): Promise<Connector> {
  const c = new Connector("test-token", { gateway: "https://gw.test" });
  await new Promise((r) => setTimeout(r, 0));
  return c;
}

describe("Connector.getDataObject", () => {
  it("downloads staged data with the requested format and returns bytes", async () => {
    const calls = stubFetch({ body: new Uint8Array([1, 2, 3, 4]) });
    const c = await makeConnector();

    const buf = await c.getDataObject("QHASH", "nc");

    expect(new Uint8Array(buf)).toEqual(new Uint8Array([1, 2, 3, 4]));
    expect(calls).toContain("https://gw.test/oceanql/QHASH?f=nc");
  });

  it("url-encodes the format param", async () => {
    const calls = stubFetch();
    const c = await makeConnector();
    await c.getDataObject("Q", "application/x-netcdf");
    expect(calls).toContain(
      "https://gw.test/oceanql/Q?f=application%2Fx-netcdf",
    );
  });

  it("returns an empty ArrayBuffer for an empty 200 response", async () => {
    stubFetch({ body: new Uint8Array([]) });
    const c = await makeConnector();
    const buf = await c.getDataObject("QHASH", "nc");
    expect(buf.byteLength).toBe(0);
  });

  it("throws on a server error", async () => {
    stubFetch({ status: 500, body: JSON.stringify({ detail: "boom" }) });
    const c = await makeConnector();
    await expect(c.getDataObject("QHASH", "nc")).rejects.toThrow("boom");
  });
});
