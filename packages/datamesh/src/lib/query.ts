import { Feature } from "geojson";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * GeoFilterType type representing types of geofilters.
 */
export type GeoFilterType = "feature" | "bbox";

/**
 * GeoFilterInterp type representing interpolation methods for geofilters.
 */
export type GeoFilterInterp = "nearest" | "linear";

/**
 * LevelFilterInterp type representing interpolation methods for level filters.
 */
export type LevelFilterInterp = "nearest" | "linear";

/**
 * TimeFilterType type representing types of time filters.
 */
export type TimeFilterType = "range" | "series" | "trajectory";

/**
 * LevelFilterType type representing types of level filters.
 */
export type LevelFilterType = "range" | "series";

/**
 * ResampleType type representing types of resampling.
 */
export type ResampleType = "mean" | "nearest" | "linear";

/**
 * AggregateOps type representing aggregation operations.
 */
export type AggregateOps = "mean" | "min" | "max" | "std" | "sum";

/**
 * Container type representing data container types.
 */
export type Container = "geodataframe" | "dataframe" | "dataset";

export interface GeoFilterFeature extends Omit<Feature, "properties"> {
  properties?: Record<string, unknown> | undefined;
}

/**
 * GeoFilter type representing a spatial subset or interpolation.
 */
export type GeoFilter = {
  type: GeoFilterType;
  geom: Array<number[]> | GeoFilterFeature;
  interp?: GeoFilterInterp;
  resolution?: number;
  alltouched?: boolean;
};

/**
 * LevelFilter type representing a vertical subset or interpolation.
 */
export type LevelFilter = {
  type: LevelFilterType;
  levels: Array<number | null>;
  interp?: LevelFilterInterp;
};

/**
 * TimeFilter type representing a temporal subset or interpolation.
 */
export type TimeFilter = {
  type?: TimeFilterType;
  times: Array<Date | dayjs.Dayjs | duration.Duration | string>;
  resolution?: string;
  resample?: ResampleType;
};

const stringifyTime = (
  t: Date | dayjs.Dayjs | duration.Duration | string
): string => {
  if (t instanceof Date) {
    return dayjs(t as Date).toISOString();
  } else if (t instanceof dayjs) {
    return (t as dayjs.Dayjs).toISOString();
  } else if (t instanceof dayjs.duration) {
    return (t as duration.Duration).toISOString();
  } else {
    try {
      return dayjs.duration(t as string).toISOString();
    } catch {
      return dayjs(t as string).toISOString();
    }
  }
};

const timeFilterValidate = (timefilter: TimeFilter): TimeFilter => {
  const times = timefilter.times.map((t) => stringifyTime(t));

  return {
    type: timefilter.type || "range",
    times,
    resolution: timefilter.resolution,
    resample: timefilter.resample,
  };
};

/**
 * Aggregate type representing aggregation operations.
 */
export type Aggregate = {
  operations: AggregateOps[];
  spatial?: boolean;
  temporal?: boolean;
};

/**
 * CoordSelector type representing coordinate selection.
 */
export type CoordSelector = {
  coord: string;
  values: Array<string | number>;
};

/**
 * Query interface representing a Datamesh query.
 */
export interface IQuery {
  datasource: string;
  parameters?: Record<string, number | string>;
  description?: string;
  variables?: string[];
  timefilter?: TimeFilter;
  geofilter?: GeoFilter;
  levelfilter?: LevelFilter;
  coordfilter?: CoordSelector[];
  crs?: string | number;
  aggregate?: Aggregate;
  limit?: number;
  id?: string;
}

/**
 * Stage interface representing the result of staging a query.
 */
/** @ignore */
export type Stage = {
  query: Query;
  qhash: string;
  formats: string[];
  size: number;
  dlen: number;
  coordmap: Record<string, string>;
  coordkeys: Record<string, string>;
  container: Container;
  sig: string;
};

/**
 * Query class representing a Datamesh query.
 */
export class Query implements IQuery {
  datasource: string;
  parameters?: Record<string, number | string | number[] | string[]>;
  description?: string;
  variables?: string[];
  timefilter?: TimeFilter;
  geofilter?: GeoFilter;
  levelfilter?: LevelFilter;
  coordfilter?: CoordSelector[];
  crs?: string | number;
  aggregate?: Aggregate;
  limit?: number;
  id?: string;

  constructor(query: IQuery) {
    this.datasource = query.datasource;
    this.parameters = query.parameters;
    this.description = query.description;
    this.variables = query.variables;
    this.timefilter = query.timefilter && timeFilterValidate(query.timefilter);
    this.geofilter = query.geofilter;
    this.levelfilter = query.levelfilter;
    this.coordfilter = query.coordfilter;
    this.crs = query.crs;
    this.aggregate = query.aggregate;
    this.limit = query.limit;
    this.id = query.id;
  }

  /**
   * Returns the query as a JSON object.
   */
  toJSON(): Record<string, unknown> {
    return {
      datasource: this.datasource,
      parameters: this.parameters,
      description: this.description,
      variables: this.variables,
      timefilter: this.timefilter,
      geofilter: this.geofilter,
      levelfilter: this.levelfilter,
      coordfilter: this.coordfilter,
      crs: this.crs,
      aggregate: this.aggregate,
      limit: this.limit,
      id: this.id,
    };
  }
}
