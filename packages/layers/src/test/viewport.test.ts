import { describe, it, expect, vi } from "vitest";
import {
  getViewportBbox,
  bboxContained,
  bboxIntersects,
  debounce,
} from "../utils/viewport";

describe("getViewportBbox", () => {
  const mockViewport = {
    getBounds: (): [number, number, number, number] => [170, -40, 180, -30],
  };

  it("extracts bbox with default padding", () => {
    const bbox = getViewportBbox(mockViewport);
    expect(bbox.west).toBe(170 - 1); // 10% of 10 = 1
    expect(bbox.east).toBe(180 + 1);
    expect(bbox.south).toBe(-40 - 1);
    expect(bbox.north).toBe(-30 + 1);
  });

  it("respects custom padding", () => {
    const bbox = getViewportBbox(mockViewport, 0.2);
    expect(bbox.west).toBe(170 - 2);
    expect(bbox.east).toBe(180 + 2);
  });

  it("clamps latitude to [-90, 90]", () => {
    const polarViewport = {
      getBounds: (): [number, number, number, number] => [-180, -88, 180, 88],
    };
    const bbox = getViewportBbox(polarViewport, 0.1);
    expect(bbox.south).toBeGreaterThanOrEqual(-90);
    expect(bbox.north).toBeLessThanOrEqual(90);
  });

  it("applies zero padding", () => {
    const bbox = getViewportBbox(mockViewport, 0);
    expect(bbox.west).toBe(170);
    expect(bbox.east).toBe(180);
    expect(bbox.south).toBe(-40);
    expect(bbox.north).toBe(-30);
  });
});

describe("bboxContained", () => {
  const fetched = { west: 160, south: -50, east: 190, north: -20 };

  it("returns true when current is inside fetched", () => {
    const current = { west: 170, south: -40, east: 180, north: -30 };
    expect(bboxContained(current, fetched)).toBe(true);
  });

  it("returns false when current extends beyond west", () => {
    const current = { west: 150, south: -40, east: 180, north: -30 };
    expect(bboxContained(current, fetched)).toBe(false);
  });

  it("returns false when current extends beyond east", () => {
    const current = { west: 170, south: -40, east: 200, north: -30 };
    expect(bboxContained(current, fetched)).toBe(false);
  });

  it("returns false when fetched is null", () => {
    expect(bboxContained({ west: 0, south: 0, east: 1, north: 1 }, null)).toBe(
      false,
    );
  });
});

describe("bboxIntersects", () => {
  const extent = { west: 160, south: -50, east: 190, north: -20 };

  it("returns true when boxes overlap", () => {
    expect(
      bboxIntersects({ west: 170, south: -40, east: 180, north: -30 }, extent),
    ).toBe(true);
  });

  it("returns true when one box partially overlaps on the west side", () => {
    expect(
      bboxIntersects({ west: 150, south: -40, east: 165, north: -30 }, extent),
    ).toBe(true);
  });

  it("returns false when box is entirely to the west", () => {
    expect(
      bboxIntersects({ west: 100, south: -40, east: 159, north: -30 }, extent),
    ).toBe(false);
  });

  it("returns false when box is entirely to the east", () => {
    expect(
      bboxIntersects({ west: 191, south: -40, east: 200, north: -30 }, extent),
    ).toBe(false);
  });

  it("returns false when box is entirely to the south", () => {
    expect(
      bboxIntersects({ west: 170, south: -80, east: 180, north: -51 }, extent),
    ).toBe(false);
  });

  it("returns false when box is entirely to the north", () => {
    expect(
      bboxIntersects({ west: 170, south: -19, east: 180, north: 0 }, extent),
    ).toBe(false);
  });

  it("returns false when second argument is null", () => {
    expect(
      bboxIntersects({ west: 170, south: -40, east: 180, north: -30 }, null),
    ).toBe(false);
  });

  it("returns false when boxes only touch on an edge", () => {
    // touching: a.west === b.east → a.west < b.east is false
    expect(
      bboxIntersects({ west: 190, south: -40, east: 200, north: -30 }, extent),
    ).toBe(false);
  });
});

describe("debounce", () => {
  it("calls function after delay", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced("a");
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 80));
    expect(fn).toHaveBeenCalledWith("a");
  });

  it("coalesces rapid calls", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced("a");
    debounced("b");
    debounced("c");
    await new Promise((r) => setTimeout(r, 80));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("cancel prevents execution", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced();
    debounced.cancel();
    await new Promise((r) => setTimeout(r, 80));
    expect(fn).not.toHaveBeenCalled();
  });
});
