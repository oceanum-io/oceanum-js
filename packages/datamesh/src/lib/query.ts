import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Feature } from "geojson";

/**
 * GeoFilterType enum representing types of geofilters.
 */
enum GeoFilterType {
  Feature = "feature",
  Bbox = "bbox",
}

/**
 * GeoFilterInterp enum representing interpolation methods for geofilters.
 */
enum GeoFilterInterp {
  Nearest = "nearest",
  Linear = "linear",
}

/**
 * LevelFilterInterp enum representing interpolation methods for level filters.
 */
enum LevelFilterInterp {
  Nearest = "nearest",
  Linear = "linear",
}

/**
 * TimeFilterType enum representing types of time filters.
 */
enum TimeFilterType {
  Range = "range",
  Series = "series",
  Trajectory = "trajectory",
}

/**
 * LevelFilterType enum representing types of level filters.
 */
enum LevelFilterType {
  Range = "range",
  Series = "series",
}

/**
 * ResampleType enum representing types of resampling.
 */
enum ResampleType {
  Mean = "mean",
  Nearest = "nearest",
  Slinear = "linear",
}

/**
 * AggregateOps enum representing aggregation operations.
 */
enum AggregateOps {
  Mean = "mean",
  Min = "min",
  Max = "max",
  Std = "std",
  Sum = "sum",
}

/**
 * Container enum representing data container types.
 */
enum Container {
  GeoDataFrame = "geodataframe",
  DataFrame = "dataframe",
  Dataset = "dataset",
}

/**
 * GeoFilter interface representing a spatial subset or interpolation.
 */
interface GeoFilter {
  type: GeoFilterType;
  geom: Array<number[]> | Feature;
  interp?: GeoFilterInterp;
  resolution?: number;
  alltouched?: boolean;
}

/**
 * LevelFilter interface representing a vertical subset or interpolation.
 */
interface LevelFilter {
  type: LevelFilterType;
  levels: Array<number | null>;
  interp?: LevelFilterInterp;
}

/**
 * TimeFilter interface representing a temporal subset or interpolation.
 */
interface TimeFilter {
  type: TimeFilterType;
  times: Array<Date | null>;
  resolution?: string;
  resample?: ResampleType;
}

/**
 * Aggregate interface representing aggregation operations.
 */
interface Aggregate {
  operations: AggregateOps[];
  spatial?: boolean;
  temporal?: boolean;
}

/**
 * CoordSelector interface representing coordinate selection.
 */
interface CoordSelector {
  coord: string;
  values: Array<string | number>;
}

/**
 * Query interface representing a Datamesh query.
 */
interface Query {
  datasource: string;
  parameters?: Record<string, any>;
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
interface Stage {
  query: Query;
  qhash: string;
  formats: string[];
  size: number;
  dlen: number;
  coordmap: Record<string, string>;
  container: Container;
  sig: string;
}

export {
  GeoFilterType,
  GeoFilterInterp,
  LevelFilterInterp,
  TimeFilterType,
  LevelFilterType,
  ResampleType,
  AggregateOps,
  Container,
  GeoFilter,
  LevelFilter,
  TimeFilter,
  Aggregate,
  Function,
  CoordSelector,
  Query,
  Stage,
};
