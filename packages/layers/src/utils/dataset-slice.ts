import type { CoordNames } from "./coordinates";

type TimeCoords = Float64Array | number[];

export function nearestTimeIndex(
  timeCoords: TimeCoords,
  target: string | Date,
): number {
  if (!timeCoords || timeCoords.length === 0) return 0;
  const t =
    target instanceof Date
      ? target.getTime() / 1000
      : new Date(target).getTime() / 1000;
  let lo = 0;
  let hi = timeCoords.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (timeCoords[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  if (
    lo > 0 &&
    Math.abs(timeCoords[lo - 1] - t) < Math.abs(timeCoords[lo] - t)
  ) {
    return lo - 1;
  }
  return lo;
}

export function clampLevelIndex(index: number, nlevels: number): number {
  if (nlevels <= 0) return 0;
  return Math.max(0, Math.min(index, nlevels - 1));
}

export function indexRange(
  coords: Float64Array | number[],
  min: number,
  max: number,
): [number, number] {
  if (!coords || coords.length === 0) return [0, 0];

  const ascending = coords.length < 2 || coords[1] >= coords[0];
  let start = 0;
  let end = coords.length - 1;

  if (ascending) {
    let lo = 0,
      hi = coords.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (coords[mid] < min) lo = mid + 1;
      else hi = mid;
    }
    start = Math.max(0, lo - 1);

    lo = start;
    hi = coords.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (coords[mid] > max) hi = mid - 1;
      else lo = mid;
    }
    end = Math.min(coords.length - 1, lo + 1);
  } else {
    let lo = 0,
      hi = coords.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (coords[mid] > max) lo = mid + 1;
      else hi = mid;
    }
    start = Math.max(0, lo - 1);

    lo = start;
    hi = coords.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (coords[mid] < min) hi = mid - 1;
      else lo = mid;
    }
    end = Math.min(coords.length - 1, lo + 1);
  }

  return [start, end];
}

interface ZarrSlice {
  start: number;
  stop: number;
  step: null;
}

function zarrSlice(start: number, stop: number): ZarrSlice {
  return { start, stop, step: null };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DatasetVariable = { dimensions: string[]; get: (spec: any) => Promise<any> };
interface DatasetLike {
  variables: Record<string, DatasetVariable>;
}

interface SlicedCoord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface SlicedData {
  coords: Record<string, SlicedCoord>;
  data_vars: Record<string, SlicedCoord>;
}

export async function sliceDataset(
  dataset: DatasetLike,
  coordNames: CoordNames,
  variableNames: string[],
  timeIndex: number,
  levelIndex: number,
  latRange: [number, number],
  lonRange: [number, number],
): Promise<SlicedData> {
  const coords: Record<string, SlicedCoord> = {};
  const dataVars: Record<string, SlicedCoord> = {};

  const xVar = dataset.variables[coordNames.x];
  const yVar = dataset.variables[coordNames.y];

  const [xData, yData] = await Promise.all([
    xVar.get([zarrSlice(lonRange[0], lonRange[1] + 1)]),
    yVar.get([zarrSlice(latRange[0], latRange[1] + 1)]),
  ]);

  coords[coordNames.x] = { data: xData };
  coords[coordNames.y] = { data: yData };

  const varPromises = variableNames.map(async (varName) => {
    const variable = dataset.variables[varName];
    if (!variable) return;

    const dims = variable.dimensions;

    const indexSpec = dims.map((dim: string) => {
      if (coordNames.t && dim === coordNames.t) return timeIndex;
      if (coordNames.z && dim === coordNames.z) return levelIndex;
      if (dim === coordNames.y) return zarrSlice(latRange[0], latRange[1] + 1);
      if (dim === coordNames.x) return zarrSlice(lonRange[0], lonRange[1] + 1);
      return null;
    });

    const data = await variable.get(indexSpec);
    dataVars[varName] = { data };
  });

  await Promise.all(varPromises);

  return { coords, data_vars: dataVars };
}
