import { describe, it, expect, vi, afterEach } from "vitest";
import { Connector } from "../lib/connector";

afterEach(() => {
  vi.unstubAllGlobals();
});

// Mock fetch: session acquisition returns a stub session, and the
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
      if (u.includes("/session/?")) {
        return new Response(
          JSON.stringify({
            id: "sess-abc",
            user: "u",
            creation_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600e3).toISOString(),
            write: false,
          }),
          { status: 200 },
        );
      }
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

function makeConnector(): Connector {
  return new Connector("test-token", { gateway: "https://gw.test" });
}

describe("Connector.getDataObject", () => {
  it("downloads staged data with the requested format and returns bytes", async () => {
    const calls = stubFetch({ body: new Uint8Array([1, 2, 3, 4]) });
    const c = makeConnector();

    const buf = await c.getDataObject("QHASH", "nc");

    expect(new Uint8Array(buf)).toEqual(new Uint8Array([1, 2, 3, 4]));
    expect(calls).toContain("https://gw.test/oceanql/QHASH?f=nc");
  });

  it("url-encodes the format param", async () => {
    const calls = stubFetch();
    const c = makeConnector();
    await c.getDataObject("Q", "application/x-netcdf");
    expect(calls).toContain(
      "https://gw.test/oceanql/Q?f=application%2Fx-netcdf",
    );
  });

  it("returns an empty ArrayBuffer for an empty 200 response", async () => {
    stubFetch({ body: new Uint8Array([]) });
    const c = makeConnector();
    const buf = await c.getDataObject("QHASH", "nc");
    expect(buf.byteLength).toBe(0);
  });

  it("throws on a server error", async () => {
    stubFetch({ status: 500, body: JSON.stringify({ detail: "boom" }) });
    const c = makeConnector();
    await expect(c.getDataObject("QHASH", "nc")).rejects.toThrow("boom");
  });
});
