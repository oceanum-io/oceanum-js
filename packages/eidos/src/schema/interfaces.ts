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
 * Node
 * Spec for node (world, plot, document, grid or menu)
 */
export type Node = World | Plot | Document | Grid | Menu;

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

export interface Zarr {
  id: string;
  url: string;
  /**
   * Headers for zarr dataset
   */
  headers?: object;
}

export interface Datavariable {
  /**
   * Attributes of the data variable
   */
  attributes?: object;
  /**
   * Data of the variable
   */
  data: number | string | any[] | null[];
  /**
   * Dimensions of the variable
   */
  dimensions: string[];
  dtype?: "int32" | "int64" | "float32" | "float64" | "string";
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
  /**
   * Coordinate keys mapping variables to dimensions (x: longitude, y: latitude, z: depth/altitude, g: geometry, t: time)
   */
  coordkeys: object;
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

/**
 * Geometry
 * Geometry Model
 */
export type Geometry = Point | Multipoint | Linestring | Multilinestring | Polygon | Multipolygon | Geometrycollection;

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

export interface Featurecollection {
  type: string;
  features: FeatureLayer[];
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
 * Aggregate Ops
 */
export type AggregateOps = "mean" | "min" | "max" | "std" | "sum";

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
 * Function
 */
export interface Function {
  /**
   * Function id
   */
  id: string;
  /**
   * function arguments
   */
  args: function arguments;
  /**
   * Apply function to variables
   */
  vselect?: string[] | null;
  /**
   * Replace input dataset
   */
  replace?: boolean | null;
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
 * GeoFilterType
 * Type of the geofilter. Can be one of:
- 'feature': Select with a geojson feature
- 'bbox': Select with a bounding box
- 'radius': Select within radius of point
 */
export type Geofiltertype = "feature" | "radius" | "bbox";

/**
 * ResampleType
 */
export type Resampletype = "mean" | "nearest";

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
 * TimeFilterType
 * Type of the timefilter. Can be one of:
- 'range': Select within a time range
 */
export type Timefiltertype = "range" | "series";

/**
 * Layer specification
 */
export type Layerspec = Feature | Gridded | Label | Scenegraph | Sea-surface | Track;

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
  hoverInfo?: MapHoverInfoDisplayDefinition;
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
 * Base layer type
 */
export type Baselayerpreset = "oceanum" | "terrain";

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
 * Map hover info display definition
 * Properties for tooltip shown on hover
 */
export interface MapHoverInfoDisplayDefinition {
  /**
   * Tooltip as Handlebars template. The picked object is passed as the render context.
   */
  template: string;
}

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
 * Layer selector
 */
export interface LayerSelector {
  /**
   * Visibility of layer selector
   */
  open?: boolean;
}

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
 * Current time
 * Time of current node view. ISO 8601 format
 */
export type CurrentTime = string;

/**
 * Time control
 * Time control properties
 */
export interface TimeControl {
  /**
   * Time range of time control. ISO 8601 format
   */
  range?: string[];
  /**
   * Time selector increments
   * Size in seconds of the time selector increments
   */
  increment?: number;
  /**
   * Zoom to now button
   * Adds a button that zooms to the current time
   */
  zoomToNow?: boolean;
  /**
   * Zoom to timerange extent button
   * Adds a button that zooms to the current time range
   */
  zoomToExtent?: boolean;
}

/**
 * Mapping from data variables to temporal, depth, and geometric properties. Allows customization of which data fields contain the geometric and attribute information for feature visualization.
 */
export interface Featuredatakeys {
  /**
   * Name of the data field containing time information for temporal features. Used for time-based filtering and animation.
   * 
   * @example
   * "time"
   * "timestamp"
   * "date"
   */
  t?: string;
  /**
   * Name of the data field containing depth or elevation information. Used for 3D positioning and depth-based filtering.
   * 
   * @example
   * "depth"
   * "elevation"
   * "altitude"
   */
  z?: string;
  /**
   * Name of the data field containing GeoJSON geometry. Defaults to 'geometry' if not specified.
   * 
   * @example
   * "geometry"
   * "geom"
   * "shape"
   */
  g?: string;
}

/**
 * Feature Style
 * Style properties for Feature Layer features
 */
export interface FeatureStyle {
  /**
   * Opacity of the layer. Default: 1.
   */
  opacity?: number;
  /**
   * How to render Point and MultiPoint features in the data. Supported types are 'circle', 'icon', 'text'. To use more than one type, join the names with '+', for example 'icon+text'. Default: 'circle'.
   */
  pointType?: string;
  /**
   * Whether to draw filled polygons (solid fill) and points (circles). Default: true.
   */
  filled?: boolean;
  /**
   * The solid color of the polygon and points (circles) in the format [r, g, b, [a]]. Default: [0, 0, 0, 255].
   */
  getFillColor?: any;
  /**
   * Whether to draw an outline around polygons and points (circles). Default: true.
   */
  stroked?: boolean;
  /**
   * The rgba color of a line in the format [r, g, b, [a]]. Default: [0, 0, 0, 255].
   */
  getLineColor?: any;
  /**
   * The width of a line in units specified by lineWidthUnits. Default: 1.
   */
  getLineWidth?: any;
  /**
   * The units of the line width, one of 'meters', 'common', and 'pixels'. Default: 'meters'.
   */
  lineWidthUnits?: string;
  /**
   * A multiplier that is applied to all line widths. Default: 1.
   */
  lineWidthScale?: number;
  /**
   * The minimum line width in pixels. Default: 0.
   */
  lineWidthMinPixels?: number;
  /**
   * The maximum line width in pixels. Default: 9007199254740991.
   */
  lineWidthMaxPixels?: number;
  /**
   * Type of line caps. If true, draw round caps. Otherwise draw square caps. Default: false.
   */
  lineCapRounded?: boolean;
  /**
   * Type of line joint. If true, draw round joints. Otherwise draw miter joints. Default: false.
   */
  lineJointRounded?: boolean;
  /**
   * The maximum extent of a joint in ratio to the stroke width. Default: 4.
   */
  lineMiterLimit?: number;
  /**
   * If true, extrude the line in screen space (width always faces the camera). Default: false.
   */
  lineBillboard?: boolean;
  /**
   * Extrude Polygon and MultiPolygon features along the z-axis if set to true. Default: false.
   */
  extruded?: boolean;
  /**
   * Whether to generate a line wireframe of the hexagon. Default: false.
   */
  wireframe?: boolean;
  /**
   * The elevation of a polygon feature (when extruded is true). Default: 1000.
   */
  getElevation?: any;
  /**
   * Elevation multiplier. The final elevation is calculated by elevationScale * getElevation(d). Default: 1.
   */
  elevationScale?: number;
  /**
   * An object that contains material props for lighting effect applied on extruded polygons. Default: {}.
   */
  material?: object;
  /**
   * Experimental property. When true, polygon tessellation will be performed on the plane with the largest area, instead of the xy plane. Default: false.
   */
  _full3d?: boolean;
  /**
   * Radius of points when pointType is 'circle'. Default: 1.
   */
  getPointRadius?: any;
  /**
   * Units for point radius when pointType is 'circle'. Default: 'meters'.
   */
  pointRadiusUnits?: string;
  /**
   * Scale for point radius when pointType is 'circle'. Default: 1.
   */
  pointRadiusScale?: number;
  /**
   * Minimum point radius in pixels when pointType is 'circle'. Default: 0.
   */
  pointRadiusMinPixels?: number;
  /**
   * Maximum point radius in pixels when pointType is 'circle'. Default: 9007199254740991.
   */
  pointRadiusMaxPixels?: number;
  /**
   * Whether to use antialiasing for points when pointType is 'circle'. Default: true.
   */
  pointAntialiasing?: boolean;
  /**
   * If true, point is billboarded when pointType is 'circle'. Default: false.
   */
  pointBillboard?: boolean;
  /**
   * URL of the icon atlas image when pointType is 'icon'. Default: null.
   */
  iconAtlas?: string;
  /**
   * Mapping of icon names to positions in the atlas when pointType is 'icon'. Default: {}.
   */
  iconMapping?: object;
  /**
   * Accessor for icon names when pointType is 'icon'. Default: f => f.properties.icon.
   */
  getIcon?: any;
  /**
   * Size of icons when pointType is 'icon'. Default: 1.
   */
  getIconSize?: any;
  /**
   * Color of icons when pointType is 'icon'. Default: [0, 0, 0, 255].
   */
  getIconColor?: any;
  /**
   * Rotation angle of icons when pointType is 'icon'. Default: 0.
   */
  getIconAngle?: any;
  /**
   * Pixel offset of icons when pointType is 'icon'. Default: [0, 0].
   */
  getIconPixelOffset?: any;
  /**
   * Units for icon size when pointType is 'icon'. Default: 'pixels'.
   */
  iconSizeUnits?: string;
  /**
   * Scale for icon size when pointType is 'icon'. Default: 1.
   */
  iconSizeScale?: number;
  /**
   * Minimum icon size in pixels when pointType is 'icon'. Default: 0.
   */
  iconSizeMinPixels?: number;
  /**
   * Maximum icon size in pixels when pointType is 'icon'. Default: 9007199254740991.
   */
  iconSizeMaxPixels?: number;
  /**
   * If true, icons are billboarded when pointType is 'icon'. Default: true.
   */
  iconBillboard?: boolean;
  /**
   * Alpha cutoff for icons when pointType is 'icon'. Default: 0.05.
   */
  iconAlphaCutoff?: number;
  /**
   * Accessor for text content when pointType is 'text'. Default: f => f.properties.text.
   */
  getText?: any;
  /**
   * Color of text when pointType is 'text'. Default: [0, 0, 0, 255].
   */
  getTextColor?: any;
  /**
   * Rotation angle of text when pointType is 'text'. Default: 0.
   */
  getTextAngle?: any;
  /**
   * Size of text when pointType is 'text'. Default: 32.
   */
  getTextSize?: any;
  /**
   * Anchor position of text when pointType is 'text'. Default: 'middle'.
   */
  getTextAnchor?: any;
  /**
   * Alignment baseline of text when pointType is 'text'. Default: 'center'.
   */
  getTextAlignmentBaseline?: any;
  /**
   * Pixel offset of text when pointType is 'text'. Default: [0, 0].
   */
  getTextPixelOffset?: any;
  /**
   * Background color of text when pointType is 'text'. Default: [255, 255, 255, 255].
   */
  getTextBackgroundColor?: any;
  /**
   * Border color of text when pointType is 'text'. Default: [0, 0, 0, 255].
   */
  getTextBorderColor?: any;
  /**
   * Border width of text when pointType is 'text'. Default: 0.
   */
  getTextBorderWidth?: any;
  /**
   * Units for text size when pointType is 'text'. Default: 'pixels'.
   */
  textSizeUnits?: string;
  /**
   * Scale for text size when pointType is 'text'. Default: 1.
   */
  textSizeScale?: number;
  /**
   * Minimum text size in pixels when pointType is 'text'. Default: 0.
   */
  textSizeMinPixels?: number;
  /**
   * Maximum text size in pixels when pointType is 'text'. Default: 9007199254740991.
   */
  textSizeMaxPixels?: number;
  /**
   * Character set for text when pointType is 'text'. Default: 'ASCII chars 32-128'.
   */
  textCharacterSet?: string;
  /**
   * Font family for text when pointType is 'text'. Default: 'Monaco, monospace'.
   */
  textFontFamily?: string;
  /**
   * Font weight for text when pointType is 'text'. Default: 'normal'.
   */
  textFontWeight?: string;
  /**
   * Line height for text when pointType is 'text'. Default: 1.
   */
  textLineHeight?: number;
  /**
   * Maximum width for text when pointType is 'text'. Default: -1.
   */
  textMaxWidth?: number;
  /**
   * Word break setting for text when pointType is 'text'. Default: 'break-word'.
   */
  textWordBreak?: string;
  /**
   * Whether text has a background when pointType is 'text'. Default: false.
   */
  textBackground?: boolean;
  /**
   * Padding for text background when pointType is 'text'. Default: [0, 0].
   */
  textBackgroundPadding?: number[];
  /**
   * Outline color for text when pointType is 'text'. Default: [0, 0, 0, 255].
   */
  textOutlineColor?: any;
  /**
   * Outline width for text when pointType is 'text'. Default: 0.
   */
  textOutlineWidth?: number;
  /**
   * If true, text is billboarded when pointType is 'text'. Default: true.
   */
  textBillboard?: boolean;
  /**
   * Additional font settings for text when pointType is 'text'. Default: {}.
   */
  textFontSettings?: object;
}

/**
 * Colormap
 * Scale and domain argument for chroma.scale colormap definition
 */
export interface Colormap {
  scale?: string[] | string;
  domain?: number | string[];
}

/**
 * Color
 * Color definition
 */
export type Color = number[] | string;

/**
 * Style accessor definition
 * Style properties
 */
export type StyleAccessorDefinition = StyleAccessorConstantString | StyleAccessorConstantNumber | StyleAccessorFunction | StyleAccessorConstantArray | StyleAccessorTemplate;

/**
 * Style accessor constant string
 * Constant value
 */
export type StyleAccessorConstantString = string;

/**
 * Style accessor constant number
 * Constant value
 */
export type StyleAccessorConstantNumber = number;

/**
 * Style accessor constant array
 * Array of constant values
 */
export type StyleAccessorConstantArray = number[];

/**
 * Style accessor template
 * Template accessor
 */
export interface StyleAccessorTemplate {
  /**
   * Template string
   */
  template: string;
}

/**
 * Style accessor function
 * Accessor function
 */
export interface StyleAccessorFunction {
  /**
   * Accessor function identifier
   */
  function: string;
  /**
   * Arguments for accessor function
   */
  args: string[];
}

/**
 * Legend definition
 * Legend properties
 */
export type LegendDefinition = object | null | boolean;

export interface Pcolor {
  [key: string]: Position;
}

export interface Particles {
  [key: string]: Position & any;
}

/**
 * Mapping from data variables to x,y and c(scalar value)
 */
export interface Gridlayerdatakeys {
  x?: string;
  y?: string;
  c?: string;
  d?: string;
  m?: string;
  u?: string;
  v?: string;
}

/**
 * Mapping from data variables to time(t) and geometry(g)
 */
export interface Labellayerdatakeys {
  g?: string;
  t?: string;
}

/**
 * Mapping from data variables to geometry
 */
export interface Scenegraphlayerdatakeys {
  t?: string;
  x: string;
  y: string;
  z?: string;
  roll?: string;
  pitch?: string;
  yaw?: string;
  xoffset?: string;
  yoffset?: string;
  zoffset?: string;
  xscale?: string;
  yscale?: string;
  zscale?: string;
  [key: string]: any;
}

/**
 * Floater
 * Floating object
 */
export interface Floater {
  /**
   * ID
   * Unique identifier for the floater
   */
  id: string;
  /**
   * Name
   * Name of the floater
   */
  name?: string;
  position?: any;
  /**
   * GLTF model
   * name or URL of GLTF model
   */
  gltf: string;
  style?: any;
  /**
   * Array of position offsets, one for each model instance
   */
  offsets?: Offsets[];
  /**
   * RAO
   * Response Amplitude Operator
   */
  rao?: RAO;
}

/**
 * Mapping from data variables to amplitude and phase
 */
export interface Seasurfacelayerdatakeys {
  /**
   * Frequency
   */
  f: string;
  /**
   * Direction
   */
  d: string;
  /**
   * Spectral variance
   */
  efth: string;
  [key: string]: any;
}

/**
 * Mapping from data variables to amplitude and phase of motions
 */
export interface Seasurfaceraodatakeys {
  /**
   * Frequency
   */
  f: string;
  /**
   * Direction
   */
  d: string;
  /**
   * Amplitude response
   */
  pitch_amp?: string;
  /**
   * Phase response
   */
  Pitch_pha?: string;
  /**
   * Amplitude response
   */
  roll_amp?: string;
  /**
   * Phase response
   */
  roll_pha?: string;
  /**
   * Amplitude response
   */
  heave_amp: string;
  /**
   * Phase response
   */
  heave_pha: string;
  [key: string]: any;
}

/**
 * Mapping from data variables to lon,lat and time
 */
export interface Tracklayerdatakeys {
  x: string;
  y: string;
  t?: string | null;
  [key: string]: any;
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
   * Functions
   */
  functions?: Function[] | null;
  /**
   * Limit size of response
   */
  limit?: number | null;
  /**
   * Unique ID of this query
   */
  id?: string | null;
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
   * "oceanumDatamesh"
   * "geojson"
   * "dataset"
   */
  dataType: "oceanumDatamesh" | "oceanql" | "zarr" | "dataset" | "geojson" | "transform";
  dataSpec: Dataset | Transform | Geojson | Oceanquery | Zarr;
}

/**
 * Feature Layer
 * World layer for displaying vector geographic features such as points, lines, and polygons. Ideal for showing discrete objects like weather stations, ship positions, port locations, administrative boundaries, or custom geographic shapes. Features can be styled with colors, symbols, and labels.
 */
export interface FeatureLayer {
  /**
   * Layer type identifier. Must be 'feature' for vector geographic data visualizations.
   */
  layerType: any;
  colormap?: Geojson;
  legend?: Geojson;
  /**
   * Mapping of data fields to geometric and temporal properties. Defines how feature geometry, time information, and depth/elevation are extracted from the data.
   */
  datakeys?: Featuredatakeys;
  /**
   * Visual styling properties for features including colors, sizes, stroke properties, and opacity. These styles are applied to all features unless overridden by colormap-based styling.
   */
  style: FeatureStyle;
}

/**
 * Gridded Layer
 * World layer for visualizing gridded datasets such as sea surface temperature, wave height, wind speed, or any regularly-spaced data. Supports multiple visualization modes including pseudocolor plots, contour lines, particle animations, and vector fields. Ideal for environmental and oceanographic data visualization.
 */
export interface GriddedLayer {
  /**
   * Layer type identifier. Must be 'gridded' for regularly-spaced data visualizations.
   */
  layerType: any;
  /**
   * Mapping of data variables to coordinate and value fields. Defines how the data structure maps to spatial and temporal dimensions for visualization.
   */
  datakeys: Gridlayerdatakeys;
  legend?: Geojson;
  colormap: Geojson;
  pcolor?: Pcolor;
  particles?: Particles;
  partmesh?: Particles;
  contour?: Particles;
  /**
   * Scaling factor applied to data values before visualization. Useful for unit conversion or value adjustment (e.g., scale: 0.01 to convert from centimeters to meters).
   * 
   * @example
   * 1
   * 0.01
   * 100
   */
  scale?: number;
  /**
   * Offset value added to data values after scaling but before visualization. Useful for shifting data ranges or converting units (e.g., Kelvin to Celsius).
   * 
   * @example
   * 0
   * -273.15
   * 32
   */
  offset?: number;
  units?: string;
  precision?: number;
  landmask?: boolean;
  global?: boolean;
}

/**
 * Label Layer
 * Specification for Label overlay layer
 */
export interface LabelLayer {
  layerType: any;
  datakeys?: Labellayerdatakeys;
  /**
   * Label format string as Handlebars template. See https://handlebarsjs.com/guide/#simple-expressions
   */
  labelTemplate: string;
  geometry?: Geojson;
  colormap?: Geojson;
  /**
   * Number of labels to show
   */
  numberOfLabels?: number;
  /**
   * Length of the anchor line
   */
  lineLength?: number;
  /**
   * Angle of the label anchor
   */
  labelAngle?: number;
  style?: Position;
}

/**
 * Scenegraph Layer
 * Specification for Scenegraph layer
 */
export interface ScenegraphLayer {
  layerType: any;
  datakeys: Scenegraphlayerdatakeys;
  colormap?: Geojson;
  scenegraph?: object;
  style?: object;
}

/**
 * Sea Surface Layer
 * Specification for Sea surface layer
 */
export interface SeaSurfaceLayer {
  layerType: any;
  datakeys: Seasurfacelayerdatakeys;
  /**
   * Vertical scale
   * Vertical scale exageration
   */
  zscale?: number;
  /**
   * Sea level elevation
   * Elevation of mean sea level in metres
   */
  elevation?: number;
  /**
   * Floaters
   * List of floating objects
   */
  floaters?: Floater[];
}

/**
 * Track Layer
 * Specification for Track overlay layer
 */
export interface TrackLayer {
  layerType: any;
  datakeys: Tracklayerdatakeys;
  colormap?: Geojson;
  style?: object;
  track: object;
  legend?: Geojson;
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
