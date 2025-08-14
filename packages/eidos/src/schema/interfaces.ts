/**
 * Auto-generated TypeScript interfaces for EIDOS schemas
 * Generated from: https://schemas.oceanum.io/eidos/root.json
 * 
 * Each interface corresponds to a definition in the EIDOS schema bundle.
 * These interfaces can be used for type validation and IDE support.
 * 
 * Do not modify this file directly - regenerate using:
 * npx nx run eidos:generate-types
 */

/**
 * EIDOS specification
 * Complete specification for defining interactive oceanic and geospatial data visualizations using the EIDOS framework. An EIDOS specification is a declarative JSON document that describes the entire structure, layout, data sources, and interactions for a data visualization application. This top-level schema defines the root structure that contains metadata, data definitions, theming, and the hierarchical node structure that defines the user interface.
 */
export interface EidosSpec {
  /**
   * Version of EIDOS
   */
  version?: string;
  /**
   * Unique identifier for this specification. Must be URL-safe using only lowercase letters, numbers, hyphens, and underscores. This ID is used for referencing the specification in URLs, file systems, and databases. It should be descriptive but concise.
   * 
   * @example
   * "seastate-demo"
   * "plot-demo"
   * "grid-layout-demo"
   */
  id: string;
  /**
   * Human-readable display name for this specification. This is the name shown to users in lists, menus, and interfaces. It can contain spaces, special characters, and mixed case. Should be descriptive and meaningful to end users.
   * 
   * @example
   * "DemoOverlay"
   * "DemoPlot"
   * "DemoGrid"
   */
  name: string;
  /**
   * Detailed description of what this specification does and its purpose. This is primarily for documentation and metadata purposes - it's not typically displayed in the main interface but may be shown in tooltips, help text, or specification listings. Useful for developers and content creators.
   * 
   * @example
   * "Demonstration overlay"
   * "Demonstration grid layout"
   * "Demonstration document"
   */
  description?: string;
  /**
   * Title displayed at top of screen
   */
  title?: string;
  /**
   * URL of logo image
   */
  logo?: string;
  theme?: EidosTheme;
  /**
   * Data Sources
   * Array of data source definitions that provide data to the visualization components. Each data source can be a static dataset, OceanQL query, Oceanum Datamesh source, or other supported data provider. Data sources are referenced by ID throughout the specification.
   * 
   * @example
   * [{"id":"sig-wave-height-trki","dataType":"oceanumDatamesh","dataSpec":{"datasource":"oceanum_wave_trki_era5_v1_grid","variables":["hs","tps"],"geofilter":{"type":"feature","geom":{"type":"Feature","geometry":{"type":"Point","coordinates":[174.3,-38.5]}}},"timefilter":{"times":["2018-01-01 00:00:00Z","2019-01-01 00:00:00Z"]}}}]
   */
  data?: EidosData[];
  root: Node;
  panels?: Panel[];
}

/**
 * PlotSpec
 * Placeholder for Vega/Vega-Lite plot specifications
 */
export interface PlotSpec {
  /**
   * The Vega/Vega-Lite schema URL
   */
  $schema?: string;
  /**
   * The data specification
   */
  data?: object;
  /**
   * The mark type or definition
   */
  mark?: any;
  /**
   * The encoding specification
   */
  encoding?: object;
  /**
   * The configuration options
   */
  config?: object;
  [key: string]: any;
}

/**
 * Node
 * Spec for node (world, plot, document, grid or menu)
 */
export type Node = World | Plot | Document | Grid | Menu;

/**
 * Eidos theme
 */
export interface EidosTheme {
  /**
   * Color scheme for the view
   */
  preset?: "default" | "dark";
  style?: EidosStyle;
}

/**
 * EIDOS data
 * Data source specification for EIDOS visualizations. Defines how to access and process data from various sources including Oceanum Datamesh, Zarr arrays, inline datasets, GeoJSON features, and data transformations. Each data source has a unique ID that can be referenced by visualization components.
 */
export interface EidosData {
  /**
   * Unique identifier for this data source within the specification. Must be alphanumeric with hyphens and underscores only. This ID is used to reference the data source from visualization layers and components.
   * 
   * @example
   * "sig-wave-height-trki"
   * "ship-positions"
   * "weather-data"
   */
  id: string;
  /**
   * Type of data source that determines how the data is accessed and processed. Each type requires different configuration in the dataSpec property.
   * 
   * @example
   * "dataset"
   * "geojson"
   * "transform"
   */
  dataType: "oceanql" | "zarr" | "dataset" | "geojson" | "transform";
  dataSpec: Dataset | Transform | Geojson | Oceanquery | Zarr;
}

/**
 * Spec for panel node (world, plot, document, grid or menu)
 */
export interface Panel {
  /**
   * Unique ID of the panel
   */
  id: string;
  node: Node;
  /**
   * event object that triggers panel
   */
  trigger?: object;
  /**
   * If true, this panel is exclusive and will close other panels when opened
   */
  exclusive?: boolean;
  /**
   * Height of panel (CSS string or pixels)
   */
  height?: CssSpec;
  /**
   * Width of panel (CSS string or pixels)
   */
  width?: CssSpec;
  /**
   * Location of panel relative to content
   */
  position?: Position;
  /**
   * Title of panel
   */
  title?: string;
}

/**
 * World
 * Interactive 2D/3D map node for displaying geospatial and oceanic data. World nodes can contain multiple data layers (gridded data, features, tracks, etc.) and provide map controls, time navigation, and spatial interaction capabilities. Ideal for visualizing spatial data, environmental conditions, and geographic features.
 */
export interface World {
  /**
   * Unique identifier for this world node within the specification. Used for referencing this node in events, interactions, and programmatic access.
   * 
   * @example
   * "map-1"
   * "world-view"
   * "main-map"
   */
  id: string;
  /**
   * Node type identifier. Must be 'world' for map/globe visualizations.
   */
  nodeType?: any;
  /**
   * Array of world layers to display on this map. Each layer represents a different data visualization (e.g., gridded data, vector features, tracks, 3D objects). Layers are rendered in order with later layers appearing on top.
   */
  children?: Worldlayer[];
  /**
   * Base map layer providing the background cartography. Can be a preset like 'oceanum' or 'terrain', or a custom tile layer configuration.
   */
  baseLayer?: Baselayer;
  /**
   * Initial camera position and orientation for the map view, including center coordinates, zoom level, pitch, and bearing.
   */
  viewState?: View;
  timezone?: Geojson;
  currentTime?: Geojson;
  timeControl?: Geojson;
  /**
   * Layer selector control configuration. Set to true/false to show/hide the layer selector, or provide an object to customize its appearance and behavior.
   */
  layerSelector?: boolean | LayerSelector;
  /**
   * Interactive map controls for spatial selection, measurement, and drawing. Controls appear as toolbar buttons and allow users to interact with the map (e.g., draw polygons, measure distances, drop points).
   */
  mapControls?: ControlGroup[];
}

/**
 * Plot
 * Specification for plot view environmental digital twin display and interaction
 */
export interface Plot {
  /**
   * Unique id of the node
   */
  id: string;
  nodeType?: any;
  plotType?: "vega" | "vega-lite";
  plotSpec: any & PlotSpec;
  /**
   * Actions to enable for the plot
   */
  actions?: object;
  timezone?: Geojson;
  currentTime?: Geojson;
  timeControl?: Geojson;
}

/**
 * Document
 * Specification for document node
 */
export interface Document {
  /**
   * Unique id of the node
   */
  id: string;
  nodeType?: any;
  /**
   * Document content as templated markdown
   */
  content: string;
  style?: DocumentStyle;
}

/**
 * Grid
 * Layout node that arranges child nodes in a responsive grid pattern. Grid nodes are containers that organize multiple visualization components (maps, plots, documents) into rows and columns. Each child node can span multiple grid cells, allowing for flexible dashboard-style layouts.
 */
export interface Grid {
  /**
   * Unique identifier for this grid node within the specification. Used for referencing this node in events, interactions, and programmatic access.
   * 
   * @example
   * "main-grid"
   * "dashboard-layout"
   * "analysis-grid"
   */
  id: string;
  /**
   * Node type identifier. Must be 'grid' for layout containers that arrange children in a grid pattern.
   */
  nodeType?: any;
  /**
   * Defines the overall grid dimensions. All child nodes must fit within these bounds. The grid acts as a responsive layout container that adapts to screen size while maintaining relative proportions.
   */
  gridSize: object;
  /**
   * Optional array defining precise positioning for each child node. If provided, must have the same length as the children array. Each element defines the grid position and size for the corresponding child.
   */
  gridLayout?: object[];
  /**
   * Array of child nodes to display within the grid. Children are positioned automatically if gridLayout is not specified, or according to the gridLayout array if provided. Can contain any type of EIDOS node.
   */
  children: World | Plot | Document | Menu[];
}

/**
 * Menu
 */
export interface Menu {
  /**
   * Unique id of the node
   */
  id: string;
  nodeType?: any;
  activeItem?: string;
  /**
   * Location of menu relative to content
   */
  position?: "top" | "left" | "bottom" | "right";
  /**
   * Whether menu is open
   */
  open?: boolean;
  children: World | Plot | Document | Grid[];
  openOnMouseOver?: boolean;
  menuLayout: object[];
}

/**
 * Eidos style
 * Style properties
 */
export interface EidosStyle {
  /**
   * Primary color of the view
   */
  primaryColor?: string;
  /**
   * Secondary color of the view
   */
  secondaryColor?: string;
  /**
   * Accent color of the view
   */
  accentColor?: string;
  /**
   * Background color of the view
   */
  backgroundColor?: string;
  /**
   * Text color of the view
   */
  textColor?: string;
  /**
   * Font family of the view
   */
  fontFamily?: string;
  /**
   * Font size of the view
   */
  fontSize?: string;
  /**
   * Font weight of the text
   */
  textFontWeight?: number;
  /**
   * Line height of the text
   */
  textLineHeight?: number;
  /**
   * Text alignment of the view
   */
  textAlign?: string;
  /**
   * Width of the border
   */
  borderWidth?: string;
  /**
   * Style of the border
   */
  borderStyle?: string;
  /**
   * Radius of the border
   */
  borderRadius?: string;
  /**
   * Size of the title
   */
  titleSize?: string;
}

/**
 * Dataset
 * Inline dataset
 */
export interface Dataset {
  name?: string;
  /**
   * Attributes of the dataset
   */
  attributes?: object;
  /**
   * Data variables
   */
  variables: object;
  /**
   * Dimensions
   */
  dimensions: object;
  coordkeys: Coordkeys;
  [key: string]: any;
}

/**
 * Transform
 * Specification for data transform. 
 */
export interface Transform {
  /**
   * Human readable name of this transform instance
   */
  name?: string;
  /**
   * Modules to add as key:<Module URL>
   */
  modules?: object;
  /**
   * Source inputs
   */
  inputs: any[];
  /**
   * Output data type
   */
  outputType?: "dataset" | "geojson";
  /**
   * Transform code
   * Transform code as body of function
   */
  code: string;
}

/**
 * GeoJSON
 * GeoJSON schemas
 */
export interface Geojson {
  [key: string]: GeoJSON;
}

/**
 * OceanQuery
 */
export interface Oceanquery {
  /**
   * The id of the datasource
   */
  datasource: string;
  /**
   * Datasource parameters
   */
  parameters?: object | null;
  /**
   * Optional description of this query
   */
  description?: string | null;
  /**
   * List of selected variables
   */
  variables?: string[] | null;
  /**
   * Time filter
   */
  timefilter?: Timefilter | null;
  /**
   * Spatial filter or interpolator
   */
  geofilter?: Geofilter | null;
  /**
   * List of additional coordinate filters
   */
  coordfilter?: Coordselector[] | null;
  /**
   * Spatial reference for filter and output
   */
  crs?: number | string | null;
  /**
   * Aggregate operations
   */
  aggregate?: Aggregate | null;
  /**
   * Limit size of response
   */
  limit?: number | null;
  /**
   * Unique ID of this query
   */
  id?: string | null;
}

export interface Zarr {
  /**
   * Zarr group URL
   */
  group: string;
  /**
   * Headers for zarr dataset
   */
  headers?: object;
  coordkeys: Coordkeys;
}

/**
 * CSS spec
 * CSS string or pixels as integer or null
 */
export type CssSpec = number | string | null;

export interface Position {
  top?: CssSpec;
  left?: CssSpec;
  bottom?: CssSpec;
  right?: CssSpec;
}

/**
 * WorldLayer
 * A data layer displayed on a world map. World layers visualize different types of geospatial data including gridded datasets (like temperature, wave height), vector features (points, lines, polygons), tracks (moving objects), and 3D scene elements.
 */
export interface Worldlayer {
  /**
   * Unique identifier for this layer within the world node. Used for layer management, visibility control, and programmatic access.
   * 
   * @example
   * "wave-height"
   * "ship-tracks"
   * "weather-stations"
   */
  id: string;
  /**
   * Display name for this layer shown in the layer selector and legend. Should be descriptive and user-friendly.
   * 
   * @example
   * "Significant Wave Height"
   * "Ship Positions"
   * "Weather Stations"
   */
  name?: string;
  nodeType: any;
  /**
   * Reference to a data source defined in the root 'data' array. This connects the layer to its data source for visualization.
   * 
   * @example
   * "hs-1"
   * "sig-wave-height-trki"
   * "ship-positions"
   */
  dataId?: string;
  /**
   * Whether this layer is initially visible when the map loads. Users can toggle visibility through the layer selector.
   */
  visible?: boolean;
  /**
   * Other layers than can be shown at same time as this layer
   */
  showWith?: any[];
  /**
   * Linked layer id which controls this layer visibility
   */
  linked?: string;
  /**
   * Configuration for tooltips displayed when hovering over layer elements. Uses Handlebars templates for dynamic content.
   */
  hoverInfo?: MapHoverInfo;
  layerSpec: Layerspec;
  /**
   * Minimum zoom level at which layer is visible
   */
  minZoom?: number;
  /**
   * Maximum zoom level at which layer is visible
   */
  maxZoom?: number;
  /**
   * Time selection criteria for layer
   */
  timeSelect?: Timeselect;
}

export type Baselayer = Baselayerpreset | object;

/**
 * Camera configuration defining the initial viewport of the map including position, zoom level, and orientation. This sets how users first see the map when it loads.
 */
export interface View {
  /**
   * Type of world view
   */
  viewType?: "map" | "globe";
  /**
   * Longitude coordinate of the map center in decimal degrees (-180 to 180). Positive values are East, negative values are West.
   * 
   * @example
   * 174.3
   * -122.4
   * 2.3
   */
  longitude: number;
  /**
   * Latitude coordinate of the map center in decimal degrees (-90 to 90). Positive values are North, negative values are South.
   * 
   * @example
   * -38.5
   * 37.7
   * 48.9
   */
  latitude: number;
  /**
   * Pitch angle of view
   */
  pitch?: number;
  /**
   * Bearing angle of view
   */
  bearing?: number;
  /**
   * Maximum zoom level
   */
  maxZoom?: number;
  /**
   * Initial zoom level of the map. Higher values show more detail. Typically ranges from 0 (world view) to 20+ (street level).
   * 
   * @example
   * 2
   * 8
   * 12
   */
  zoom?: number;
  /**
   * Maximum pitch angle
   */
  maxPitch?: number;
}

/**
 * Layer selector
 */
export interface LayerSelector {
  /**
   * Visibility of layer selector
   */
  open?: boolean;
}

/**
 * Control group
 */
export interface ControlGroup {
  /**
   * Control group id
   */
  id: string;
  orientation?: "horizontal" | "vertical";
  /**
   * Control list
   */
  controls: Control[];
  /**
   * Visibility of control group
   */
  visible?: boolean;
}

/**
 * Document style
 * Document style overrides
 */
export interface DocumentStyle {
  /**
   * Font size
   */
  fontSize?: string;
  /**
   * Font family
   */
  fontFamily?: string;
  /**
   * Font color
   */
  fontColor?: string;
  /**
   * Line height
   */
  lineHeight?: string;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Padding
   */
  padding?: string;
  /**
   * Margin
   */
  margin?: string;
  /**
   * Justify content
   */
  justifyContent?: "left" | "center" | "right";
}

/**
 * Coordinate keys mapping variables to dimensions (x: longitude, y: latitude, z: depth/altitude, g: geometry, t: time)
 */
export interface Coordkeys {
  [key: string]: object;
}

/**
 * TimeFilter
 */
export interface Timefilter {
  /**
   * Timefilter type
   */
  type?: Timefiltertype;
  /**
   * Time range or series
   */
  times: string | null[];
  /**
   * Temporal resolution of data
   */
  resolution?: string | null;
  /**
   * Resampling operator
   */
  resample?: Resampletype | null;
}

/**
 * GeoFilter
 */
export interface Geofilter {
  /**
   * GeoFilter type
   */
  type?: Geofiltertype;
  /**
   * bbox OR geojson Feature
   */
  geom: number[];
  /**
   * Maximum spatial resolution of data
   */
  resolution?: number | null;
  /**
   * Include all touched grid pixels
   */
  alltouched?: boolean | null;
}

/**
 * CoordSelector
 */
export interface Coordselector {
  /**
   * Coordinate name
   */
  coord: string;
  /**
   * List of coordinate values to select by
   */
  values: string | number[];
}

/**
 * Aggregate
 */
export interface Aggregate {
  /**
   * Aggregate operations to perform
   */
  operations?: AggregateOps[];
  /**
   * Aggregate over spatial filter
   */
  spatial?: boolean | null;
  /**
   * Aggregate over temporal filter
   */
  temporal?: boolean | null;
}

/**
 * Map hover info
 * Properties for tooltip shown on hover
 */
export interface MapHoverInfo {
  /**
   * Tooltip as Handlebars template. The picked object is passed as the render context.
   */
  template: string;
}

/**
 * Layer specification
 */
export type Layerspec = Feature | Gridded | Label | Scenegraph | Sea-surface | Track;

export interface Timeselect {
  mode: "nearest" | "exact" | "range";
  /**
   * Time toleration duration for nearest time select
   */
  toleration?: string;
  /**
   * Time aggregation
   * Aggregation method for time range
   */
  aggregate?: "last" | "first" | "sum" | "mean" | "max" | "min";
  /**
   * Data field to group by
   */
  groupby?: string;
}

/**
 * Base layer type
 */
export type Baselayerpreset = "oceanum" | "terrain";

/**
 * Control
 * Control properties
 */
export interface Control {
  /**
   * Control type
   */
  type: "points" | "polygon" | "bbox" | "radius" | "drop" | "measure";
  /**
   * Control id
   */
  id: string;
  /**
   * Control active state
   */
  active?: boolean;
  /**
   * Control disabled state
   */
  disabled?: boolean;
  /**
   * Control state
   */
  state?: object;
  /**
   * Icon URLs
   */
  icon?: object;
  /**
   * Tooltip text
   */
  tooltip?: string;
  config?: object;
}

/**
 * ResampleType
 */
export type Resampletype = "mean" | "nearest";

/**
 * Aggregate Ops
 */
export type AggregateOps = "mean" | "min" | "max" | "std" | "sum";

/**
 * Feature
 * Feature Model
 */
export interface Feature {
  /**
   * Type
   */
  type: "Feature";
  geometry: Geometry;
  /**
   * Properties
   */
  properties?: Properties;
  /**
   * Id
   */
  id?: string;
  /**
   * Bbox
   */
  bbox?: any[];
}

/**
 * Geometry
 * Geometry Model
 */
export type Geometry = Point | Multipoint | Linestring | Multilinestring | Polygon | Multipolygon | Geometrycollection;

/**
 * Point
 * Point Model
 */
export interface Point {
  /**
   * Coordinates
   */
  coordinates: any[];
  /**
   * Type
   */
  type?: string;
}

/**
 * MultiPoint
 * MultiPoint Model
 */
export interface Multipoint {
  /**
   * Coordinates
   */
  coordinates: any[][];
  /**
   * Type
   */
  type?: string;
}

/**
 * LineString
 * LineString Model
 */
export interface Linestring {
  /**
   * Coordinates
   */
  coordinates: any[][];
  /**
   * Type
   */
  type?: string;
}

/**
 * MultiLineString
 * MultiLineString Model
 */
export interface Multilinestring {
  /**
   * Coordinates
   */
  coordinates: any[][][];
  /**
   * Type
   */
  type?: string;
}

/**
 * Polygon
 * Polygon Model
 */
export interface Polygon {
  /**
   * Coordinates
   */
  coordinates: any[][][];
  /**
   * Type
   */
  type?: string;
}

/**
 * MultiPolygon
 * MultiPolygon Model
 */
export interface Multipolygon {
  /**
   * Coordinates
   */
  coordinates: any[][][][];
  /**
   * Type
   */
  type?: string;
}

/**
 * GeometryCollection
 * GeometryCollection Model
 */
export interface Geometrycollection {
  /**
   * Type
   */
  type?: string;
  /**
   * Geometries
   */
  geometries: Geometry[];
}
