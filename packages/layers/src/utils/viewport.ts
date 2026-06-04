export interface Bbox {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Viewport {
  // deck.gl v9+ returns a flat [west, south, east, north] tuple
  getBounds: () => [number, number, number, number];
}

export function getViewportBbox(viewport: Viewport, padding = 0.1): Bbox {
  const bounds = viewport.getBounds();
  const west = bounds[0];
  const south = bounds[1];
  const east = bounds[2];
  const north = bounds[3];

  const lonSpan = east - west;
  const latSpan = north - south;
  const lonPad = lonSpan * padding;
  const latPad = latSpan * padding;

  return {
    west: west - lonPad,
    south: Math.max(-90, south - latPad),
    east: east + lonPad,
    north: Math.min(90, north + latPad),
  };
}

export function bboxIntersects(a: Bbox, b: Bbox | null): boolean {
  if (!b) return false;
  return (
    a.west < b.east && a.east > b.west && a.south < b.north && a.north > b.south
  );
}

export function bboxContained(current: Bbox, fetched: Bbox | null): boolean {
  if (!fetched) return false;
  return (
    current.west >= fetched.west &&
    current.south >= fetched.south &&
    current.east <= fetched.east &&
    current.north <= fetched.north
  );
}

/**
 * Recursively find min/max of any numeric value in a nested array / typed array.
 * Handles NdArray-like structures returned by `@oceanum/datamesh`'s `DataVar.get()`
 * where a 1D fetch returns a TypedArray but 2D (curvilinear) fetches return nested
 * arrays of TypedArrays. Ignores NaN, +/-Infinity and non-finite values.
 */
function minMaxRecursive(
  value: unknown,
  acc: { min: number; max: number },
): void {
  if (value == null) return;
  if (typeof value === "number") {
    if (Number.isFinite(value)) {
      if (value < acc.min) acc.min = value;
      if (value > acc.max) acc.max = value;
    }
    return;
  }
  // Typed arrays and regular arrays both have numeric length and index access.
  const arr = value as ArrayLike<unknown>;
  if (typeof arr.length !== "number") return;
  for (let i = 0; i < arr.length; i++) {
    minMaxRecursive(arr[i], acc);
  }
}

/**
 * Compute a geographic bounding box (degrees) from longitude and latitude
 * coordinate arrays as returned by `@oceanum/datamesh`'s `DataVar.get()`.
 *
 * Supports both 1D typed arrays (rectilinear grids) and 2D nested arrays
 * of typed arrays (curvilinear grids). If CF-convention attributes
 * (`geospatial_lon_min`, `geospatial_lon_max`, `geospatial_lat_min`,
 * `geospatial_lat_max`) are present on `attributes` they are used directly.
 */
export function computeDataExtent(
  lons: unknown,
  lats: unknown,
  attributes?: Record<string, unknown> | null,
): Bbox | null {
  if (attributes) {
    const w = Number(attributes.geospatial_lon_min);
    const e = Number(attributes.geospatial_lon_max);
    const s = Number(attributes.geospatial_lat_min);
    const n = Number(attributes.geospatial_lat_max);
    if (
      Number.isFinite(w) &&
      Number.isFinite(e) &&
      Number.isFinite(s) &&
      Number.isFinite(n)
    ) {
      return { west: w, east: e, south: s, north: n };
    }
  }

  if (lons == null || lats == null) return null;

  const lonAcc = { min: Infinity, max: -Infinity };
  const latAcc = { min: Infinity, max: -Infinity };
  minMaxRecursive(lons, lonAcc);
  minMaxRecursive(lats, latAcc);

  if (
    !Number.isFinite(lonAcc.min) ||
    !Number.isFinite(lonAcc.max) ||
    !Number.isFinite(latAcc.min) ||
    !Number.isFinite(latAcc.max)
  ) {
    return null;
  }

  return {
    west: lonAcc.min,
    east: lonAcc.max,
    south: latAcc.min,
    north: latAcc.max,
  };
}

export interface DebouncedFn {
  (...args: unknown[]): void;
  cancel: () => void;
}

export function debounce(
  fn: (...args: unknown[]) => void,
  wait: number,
): DebouncedFn {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = ((...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  }) as DebouncedFn;
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced;
}
