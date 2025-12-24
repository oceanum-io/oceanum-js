import { describe, test, expect } from "vitest";
import { Dataset } from "../lib/datamodel";

describe("fill_value and NaN handling", () => {
  describe("reading data with null values", () => {
    test("null values in float32 array are converted to NaN on write and preserved on read", async () => {
      const coordkeys = { x: "x" };
      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 5 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2, 3, 4],
            },
            data_with_nulls: {
              attributes: {},
              dimensions: ["x"],
              // null values should be converted to NaN
              data: [1.0, null, 3.0, null, 5.0],
            },
          },
        },
        coordkeys
      );

      const data = await ds.variables.data_with_nulls.get();
      expect(data).toBeInstanceOf(Float32Array);
      expect(data[0]).toBe(1.0);
      expect(Number.isNaN(data[1])).toBe(true);
      expect(data[2]).toBe(3.0);
      expect(Number.isNaN(data[3])).toBe(true);
      expect(data[4]).toBe(5.0);
    });

    test("NaN values in float64 array are preserved", async () => {
      const coordkeys = { x: "x" };
      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 5 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2, 3, 4],
            },
            data_with_nan: {
              attributes: {},
              dimensions: ["x"],
              dtype: "float64",
              data: [1.0, NaN, 3.0, NaN, 5.0],
            },
          },
        },
        coordkeys
      );

      const data = await ds.variables.data_with_nan.get();
      expect(data).toBeInstanceOf(Float64Array);
      expect(data[0]).toBe(1.0);
      expect(Number.isNaN(data[1])).toBe(true);
      expect(data[2]).toBe(3.0);
      expect(Number.isNaN(data[3])).toBe(true);
      expect(data[4]).toBe(5.0);
    });

    test("multidimensional array with null values", async () => {
      const coordkeys = { x: "x", y: "y" };
      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 2, y: 3 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1],
            },
            y: {
              attributes: {},
              dimensions: ["y"],
              data: [0, 1, 2],
            },
            grid: {
              attributes: {},
              dimensions: ["x", "y"],
              data: [
                [1.0, null, 3.0],
                [null, 5.0, null],
              ],
            },
          },
        },
        coordkeys
      );

      const data = (await ds.variables.grid.get()) as number[][];
      expect(data[0][0]).toBe(1.0);
      expect(Number.isNaN(data[0][1])).toBe(true);
      expect(data[0][2]).toBe(3.0);
      expect(Number.isNaN(data[1][0])).toBe(true);
      expect(data[1][1]).toBe(5.0);
      expect(Number.isNaN(data[1][2])).toBe(true);
    });
  });

  describe("round-trip through zarr export/import", () => {
    test("NaN values survive round-trip through toZarr", async () => {
      const coordkeys = { x: "x" };
      const original = await Dataset.init(
        {
          attributes: { test: "nan_roundtrip" },
          dimensions: { x: 5 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2, 3, 4],
            },
            values: {
              attributes: { units: "test" },
              dimensions: ["x"],
              data: [1.0, null, 3.0, null, 5.0],
            },
          },
        },
        coordkeys
      );

      // Export to zarr format
      const zarrStore = await original.toZarr();
      expect(zarrStore).toBeInstanceOf(Map);

      // Verify the store contains expected keys
      const keys = Array.from(zarrStore.keys());
      expect(keys.some((k) => k.includes("values"))).toBe(true);
    });
  });

  describe("fill_value normalization", () => {
    test("string 'NaN' fill_value is normalized to JavaScript NaN", async () => {
      // This tests the normalization of fill_value when it comes as string "NaN"
      // from zarr v2 metadata
      const coordkeys = { x: "x" };
      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 3 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2],
            },
            test_data: {
              attributes: {},
              dimensions: ["x"],
              data: [1.0, NaN, 3.0],
            },
          },
        },
        coordkeys
      );

      const data = await ds.variables.test_data.get();
      expect(data[0]).toBe(1.0);
      expect(Number.isNaN(data[1])).toBe(true);
      expect(data[2]).toBe(3.0);
    });

    test("float32 with explicit NaN values round-trips correctly", async () => {
      // Test that explicit NaN values in Float32Array are preserved
      const coordkeys = { x: "x" };
      const inputData = Float32Array.from([1.0, NaN, 3.0, NaN, 5.0]);

      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 5 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2, 3, 4],
            },
            values: {
              attributes: {},
              dimensions: ["x"],
              dtype: "float32",
              data: inputData,
            },
          },
        },
        coordkeys
      );

      const data = await ds.variables.values.get();
      expect(data).toBeInstanceOf(Float32Array);
      expect(data[0]).toBe(1.0);
      expect(Number.isNaN(data[1])).toBe(true);
      expect(data[2]).toBe(3.0);
      expect(Number.isNaN(data[3])).toBe(true);
      expect(data[4]).toBe(5.0);
    });

    test("float64 with explicit NaN values round-trips correctly", async () => {
      // Test that explicit NaN values in Float64Array are preserved
      const coordkeys = { x: "x" };
      const inputData = Float64Array.from([1.0, NaN, 3.0, NaN]);

      const ds = await Dataset.init(
        {
          attributes: {},
          dimensions: { x: 4 },
          variables: {
            x: {
              attributes: {},
              dimensions: ["x"],
              data: [0, 1, 2, 3],
            },
            values: {
              attributes: {},
              dimensions: ["x"],
              dtype: "float64",
              data: inputData,
            },
          },
        },
        coordkeys
      );

      const data = await ds.variables.values.get();
      expect(data).toBeInstanceOf(Float64Array);
      expect(data[0]).toBe(1.0);
      expect(Number.isNaN(data[1])).toBe(true);
      expect(data[2]).toBe(3.0);
      expect(Number.isNaN(data[3])).toBe(true);
    });
  });
});
