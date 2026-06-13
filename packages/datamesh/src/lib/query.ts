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
 *
 * Each entry in `times` may be an absolute time (a `Date`, a dayjs object or an
 * ISO8601 datetime string) or a period relative to the current time (a dayjs
 * duration or an ISO8601 duration string such as `"P7D"`).
 *
 * Periods follow the ISO8601-2 convention where a leading minus sign denotes a
 * negative period. A period is resolved relative to the current time: a
 * positive period (e.g. `"P7D"`) resolves to a time *after* now, while a
 * negative period (e.g. `"-P7D"`) resolves to a time *before* now. This applies
 * equally to the start and end of a range, so e.g. `times: ["-P7D", "P1D"]`
 * selects from 7 days before now to 1 day after now.
 */
export type TimeFilter = {
  type?: TimeFilterType;
  times: Array<Date | dayjs.Dayjs | duration.Duration | string>;
  resolution?: string;
  resample?: ResampleType;
};

/**
 * Convert a time or period value into the string used in the query payload.
 *
 * Absolute times become ISO8601 datetime strings; periods become ISO8601
 * duration strings, preserving the ISO8601-2 sign so that negative periods
 * (e.g. `"-P7D"`) are sent through unchanged rather than being coerced to
 * positive ones.
 */
const stringifyTime = (
  t: Date | dayjs.Dayjs | duration.Duration | string,
): string => {
  if (t instanceof Date) {
    return dayjs(t).toISOString();
  } else if (dayjs.isDayjs(t)) {
    return t.toISOString();
  } else if (dayjs.isDuration(t)) {
    // Duration objects already encode the sign in toISOString().
    return t.toISOString();
  }
  const s = t as string;
  // ISO8601 duration: optional ISO8601-2 sign followed by 'P...'.
  const match = s.match(/^([+-])?P/);
  if (match) {
    // dayjs.duration() drops the leading sign when parsing a string, so strip
    // and re-apply it to preserve negative periods.
    const sign = match[1] === "-" ? "-" : "";
    return sign + dayjs.duration(s.replace(/^[+-]/, "")).toISOString();
  }
  return dayjs(s).toISOString();
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
