/**
 * Auto-generated TypeScript interfaces for EIDOS schemas
 * Generated from: /home/dave/Dev/oceanum/eidos/packages/schemas/src/eidos/root.json
 *
 * Each interface corresponds to a definition in the EIDOS schema bundle.
 * These interfaces can be used for type validation and IDE support.
 *
 * Do not modify this file directly - regenerate using:
 * npm run generate-types -w @oceanum/eidos
 */

const _011Constant = "0.11" as const;
const WorldNodeType = "world" as const;
const PlotNodeType = "plot" as const;
const DocumentNodeType = "document" as const;
const GridNodeType = "grid" as const;
const MenuNodeType = "menu" as const;
const PanelNodeType = "panel" as const;
const WorldlayerNodeType = "worldlayer" as const;
const ControlgroupNodeType = "controlgroup" as const;
const DerivedNodeType = "derived" as const;

/**
 * EIDOS specification
 * Complete specification for defining interactive oceanic and geospatial data visualizations using the EIDOS framework. An EIDOS specification is a declarative JSON document that describes the entire structure, layout, data sources, and interactions for a data visualization application. This top-level schema defines the root structure that contains metadata, data definitions, theming, and the hierarchical node structure that defines the user interface.
 */
export interface EidosSpec {
  /**
   * Version of EIDOS
   */
  version?: _011Constant;
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
  logo?: string | object;
  theme?: EidosTheme;
  /**
   * Data Sources
   * Array of data source definitions that provide data to the visualization components. Each data source can be a static dataset, OceanQL query, Oceanum Datamesh source, or other supported data provider. Data sources are referenced by ID throughout the specification.
   *
   * @example
   * [{"id":"sig-wave-height-trki","dataType":"oceanumDatamesh","dataSpec":{"datasource":"oceanum_wave_trki_era5_v1_grid","variables":["hs","tps"],"geofilter":{"type":"feature","geom":{"type":"Feature","geometry":{"type":"Point","coordinates":[174.3,-38.5]}}},"timefilter":{"times":["2018-01-01 00:00:00Z","2019-01-01 00:00:00Z"]}}}]
   */
  data?: EidosData[];
  root?: World | Plot | Document | Grid | Menu | null;
  panels?: EidosPanel[];
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
   * Human-readable title for this world node.
   */
  title?: string;
  /**
   * Node type identifier. Must be 'world' for map/globe visualizations.
   */
  nodeType?: WorldNodeType;
  /**
   * Array of world layers and controls to display on this map. Each layer represents a different data visualization (e.g., gridded data, vector features, tracks, 3D objects). Layers are rendered in order with later layers appearing on top.
   */
  children: Worldlayer | ControlGroup | EidosPanel[];
  /**
   * Base map layer providing the background cartography. Can be a preset like 'oceanum' or 'terrain', or a custom tile layer configuration.
   */
  baseLayer?: Baselayer;
  /**
   * Initial camera position and orientation for the map view, including center coordinates, zoom level, pitch, and bearing.
   */
  viewState?: View;
  currentTime?: Geojson;
  /**
   * Time control configuration. Set to null to disable the time control, or provide an object to customize its appearance and behavior.
   */
  timeControl?: null | Geojson;
  /**
   * Level control configuration. Set to null to disable the level control, or provide an object to customize its appearance and behavior.
   */
  levelControl?: null | Geojson;
  /**
   * Current level value for the world view
   */
  currentLevel?: number;
  /**
   * Layer selector control configuration. Set to null to disable the layer selector, or provide an object to customize its appearance and behavior.
   */
  layerSelector?: null | LayerSelector;
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
  /**
   * Title of the plot
   */
  title?: string;
  nodeType?: PlotNodeType;
  plotType?: "vega" | "vega-lite";
  plotSpec: any & PlotSpec;
  /**
   * Actions to enable for the plot
   */
  actions?: object;
  /**
   * Resize the plot to fit its container. When true single/layer views fill the container and vconcat panes are distributed across it; when false (the default) the plot keeps its authored width/height and the container scrolls.
   */
  fitToContainer?: boolean;
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
  /**
   * Title of the document
   */
  title?: string;
  nodeType?: DocumentNodeType;
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
  nodeType?: GridNodeType;
  /**
   * Defines the overall grid dimensions. All child nodes must fit within these bounds. The grid acts as a responsive layout container that adapts to screen size while maintaining relative proportions.
   */
  gridSize: object;
  /**
   * Optional array defining precise positioning for each child node. If provided, must have the same length as the children array. Each element defines the grid position and size for the corresponding child.
   */
  gridLayout?: object[];
  /**
   * Array of child nodes to display within the grid. Children are positioned automatically if gridLayout is not specified, or according to the gridLayout array if provided. Can contain any type of EIDOS node, including `derived` for reusing another node with patches.
   */
  children: World | Plot | Document | Menu | Derived[];
}

/**
 * Menu
 */
export interface Menu {
  /**
   * Unique id of the node
   */
  id: string;
  nodeType?: MenuNodeType;
  activeItem?: string;
  /**
   * Location of menu relative to content
   */
  position?: "top" | "left" | "bottom" | "right";
  /**
   * Whether menu is open
   */
  open?: boolean;
  children: World | Plot | Document | Grid | Derived[];
  openOnMouseOver?: boolean;
  menuLayout: object[];
}

/**
 * Eidos panel
 * A panel is a floating window rendered on top of its parent element. It can contain any node type (world, plot, document, grid, or menu). Panels can be opened by a panelopen control button, by a spec patch, or automatically by an event trigger.
 */
export interface EidosPanel {
  /**
   * Unique ID of the panel. Referenced by panelopen controls via config.panelId.
   */
  id: string;
  nodeType?: PanelNodeType;
  /**
   * Initial open state. Set to true to open the panel on load. Can also be set via specPatch at runtime to open or close the panel programmatically — the state is one-way (patching open:false closes the panel, but user-initiated closes do not write back to spec).
   */
  open?: boolean;
  /**
   * The content node rendered inside the panel.
   */
  node: World | Plot | Document | Grid | Menu | Derived;
  /**
   * Event patterns that automatically open this panel. The panel opens when **any** pattern in the array matches the most recent event on the event bus (logical OR). Each pattern is compared as a deep subset against the event — the pattern matches when all fields it specifies are equal to the corresponding fields on the event. String values support glob pattern matching. Unspecified fields are ignored.

Use a single-element array for a single trigger; use multiple elements when distinct event shapes (different actions, sources, or data filters) should all open the same panel.

Event fields available to match against:
- action (string): type of event — 'click', 'rightClick', 'doubleClick', 'drop', 'hover', 'viewStateChange', 'activateControl', etc.
- source (string, glob-matched): path identifying what produced the event. Layer interaction sources follow the pattern '/{path}/children/#{layerId}' (e.g. '/root/children/#wave-height'). Use glob wildcards to match multiple sources (e.g. '/root/children/*').
- data (object): event payload — subset-match any fields you care about.
- coordinate ([number, number]): [longitude, latitude] of the interaction point.

Examples:
  Open on any click on a specific layer:
    [ { "action": "click", "source": "/root/children/#my-layer" } ]

  Open from either of two layers:
    [
      { "action": "click", "source": "/root/children/#layer-a" },
      { "action": "click", "source": "/root/children/#layer-b" }
    ]

  Open when a specific control is activated:
    [ { "action": "activateControl", "source": "/root/children/#controls/children/#draw-tool" } ]
   */
  trigger?: Triggerpattern[];
  /**
   * If true, opening this panel closes all other currently open panels. Useful for modal-style panels that should have the user's full attention.
   */
  exclusive?: boolean;
  height?: Geojson;
  width?: Geojson;
  position?: Geojson;
  /**
   * Title displayed in the panel header bar.
   */
  title?: string;
  /**
   * Whether the user can dismiss the panel. When false, the close button is hidden and the panel can only be closed programmatically (via specPatch or a closePanel event). Defaults to true.
   */
  closable?: boolean;
}

/**
 * Eidos style
 * Style properties organized by category
 */
export interface EidosStyle {
  color?: ColorStyle;
  text?: TextStyle;
  control?: ControlStyle;
  panel?: PanelStyle;
  grid?: GridStyle;
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
 * Derives a new data source by running user-supplied JavaScript against one or more existing data sources. The code executes in a sandboxed Web Worker and is re-evaluated on every query, with the same query object propagated to each input source so the transform stays in sync with time/region selections elsewhere in the app. The result is validated against the schema for the declared outputType.
 */
export interface Transform {
  /**
   * Human readable name of this transform instance
   */
  name?: string;
  /**
   * ES modules to make available inside the transform function. Each entry maps an identifier name to a module URL; the URL is dynamically imported in the worker and the module's namespace object is bound to that identifier as an extra argument to the transform function. Example: { "d3": "https://cdn.jsdelivr.net/npm/d3@7/+esm" } exposes the d3 namespace as `d3` inside `code`.
   */
  modules?: object;
  /**
   * IDs of other data sources in this specification whose results are passed to the transform. Each ID must match the `id` of another entry in `data`. At query time the inputs are resolved (in declaration order) and exposed inside `code` as the `$inputs` object, keyed by source ID.
   */
  inputs: string[];
  /**
   * Schema the transform's return value must conform to. `dataset` validates against the inline Dataset schema; `geojson` validates against a GeoJSON FeatureCollection. Validation runs on every query and a failure rejects the query.
   */
  outputType?: "dataset" | "geojson";
  /**
   * Transform code
   * Body of the transform function (no `function` wrapper, no parameter list — just the body, with a `return` statement). The function is invoked as `($inputs, $query, $outputType, ...modules)` and may be async. Arguments: `$inputs` — object of resolved input data keyed by source ID (same keys as the `inputs` array); `$query` — the query object propagated from the caller (typically containing time/region selections); `$outputType` — the configured outputType string. After these, one positional argument is appended per entry in `modules` (in object-key order), each bound to that module's namespace. The return value must match the `outputType` schema.
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
  ttl?: number | null;
  /**
   * Forward the renderer authentication headers (Authorization bearer token) to the zarr service
   */
  forwardAuth?: boolean;
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
  nodeType: WorldlayerNodeType;
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
   * Layer IDs that cannot be displayed at the same time as this layer. An empty array or omitted property means this layer is compatible with all other layers.
   */
  exclusiveOf?: string[];
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
  /**
   * Level selection criteria for layer
   */
  levelSelect?: Levelselect;
}

/**
 * Control group
 */
export interface ControlGroup {
  /**
   * Control group id
   */
  id: string;
  nodeType?: ControlgroupNodeType;
  orientation?: "horizontal" | "vertical";
  /**
   * Position of the control group within the map container. Specify top/left/right/bottom as pixel numbers. Defaults to top: 100, left: 10 if unset.
   */
  position?: any;
  /**
   * Control list
   */
  children: Control[];
  /**
   * Visibility of control group
   */
  visible?: boolean;
}

export type Baselayer = Baselayerpreset | Baselayerconfig;

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
 * Document style
 * Document style overrides
 */
export interface DocumentStyle {
  text?: any;
}

/**
 * Derived
 * A derived node references another node in the same spec by ID and applies a list of patches at render time. Use it to reuse a chart, document, panel, or other node with small variations (e.g. a different data source or field) without duplicating the source subtree. Resolution and patching happen lazily at render time — derived nodes inside unrendered branches cost nothing, and edits to the source node propagate naturally on the next render.
 */
export interface Derived {
  /**
   * Unique identifier for this derived node within the specification. Replaces the source node's root ID in the rendered subtree, and prefixes every descendant ID so multiple derivations of the same source do not collide.
   *
   * @example
   * "chart-copy-1"
   * "panel-variant-a"
   */
  id: string;
  /**
   * Optional human-readable title for this derived node.
   */
  title?: string;
  /**
   * Node type identifier. Must be 'derived'.
   */
  nodeType: DerivedNodeType;
  /**
   * ID of the source node to derive from. The renderer looks up this ID in the current spec at render time, deep-clones the source subtree, prefixes descendant IDs with this derived node's ID, rewrites internal cross-references, applies the patches, and renders the result. The root of the spec cannot be a derived node, and the source itself cannot be a derived node.
   *
   * @example
   * "bar-chart-1"
   * "main-panel"
   */
  source: string;
  /**
   * Ordered list of JSON Patch documents applied to the resolved source subtree after ID and reference rewriting. Paths are subtree-relative — they use RFC 6901 segment syntax (e.g. 'plotSpec/layer/0/data/name') and must NOT start with a leading '/'. The leading-slash form is the JSON Pointer 'absolute against document root' notation and is reserved for future cross-subtree patches; v1 rejects it so the convention mismatch surfaces immediately.
   */
  patches?: object[][];
}

/**
 * TriggerPattern
 * A single event-matching pattern. Deep subset-matched against the event; unspecified fields are wildcards.
 */
export interface Triggerpattern {
  /**
   * Event action to match (e.g. 'click', 'rightClick', 'doubleClick', 'hover', 'drop', 'activateControl'). Glob patterns supported.
   */
  action?: string;
  /**
   * Event source path to match. Layer interactions: '/root/children/#layerId'. Control activations: '/root/children/#controlGroupId/children/#controlId'. Glob patterns supported (e.g. '/root/children/*' matches any child layer).
   */
  source?: string;
  /**
   * Subset of event data fields to match against. Only the fields you specify need to be present and equal in the event.
   */
  data?: object;
}

/**
 * Color style
 * Color palette configuration
 */
export interface ColorStyle {
  /**
   * Primary color of the view
   */
  primary?: string;
  /**
   * Secondary color of the view
   */
  secondary?: string;
  /**
   * Accent color of the view
   */
  accent?: string;
  /**
   * Background color of the view
   */
  background?: string;
}

/**
 * Text style
 * Typography configuration
 */
export interface TextStyle {
  /**
   * Text color of the view
   */
  color?: string;
  /**
   * Font family of the view
   */
  fontFamily?: string;
  /**
   * Font size of the text
   */
  fontSize?: any;
  /**
   * Font weight of the text
   */
  fontWeight?: string;
  /**
   * Line height of the text
   */
  lineHeight?: any;
  /**
   * Text alignment of the view
   */
  align?: string;
  /**
   * Size of the title
   */
  titleSize?: any;
  /**
   * Size of the subtitle
   */
  subtitleSize?: any;
  /**
   * Size of the heading
   */
  headingSize?: any;
}

/**
 * Control style
 * Control element styling
 */
export interface ControlStyle {
  /**
   * Opacity of control elements
   */
  opacity?: string;
  /**
   * Border color of control elements
   */
  borderColor?: string;
  /**
   * Background color of control elements
   */
  backgroundColor?: string;
  /**
   * Text color of control elements
   */
  textColor?: string;
  /**
   * Border width of control elements
   */
  borderWidth?: any;
  /**
   * Border style of control elements
   */
  borderStyle?: string;
  /**
   * Border radius of control elements
   */
  borderRadius?: any;
  /**
   * Backdrop filter effect for controls
   */
  backdropFilter?: string;
  /**
   * Box shadow effect for controls
   */
  boxShadow?: string;
  /**
   * Inset box shadow effect for controls
   */
  boxShadowInset?: string;
}

/**
 * Panel style
 * Panel element styling
 */
export interface PanelStyle {
  /**
   * Opacity of panel elements
   */
  opacity?: string;
  /**
   * Border color of panel elements
   */
  borderColor?: string;
  /**
   * Background color of panel elements
   */
  backgroundColor?: string;
  /**
   * Text color of panel elements
   */
  textColor?: string;
  /**
   * Border width of panel elements
   */
  borderWidth?: any;
  /**
   * Border style of panel elements
   */
  borderStyle?: string;
  /**
   * Border radius of panel elements
   */
  borderRadius?: any;
  /**
   * Backdrop filter effect for panels
   */
  backdropFilter?: string;
  /**
   * Box shadow effect for panels
   */
  boxShadow?: string;
  /**
   * Inset box shadow effect for panels
   */
  boxShadowInset?: string;
}

/**
 * Grid style
 * Grid element styling
 */
export interface GridStyle {
  /**
   * Border width of grid elements
   */
  borderWidth?: any;
  /**
   * Border radius of grid elements
   */
  borderRadius?: any;
  /**
   * Border style of grid elements
   */
  borderStyle?: string;
  /**
   * Border color of grid elements
   */
  borderColor?: string;
  /**
   * Padding of grid elements
   */
  padding?: any;
  /**
   * Margin of grid elements
   */
  margin?: any;
  /**
   * Background color of grid elements
   */
  backgroundColor?: string;
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
export type Layerspec =
  | Feature
  | Gridded
  | Label
  | Scenegraph
  | Seasurface
  | Track
  | Wmts;

/**
 * Time selection criteria for layer
 */
export interface Timeselect {
  mode: "nearest" | "exact" | "range";
  /**
   * Time tolerance duration for nearest time select
   */
  tolerance?: string;
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
 * Level selection criteria for layer
 */
export interface Levelselect {
  /**
   * Level selection mode
   */
  mode?: "nearest" | "exact" | "range";
  /**
   * Level tolerance for nearest level select
   */
  tolerance?: number;
  /**
   * Default level value for this layer
   */
  level?: number;
}

/**
 * Control
 * A map control button. Common properties are defined in controlBase; config is specific to each nodeType.
 */
export type Control = any;

/**
 * Base layer type
 */
export type Baselayerpreset = "oceanum" | "terrain";

export interface Baselayerconfig {
  /**
   * URL to the mapbox style for the base layer
   */
  url?: string;
  /**
   * Authentication token for the base layer
   */
  accessToken?: string;
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
export type Geometry =
  | Point
  | Multipoint
  | Linestring
  | Multilinestring
  | Polygon
  | Multipolygon
  | Geometrycollection;

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
  type?: Type;
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
  type?: Type;
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
  type?: Type;
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
  type?: Type;
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
  type?: Type;
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
  type?: Type;
}

/**
 * GeometryCollection
 * GeometryCollection Model
 */
export interface Geometrycollection {
  /**
   * Type
   */
  type?: Type;
  /**
   * Geometries
   */
  geometries: Geometry[];
}
