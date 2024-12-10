import { Geometry } from "geojson";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { DataVariable } from "./datamodel";

export enum Coordinate {
  "Station" = "s", // locations assumed stationary, datasource multigeometry coordinate indexed by station coordinate
  "Ensemble" = "e",
  "Raster band" = "b",
  "Category" = "c",
  "Quantile" = "q",
  "Season" = "n",
  "Month" = "m",
  "Time" = "t",
  "Vertical coordinate" = "z",
  "Horizontal northerly" = "y",
  "Horizontal easterly" = "x",
  "Geometry" = "g", // Abstract coordinate - a 2 or 3D geometry that defines a feature location
  "Frequency" = "f", // spectra
  "Direction" = "d", // spectra or stats
  "Coordinate_i" = "i",
  "Coordinate_j" = "j",
  "Coordinate_k" = "k",
}

export type Coordinates = {
  [key in Coordinate]?: string;
};

/**
 * Represents the schema of a data source.
 */
export type Schema = {
  /**
   * Attributes of the schema.
   */
  attrs?: Record<string, string | number>;

  /**
   * Dimensions of the schema.
   */
  dims: Record<string, number>;

  /**
   * Coordinates of the schema.
   */
  coords?: Record<string, DataVariable>;

  /**
   * Data variables of the schema.
   */
  data_vars: Record<string, DataVariable>;
};

/**
 * Represents a data source.
 */
export type Datasource = {
  /**
   * Unique identifier for the data source.
   */
  id: string;

  /**
   * Name of the data source.
   */
  name: string;

  /**
   * Description of the data source.
   */
  description?: string;

  /**
   * Parameters associated with the data source.
   */
  parameters?: Record<string, unknown>;

  /**
   * Geometric representation of the data source.
   */
  geom?: Geometry;

  /**
   * Start time for the data source.
   */
  tstart?: dayjs.Dayjs;

  /**
   * End time for the data source.
   */
  tend?: dayjs.Dayjs;

  /**
   * Forecast time period for the data source.
   */
  pforecast?: duration.Duration;

  /**
   * Archive time period for the data source.
   */
  parchive?: duration.Duration;

  /**
   * Tags associated with the data source.
   */
  tags?: string[];

  /**
   * Additional information about the data source.
   */
  info?: Record<string, unknown>;

  /**
   * Schema information for the data source.
   */
  schema: Schema;

  /**
   * Coordinate mappings for the data source.
   */
  coordinates: Coordinates;

  /**
   * Additional details about the data source.
   */
  details?: string;

  /**
   * Last modified date of the data source.
   */
  last_modified?: Date;

  driver: string;
};
