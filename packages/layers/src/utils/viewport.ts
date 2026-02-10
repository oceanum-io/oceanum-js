export interface Bbox {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Viewport {
  getBounds: () => [[number, number], [number, number]];
}

export function getViewportBbox(viewport: Viewport, padding = 0.1): Bbox {
  const bounds = viewport.getBounds();
  const west = bounds[0][0];
  const south = bounds[0][1];
  const east = bounds[1][0];
  const north = bounds[1][1];

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

export function bboxContained(
  current: Bbox,
  fetched: Bbox | null,
): boolean {
  if (!fetched) return false;
  return (
    current.west >= fetched.west &&
    current.south >= fetched.south &&
    current.east <= fetched.east &&
    current.north <= fetched.north
  );
}

export interface DebouncedFn {
  (...args: unknown[]): void;
  cancel: () => void;
}

export function debounce(fn: (...args: unknown[]) => void, wait: number): DebouncedFn {
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
