import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { Connector } from "../lib/connector";
import { Dataset } from "../lib/datamodel";
import { CachedHTTPStore } from "../lib/zarr";

// Helper: mock fetch for the session-acquire and stage endpoints.
const mockConnectorFetch = () =>
  vi.fn(async (url: string) => {
    const u = String(url);
    if (u.includes("/session/?")) {
      return {
        status: 200,
        json: async () => ({
          id: "sess-abc",
          user: "u",
          creation_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600e3).toISOString(),
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

const zarrCall = () =>
  (Dataset.zarr as unknown as { mock: { calls: unknown[][] } }).mock.calls[0];

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

test("a session is always created and passed to zarr requests", async () => {
  vi.stubGlobal("fetch", mockConnectorFetch());
  const connector = new Connector("tok", { service: "https://gw.example" });
  await connector.query({ datasource: "test" });

  const headers = zarrCall()?.[1] as Record<string, string> | undefined;
  expect(headers?.["X-DATAMESH-SESSIONID"]).toBe("sess-abc");
});

test("the zarr view is always addressed via the query path", async () => {
  vi.stubGlobal("fetch", mockConnectorFetch());
  const connector = new Connector("tok", { service: "https://gw.example" });
  await connector.query({ datasource: "test" });

  expect(zarrCall()?.[0]).toBe("https://gw.example/zarr/query/hash123");
});

test("CachedHTTPStore forwards the session header on every chunk request", async () => {
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
