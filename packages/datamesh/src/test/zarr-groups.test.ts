import { describe, test, expect, vi, beforeEach } from "vitest";

// Shared mock store data - tests populate this before calling Dataset.zarr()
let mockStoreData: Map<string, Uint8Array>;

// Mock CachedHTTPStore to use in-memory data instead of HTTP requests
vi.mock("../lib/zarr", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  class MockCachedHTTPStore {
    async get(key: string) {
      return mockStoreData.get(key);
    }
  }
  return {
    ...actual,
    CachedHTTPStore: MockCachedHTTPStore,
  };
});

import { Dataset } from "../lib/datamodel";

const encode = (obj: unknown) => new TextEncoder().encode(JSON.stringify(obj));

/**
 * Build a Map-based store with consolidated metadata from a set of entries.
 * Entries use zarr v2 path conventions (e.g., ".zgroup", "var1/.zarray").
 */
function buildConsolidatedStore(
  entries: Record<string, unknown>,
): Map<string, Uint8Array> {
  const store = new Map<string, Uint8Array>();
  // Write consolidated metadata
  store.set(
    "/.zmetadata",
    encode({
      zarr_consolidated_format: 1,
      metadata: entries,
    }),
  );
  // Also write individual files for any non-consolidated access paths
  for (const [key, value] of Object.entries(entries)) {
    store.set(`/${key}`, encode(value));
  }
  return store;
}

/**
 * Helper to create zarr v2 array metadata entries.
 */
function zarrV2Array(
  shape: number[],
  dims?: string[],
  attrs: Record<string, unknown> = {},
) {
  const zarray = {
    zarr_format: 2,
    shape,
    chunks: shape,
    dtype: "<f4",
    compressor: null,
    fill_value: 0.0,
    order: "C",
    filters: null,
  };
  const zattrs: Record<string, unknown> = { ...attrs };
  if (dims) {
    zattrs._ARRAY_DIMENSIONS = dims;
  }
  return { zarray, zattrs };
}

describe("Dataset.zarr group support", () => {
  beforeEach(() => {
    mockStoreData = new Map();
    vi.clearAllMocks();
  });

  test("flat store - variables at root level", async () => {
    const var1 = zarrV2Array([10], ["x"]);
    const var2 = zarrV2Array([20], ["y"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": { _coordinates: JSON.stringify({ x: "lon" }) },
      "var1/.zarray": var1.zarray,
      "var1/.zattrs": var1.zattrs,
      "var2/.zarray": var2.zarray,
      "var2/.zattrs": var2.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(Object.keys(ds.variables).sort()).toEqual(["var1", "var2"]);
    expect(ds.dimensions).toEqual({ x: 10, y: 20 });
    expect(ds.coordkeys).toEqual({ x: "lon" });
  });

  test("nested groups - variables preserve full relative path", async () => {
    const temp = zarrV2Array([10], ["x"]);
    const pressure = zarrV2Array([5], ["y"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "group1/.zgroup": { zarr_format: 2 },
      "group1/.zattrs": {},
      "group1/temperature/.zarray": temp.zarray,
      "group1/temperature/.zattrs": temp.zattrs,
      "group2/.zgroup": { zarr_format: 2 },
      "group2/.zattrs": {},
      "group2/pressure/.zarray": pressure.zarray,
      "group2/pressure/.zattrs": pressure.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    // Variables should use full path to avoid collisions between groups
    expect(Object.keys(ds.variables).sort()).toEqual([
      "group1/temperature",
      "group2/pressure",
    ]);
    expect(ds.dimensions).toEqual({ x: 10, y: 5 });
  });

  test("same-name arrays in different groups do not collide", async () => {
    const temp1 = zarrV2Array([10], ["x"]);
    const temp2 = zarrV2Array([5], ["y"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "obs/.zgroup": { zarr_format: 2 },
      "obs/.zattrs": {},
      "obs/temperature/.zarray": temp1.zarray,
      "obs/temperature/.zattrs": temp1.zattrs,
      "forecast/.zgroup": { zarr_format: 2 },
      "forecast/.zattrs": {},
      "forecast/temperature/.zarray": temp2.zarray,
      "forecast/temperature/.zattrs": temp2.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(Object.keys(ds.variables).sort()).toEqual([
      "forecast/temperature",
      "obs/temperature",
    ]);
    // Both variables should be accessible
    expect(ds.variables["obs/temperature"]).toBeDefined();
    expect(ds.variables["forecast/temperature"]).toBeDefined();
  });

  test("group option filters to specific sub-group", async () => {
    const temp = zarrV2Array([10], ["x"]);
    const pressure = zarrV2Array([5], ["y"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "group1/.zgroup": { zarr_format: 2 },
      "group1/.zattrs": { _coordinates: JSON.stringify({ x: "lon" }) },
      "group1/temperature/.zarray": temp.zarray,
      "group1/temperature/.zattrs": temp.zattrs,
      "group2/.zgroup": { zarr_format: 2 },
      "group2/.zattrs": {},
      "group2/pressure/.zarray": pressure.zarray,
      "group2/pressure/.zattrs": pressure.zattrs,
    });

    const ds = await Dataset.zarr(
      "http://example.com/data.zarr",
      {},
      {
        group: "group1",
      },
    );
    // Only group1 variables should be included, with names relative to group1
    expect(Object.keys(ds.variables)).toEqual(["temperature"]);
    expect(ds.dimensions).toEqual({ x: 10 });
    // Should use group1's coordinate attributes
    expect(ds.coordkeys).toEqual({ x: "lon" });
  });

  test("group option with leading slash", async () => {
    const temp = zarrV2Array([10], ["x"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "mygroup/.zgroup": { zarr_format: 2 },
      "mygroup/.zattrs": {},
      "mygroup/data/.zarray": temp.zarray,
      "mygroup/data/.zattrs": temp.zattrs,
    });

    // Should work the same with or without leading slash
    const ds = await Dataset.zarr(
      "http://example.com/data.zarr",
      {},
      {
        group: "/mygroup",
      },
    );
    expect(Object.keys(ds.variables)).toEqual(["data"]);
  });

  test("missing _ARRAY_DIMENSIONS falls back to generated dim names", async () => {
    const arr = zarrV2Array([10, 20]); // No dims specified

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "data/.zarray": arr.zarray,
      "data/.zattrs": arr.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(ds.variables["data"].dimensions).toEqual(["dim_0", "dim_1"]);
    expect(ds.dimensions).toEqual({ dim_0: 10, dim_1: 20 });
  });

  test("non-consolidated store throws helpful error", async () => {
    // Empty store - no .zmetadata
    mockStoreData = new Map();

    await expect(
      Dataset.zarr("http://example.com/data.zarr", {}),
    ).rejects.toThrow("Consolidated metadata is required");
  });

  test("_coordinates as object (not JSON string)", async () => {
    const var1 = zarrV2Array([10], ["x"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": { _coordinates: { x: "lon", t: "time" } },
      "var1/.zarray": var1.zarray,
      "var1/.zattrs": var1.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(ds.coordkeys).toEqual({ x: "lon", t: "time" });
  });

  test("missing _coordinates defaults to empty coordkeys", async () => {
    const var1 = zarrV2Array([10], ["x"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "var1/.zarray": var1.zarray,
      "var1/.zattrs": var1.zattrs,
    });

    const ds = await Dataset.zarr("http://example.com/data.zarr", {});
    expect(ds.coordkeys).toEqual({});
  });

  test("coordkeys option overrides _coordinates from attributes", async () => {
    const var1 = zarrV2Array([10], ["x"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": { _coordinates: JSON.stringify({ x: "lon" }) },
      "var1/.zarray": var1.zarray,
      "var1/.zattrs": var1.zattrs,
    });

    const ds = await Dataset.zarr(
      "http://example.com/data.zarr",
      {},
      {
        coordkeys: { t: "time", x: "longitude" },
      },
    );
    // Explicit coordkeys should override _coordinates from attributes
    expect(ds.coordkeys).toEqual({ t: "time", x: "longitude" });
  });

  test("deeply nested groups with group option", async () => {
    const var1 = zarrV2Array([10], ["x"]);
    const var2 = zarrV2Array([5], ["y"]);

    mockStoreData = buildConsolidatedStore({
      ".zgroup": { zarr_format: 2 },
      ".zattrs": {},
      "level1/.zgroup": { zarr_format: 2 },
      "level1/.zattrs": {},
      "level1/level2/.zgroup": { zarr_format: 2 },
      "level1/level2/.zattrs": {},
      "level1/level2/data1/.zarray": var1.zarray,
      "level1/level2/data1/.zattrs": var1.zattrs,
      "level1/level2/data2/.zarray": var2.zarray,
      "level1/level2/data2/.zattrs": var2.zattrs,
    });

    const ds = await Dataset.zarr(
      "http://example.com/data.zarr",
      {},
      {
        group: "level1/level2",
      },
    );
    expect(Object.keys(ds.variables).sort()).toEqual(["data1", "data2"]);
    expect(ds.dimensions).toEqual({ x: 10, y: 5 });
  });
});
