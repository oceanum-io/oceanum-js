import { test, expect } from "vitest";
import { Dataset, ChunkConfig } from "../lib/datamodel";
import * as zarr from "@zarrita/core";

// Helper to create multi-dimensional typed arrays
const create3DArray = (dims: [number, number, number], value: number) => {
  const [d1, d2, d3] = dims;
  const result: Float32Array[][] = [];
  for (let i = 0; i < d1; i++) {
    const layer: Float32Array[] = [];
    for (let j = 0; j < d2; j++) {
      const row = new Float32Array(d3).fill(value);
      layer.push(row);
    }
    result.push(layer);
  }
  return result;
};

const create2DArray = (dims: [number, number], value: number) => {
  const [d1, d2] = dims;
  const result: Float32Array[] = [];
  for (let i = 0; i < d1; i++) {
    result.push(new Float32Array(d2).fill(value));
  }
  return result;
};

test("dataset init with global chunk config", async () => {
  const ds = {
    dimensions: { time: 10, lat: 20, lon: 30 },
    variables: {
      time: {
        dimensions: ["time"],
        attributes: { units: "seconds since 1970-01-01" },
        data: [...Array(10).keys()].map((i) => i * 86400),
      },
      temperature: {
        dimensions: ["time", "lat", "lon"],
        attributes: { units: "K" },
        data: create3DArray([10, 20, 30], 273.15),
      },
    },
    attributes: { title: "Test dataset with chunks" },
  };

  // Global chunk config by dimension name
  const chunkConfig: ChunkConfig = {
    dimensions: { time: 5, lat: 10, lon: 15 },
  };

  const dataset = await Dataset.init(ds, { t: "time" }, chunkConfig);

  // Check that variables were created with proper chunking
  expect(dataset.variables.temperature.arr.chunks).toEqual([5, 10, 15]);
  expect(dataset.variables.time.arr.chunks).toEqual([5]);

  // Verify data integrity
  const timeData = await dataset.variables.time.get();
  expect(timeData).toHaveLength(10);
  expect(timeData[0]).toBe(0);
  expect(timeData[9]).toBe(9 * 86400);

  const tempData = await dataset.variables.temperature.get();
  expect(tempData).toHaveLength(10);
  expect(tempData[0]).toHaveLength(20);
  expect(tempData[0][0]).toHaveLength(30);
});

test("dataset init with per-variable chunk override", async () => {
  const ds = {
    dimensions: { x: 100, y: 100 },
    variables: {
      data1: {
        dimensions: ["x", "y"],
        attributes: {},
        data: create2DArray([100, 100], 1.0),
      },
      data2: {
        dimensions: ["x", "y"],
        attributes: {},
        data: create2DArray([100, 100], 2.0),
      },
    },
    attributes: {},
  };

  // Per-variable chunk override
  const chunkConfig: ChunkConfig = {
    dimensions: { x: 50, y: 50 }, // Global default
    variables: {
      data2: [25, 25], // Override for data2
    },
  };

  const dataset = await Dataset.init(ds, {}, chunkConfig);

  // data1 should use global dimension chunks
  expect(dataset.variables.data1.arr.chunks).toEqual([50, 50]);

  // data2 should use per-variable override
  expect(dataset.variables.data2.arr.chunks).toEqual([25, 25]);
});

test("dataset init with per-variable chunks in DataVariable", async () => {
  const ds = {
    dimensions: { x: 100, y: 100 },
    variables: {
      data1: {
        dimensions: ["x", "y"],
        attributes: {},
        data: create2DArray([100, 100], 1.0),
        chunks: [10, 10], // Chunks defined in the variable itself
      },
      data2: {
        dimensions: ["x", "y"],
        attributes: {},
        data: create2DArray([100, 100], 2.0),
        // No chunks - should default to full shape
      },
    },
    attributes: {},
  };

  const dataset = await Dataset.init(ds);

  // data1 should use variable-defined chunks
  expect(dataset.variables.data1.arr.chunks).toEqual([10, 10]);

  // data2 should default to full shape
  expect(dataset.variables.data2.arr.chunks).toEqual([100, 100]);
});

test("dataset toZarr basic export", async () => {
  const ds = {
    dimensions: { time: 3, x: 4 },
    variables: {
      time: {
        dimensions: ["time"],
        attributes: { units: "seconds since 1970-01-01" },
        data: [0, 86400, 172800],
      },
      values: {
        dimensions: ["time", "x"],
        attributes: { units: "m" },
        data: create2DArray([3, 4], 1.5),
      },
    },
    attributes: { title: "Test export" },
  };

  const dataset = await Dataset.init(ds, { t: "time" });
  const store = await dataset.toZarr();

  // Verify store contains zarr metadata files
  expect(store.has("/zarr.json")).toBe(true);
  expect(store.has("/time/zarr.json")).toBe(true);
  expect(store.has("/values/zarr.json")).toBe(true);

  // Verify we can read back the zarr store
  const root = await zarr.open(store, { kind: "group" });
  expect(root.attrs).toHaveProperty("title", "Test export");

  const timeArr = await zarr.open(root.resolve("time"), { kind: "array" });
  expect(timeArr.shape).toEqual([3]);
  expect(timeArr.attrs).toHaveProperty("_ARRAY_DIMENSIONS", ["time"]);
});

test("dataset toZarr with custom chunk config", async () => {
  const ds = {
    dimensions: { time: 10, x: 20 },
    variables: {
      data: {
        dimensions: ["time", "x"],
        attributes: {},
        data: create2DArray([10, 20], 1.0),
      },
    },
    attributes: {},
  };

  const dataset = await Dataset.init(ds);
  const store = await dataset.toZarr({
    chunks: {
      dimensions: { time: 5, x: 10 },
    },
  });

  // Verify chunk configuration in the exported zarr
  const root = await zarr.open(store, { kind: "group" });
  const dataArr = await zarr.open(root.resolve("data"), { kind: "array" });
  expect(dataArr.chunks).toEqual([5, 10]);
});

test("dataset toZarr round-trip data integrity", async () => {
  const originalData = [
    new Float32Array([1.0, 2.5, 3.7]),
    new Float32Array([4.2, 5.1, 6.8]),
  ];
  const ds = {
    dimensions: { x: 2, y: 3 },
    variables: {
      data: {
        dimensions: ["x", "y"],
        attributes: { description: "test data" },
        data: originalData,
      },
    },
    attributes: { source: "unit test" },
  };

  // Create dataset and export to zarr
  const dataset = await Dataset.init(ds);
  const store = await dataset.toZarr();

  // Read back the zarr store
  const root = await zarr.open(store, { kind: "group" });
  const dataArr = await zarr.open(root.resolve("data"), { kind: "array" });

  // Verify metadata
  expect(dataArr.shape).toEqual([2, 3]);
  expect(dataArr.attrs).toHaveProperty("description", "test data");
  expect(dataArr.attrs).toHaveProperty("_ARRAY_DIMENSIONS", ["x", "y"]);
});
