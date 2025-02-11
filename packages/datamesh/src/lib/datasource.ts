import { Geometry } from "geojson";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { DataVariable } from "./datamodel";

export type Coordinate =
  | "s" // locations assumed stationary, datasource multigeometry coordinate indexed by station coordinate
  | "e" // Ensemble
  | "b" // Raster band
  | "c" // Category
  | "q" // Quantile
  | "n" // Season
  | "m" // Month
  | "t" // Time
  | "z" // Vertical coordinate
  | "y" // Horizontal northerly
  | "x" // Horizontal easterly
  | "g" // Abstract coordinate - a 2 or 3D geometry that defines a feature location
  | "f" // Frequency - spectra
  | "d" // Direction - spectra or stats
  | "i" // Coordinate_i
  | "j" // Coordinate_j
  | "k"; // Coordinate_k

export type Coordmap = {
  [key in Coordinate]?: string;
};

/**
 * Represents the internal schema of a data source.
 */
export type Schema = {
  /**
   * Attributes of the schema.
   */
  attributes?: Record<string, string | number>;

  /**
   * Dimensions of the schema.
   */
  dimensions: Record<string, number>;

  /**
   * Coordinate map of the schema.
   */
  coordmap?: Coordmap;

  /**
   * Data variables of the schema.
   */
  variables: Record<string, DataVariable>;
};

/**
 * Datamesh schema
 */

export type DatameshSchema = {
  /**
   * Attributes of the schema.
   */
  attrs?: Record<string, string | number>;

  /**
   * Dimensions of the schema.
   */
  dims: Record<string, number>;

  /**
   * Coordinate map of the schema.
   */
  coords?: Record<string, DatameshSchema>;

  /**
   * Data variables of the schema.
   */
  data_vars?: Record<string, DatameshSchema>;
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
  schema: DatameshSchema;

  /**
   * Coordinate map for the data source.
   */
  coordinates: Coordmap;

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
