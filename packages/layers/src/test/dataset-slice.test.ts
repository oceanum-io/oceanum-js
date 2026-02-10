import { describe, it, expect } from "vitest";
import {
  nearestTimeIndex,
  clampLevelIndex,
  indexRange,
  sliceDataset,
} from "../utils/dataset-slice";

describe("nearestTimeIndex", () => {
  const times = [1000, 2000, 3000, 4000, 5000];

  it("finds exact match", () => {
    expect(nearestTimeIndex(times, new Date(3000 * 1000))).toBe(2);
  });

  it("finds nearest when between values", () => {
    expect(nearestTimeIndex(times, new Date(2800 * 1000))).toBe(2);
    expect(nearestTimeIndex(times, new Date(2200 * 1000))).toBe(1);
  });

  it("handles ISO string input", () => {
    expect(nearestTimeIndex(times, "1970-01-01T00:50:00Z")).toBe(2);
  });

  it("clamps to first when before range", () => {
    expect(nearestTimeIndex(times, new Date(0))).toBe(0);
  });

  it("clamps to last when after range", () => {
    expect(nearestTimeIndex(times, new Date(99999 * 1000))).toBe(4);
  });

  it("handles empty array", () => {
    expect(nearestTimeIndex([], new Date(1000 * 1000))).toBe(0);
  });

  it("handles single element", () => {
    expect(nearestTimeIndex([3000], new Date(5000 * 1000))).toBe(0);
  });
});

describe("clampLevelIndex", () => {
  it("returns the index when in range", () => {
    expect(clampLevelIndex(2, 5)).toBe(2);
  });

  it("clamps to 0 when negative", () => {
    expect(clampLevelIndex(-1, 5)).toBe(0);
  });

  it("clamps to max when too high", () => {
    expect(clampLevelIndex(10, 5)).toBe(4);
  });

  it("returns 0 when nlevels is 0", () => {
    expect(clampLevelIndex(3, 0)).toBe(0);
  });
});

describe("indexRange", () => {
  it("finds range in ascending coordinates", () => {
    const coords = [10, 20, 30, 40, 50];
    const [start, end] = indexRange(coords, 25, 45);
    expect(start).toBeLessThanOrEqual(2);
    expect(end).toBeGreaterThanOrEqual(3);
    expect(coords[start]).toBeLessThanOrEqual(25);
    expect(coords[end]).toBeGreaterThanOrEqual(45);
  });

  it("handles full range request", () => {
    const coords = [10, 20, 30, 40, 50];
    const [start, end] = indexRange(coords, 0, 60);
    expect(start).toBe(0);
    expect(end).toBe(4);
  });

  it("handles empty array", () => {
    expect(indexRange([], 10, 20)).toEqual([0, 0]);
  });

  it("handles single element", () => {
    const [start, end] = indexRange([15], 10, 20);
    expect(start).toBe(0);
    expect(end).toBe(0);
  });

  it("handles descending coordinates", () => {
    const coords = [50, 40, 30, 20, 10];
    const [start, end] = indexRange(coords, 15, 35);
    expect(coords[start]).toBeGreaterThanOrEqual(15);
    expect(coords[end]).toBeLessThanOrEqual(35);
  });
});

describe("sliceDataset", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeMockVariable(dims: string[], data: any) {
    return {
      dimensions: dims,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async get(indexSpec: any) {
        if (!indexSpec) return data;
        return applySpecs(data, indexSpec, 0);
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function applySpecs(data: any, specs: any[], depth: number): any {
    if (depth >= specs.length) return data;
    const spec = specs[depth];

    if (typeof spec === "number") {
      return applySpecs(data[spec], specs, depth + 1);
    } else if (spec && typeof spec === "object" && "start" in spec) {
      const sliced = data.slice(spec.start, spec.stop);
      if (depth + 1 >= specs.length) return sliced;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return sliced.map((row: any) => applySpecs(row, specs, depth + 1));
    }
    if (depth + 1 >= specs.length) return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => applySpecs(row, specs, depth + 1));
  }

  const coordNames = { x: "lon", y: "lat", t: "time", z: undefined };

  const lonData = [170, 175, 180, 185, 190];
  const latData = [-40, -35, -30, -25];

  const hsData = [
    // time=0
    [
      [1.0, 1.1, 1.2, 1.3, 1.4],
      [2.0, 2.1, 2.2, 2.3, 2.4],
      [3.0, 3.1, 3.2, 3.3, 3.4],
      [4.0, 4.1, 4.2, 4.3, 4.4],
    ],
    // time=1
    [
      [5.0, 5.1, 5.2, 5.3, 5.4],
      [6.0, 6.1, 6.2, 6.3, 6.4],
      [7.0, 7.1, 7.2, 7.3, 7.4],
      [8.0, 8.1, 8.2, 8.3, 8.4],
    ],
    // time=2
    [
      [9.0, 9.1, 9.2, 9.3, 9.4],
      [10.0, 10.1, 10.2, 10.3, 10.4],
      [11.0, 11.1, 11.2, 11.3, 11.4],
      [12.0, 12.1, 12.2, 12.3, 12.4],
    ],
  ];

  const dataset = {
    variables: {
      lon: makeMockVariable(["lon"], lonData),
      lat: makeMockVariable(["lat"], latData),
      hs: makeMockVariable(["time", "lat", "lon"], hsData),
    },
  };

  it("slices at a specific time index and full spatial range", async () => {
    const result = await sliceDataset(
      dataset,
      coordNames,
      ["hs"],
      1, // timeIndex
      0, // levelIndex (no level dim)
      [0, 3], // latRange: all 4 rows
      [0, 4], // lonRange: all 5 cols
    );

    expect(result.coords.lon.data).toEqual([170, 175, 180, 185, 190]);
    expect(result.coords.lat.data).toEqual([-40, -35, -30, -25]);
    expect(result.data_vars.hs.data).toEqual([
      [5.0, 5.1, 5.2, 5.3, 5.4],
      [6.0, 6.1, 6.2, 6.3, 6.4],
      [7.0, 7.1, 7.2, 7.3, 7.4],
      [8.0, 8.1, 8.2, 8.3, 8.4],
    ]);
  });

  it("slices at a spatial subset", async () => {
    const result = await sliceDataset(
      dataset,
      coordNames,
      ["hs"],
      0, // timeIndex
      0,
      [1, 2], // lat rows 1-2
      [1, 3], // lon cols 1-3
    );

    expect(result.coords.lon.data).toEqual([175, 180, 185]);
    expect(result.coords.lat.data).toEqual([-35, -30]);
    expect(result.data_vars.hs.data).toEqual([
      [2.1, 2.2, 2.3],
      [3.1, 3.2, 3.3],
    ]);
  });
});
