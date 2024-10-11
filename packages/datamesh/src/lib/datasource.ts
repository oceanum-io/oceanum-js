import { Geometry } from "geojson";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

/**
 * Represents a data variable.
 */
interface DataVariable {
  /**
   * Attributes of the variable.
   */
  attrs: Record<string, unknown>;
  /**
   * Dimensions of the variable
   *  */
  dims: string[];
  /**
   * Datatype of the variable.
   */
  dtype?: string;
}

/**
 * Represents the schema of a data source.
 */
interface Schema {
  /**
   * Attributes of the schema.
   */
  attrs: Record<string, unknown>;

  /**
   * Dimensions of the schema.
   */
  dims: Record<string, unknown>;

  /**
   * Coordinates of the schema.
   */
  coords?: Record<string, DataVariable>;

  /**
   * Data variables of the schema.
   */
  data_vars: Record<string, DataVariable>;
}
/**
 * Represents a data source.
 */
export interface Datasource {
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
  coordinates: Record<string, string>;

  /**
   * Additional details about the data source.
   */
  details?: string;

  /**
   * Last modified date of the data source.
   */
  last_modified?: Date;
}
