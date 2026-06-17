import { describe, test, expect, vi, beforeEach } from "vitest";

// Shared mock store - the MockCachedHTTPStore reads from here so Dataset.zarr
// can read back exactly what Dataset.toZarr wrote (an in-memory v3 store).
let mockStoreData: Map<string, Uint8Array>;

vi.mock("../lib/zarr", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  class MockCachedHTTPStore {
    async get(key: string) {
      return mockStoreData.get(key);
    }
  }
  return { ...actual, CachedHTTPStore: MockCachedHTTPStore };
});

import { Dataset } from "../lib/datamodel";

/**
 * Build a consolidated `.zmetadata` for a v3 store by aggregating every
 * per-node `zarr.json` entry (mirrors what the EIDOS ingestion writes
 * client-side). Returns a store keyed with a leading slash, as the store wants.
 */
function consolidateV3(
  store: Map<string, Uint8Array>,
): Map<string, Uint8Array> {
  const out = new Map<string, Uint8Array>();
  const metadata: Record<string, unknown> = {};
  for (const [key, bytes] of store) {
    const rel = key.replace(/^\//, "");
    out.set(`/${rel}`, bytes);
    if (rel === "zarr.json" || rel.endsWith("/zarr.json")) {
      metadata[rel] = JSON.parse(new TextDecoder().decode(bytes));
    }
  }
  out.set(
    "/.zmetadata",
    new TextEncoder().encode(
      JSON.stringify({ zarr_consolidated_format: 1, metadata }),
    ),
  );
  return out;
}

describe("Dataset.zarr reads back a v3 store written by toZarr", () => {
  beforeEach(() => {
    mockStoreData = new Map();
    vi.clearAllMocks();
  });

  test("roundtrips a gridded dataset (dims, coords, variables)", async () => {
    const ds = await Dataset.init(
      {
        dimensions: { y: 2, x: 3 },
        variables: {
          x: {
            dimensions: ["x"],
            attributes: {},
            data: [10, 20, 30],
            dtype: "float64",
          },
          y: {
            dimensions: ["y"],
            attributes: {},
            data: [1, 2],
            dtype: "float64",
          },
          temp: {
            dimensions: ["y", "x"],
            attributes: {},
            data: [
              [1.5, 2.5, 3.5],
              [4.5, 5.5, 6.5],
            ],
            dtype: "float64",
          },
        },
        attributes: {},
      },
      { x: "x", y: "y" },
    );

    const written = await ds.toZarr();
    mockStoreData = consolidateV3(written);

    const read = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(Object.keys(read.variables).sort()).toEqual(["temp", "x", "y"]);
    expect(read.dimensions).toEqual({ y: 2, x: 3 });
    expect(read.coordkeys).toEqual({ x: "x", y: "y" });

    // get() returns typed-array rows; normalise to plain arrays for comparison.
    const temp = (await read.variables.temp.get()) as ArrayLike<
      ArrayLike<number>
    >;
    const rows = Array.from(temp, (row) => Array.from(row));
    expect(rows).toEqual([
      [1.5, 2.5, 3.5],
      [4.5, 5.5, 6.5],
    ]);
  });

  test("roundtrips a GeoJSON dataset (WKB geometry + mixed-dtype properties)", async () => {
    const ds = await Dataset.fromGeojson({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [1, 2] },
          properties: { name: "a", n: 1 },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [3, 4] },
          properties: { name: "b", n: 2 },
        },
      ],
    });

    const written = await ds.toZarr();
    mockStoreData = consolidateV3(written);

    const read = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(read.coordkeys.g).toBe("geometry");
    expect(Object.keys(read.variables).sort()).toEqual([
      "geometry",
      "n",
      "name",
    ]);
    // The object/json2-coded columns survive the v3 roundtrip.
    const names = (await read.variables.name.get()) as ArrayLike<string>;
    expect(Array.from(names)).toEqual(["a", "b"]);
    const geom = (await read.variables.geometry.get()) as ArrayLike<unknown>;
    expect(Array.from(geom)).toHaveLength(2);
  });
});
