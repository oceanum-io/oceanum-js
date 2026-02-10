/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompositeLayer } from "@deck.gl/core";
import { Dataset, type HttpZarr } from "@oceanum/datamesh";
import { getVariableNames } from "./utils/coordinates";
import type { CoordNames, VariableProps, ScalarDatakeys, VectorDatakeys } from "./utils/coordinates";
import {
  nearestTimeIndex,
  clampLevelIndex,
  indexRange,
  sliceDataset,
} from "./utils/dataset-slice";
import type { SlicedData } from "./utils/dataset-slice";
import { getViewportBbox, bboxContained, debounce } from "./utils/viewport";
import type { Bbox, DebouncedFn } from "./utils/viewport";

export interface Colormap {
  scale: string[];
  domain: number[];
}

export interface OnDataLoadInfo {
  dataset: Dataset<HttpZarr>;
  times: Date[];
  nlevels: number;
  instance: string | null;
}

export interface LayerError {
  type: string;
  message: string;
  layerId?: string;
  cause?: Error;
  [key: string]: unknown;
}

export interface ErrorHandlers {
  onMetadataError?: (err: LayerError) => void;
  onChunkError?: (err: LayerError) => void;
  onVariableError?: (err: LayerError) => void;
  onValidationError?: (err: LayerError) => void;
}

const DEFAULT_ERROR_HANDLERS: ErrorHandlers = {
  onMetadataError: (err) => console.warn(`[OceanumLayer] ${err.message}`),
  onChunkError: (err) => console.warn(`[OceanumLayer] ${err.message}`),
  onVariableError: (err) => console.warn(`[OceanumLayer] ${err.message}`),
  onValidationError: (err) => console.error(`[OceanumLayer] ${err.message}`),
};

export interface OceanumLayerProps extends VariableProps {
  serviceUrl: string | null;
  authHeaders: Record<string, string>;
  layerId: string | null;
  instance: string | null;
  time: string | Date | null;
  level: number;
  colormap: Colormap | null;
  opacity: number;
  altitude: number;
  globalWrap: boolean;
  scale: number;
  offset: number;
  pickable: boolean;
  visible: boolean;
  viewportPadding: number;
  debounceWait: number;
  onDataLoad: ((info: OnDataLoadInfo) => void) | null;
  errorHandlers: ErrorHandlers | null;
  directionConvention: string;
  id: string;
}

interface OceanumLayerState {
  dataset: Dataset<HttpZarr> | null;
  loading: boolean;
  slicing: boolean;
  error: LayerError | null;
  instance: string | null;
  coordNames: CoordNames | null;
  times: Float64Array | number[] | null;
  nlevels: number;
  lats: Float64Array | number[] | null;
  lons: Float64Array | number[] | null;
  timeIndex: number;
  levelIndex: number;
  latRange: [number, number];
  lonRange: [number, number];
  fetchedBbox: Bbox | null;
  slicedData: SlicedData | null;
  datakeys: ScalarDatakeys | VectorDatakeys | null;
  debouncedSlice: DebouncedFn | null;
}

type DeckDefaultProp = { type: string; value: any } | boolean;

const defaultProps: Record<string, DeckDefaultProp> = {
  serviceUrl: { type: "string", value: null },
  authHeaders: { type: "object", value: {} },
  layerId: { type: "string", value: null },
  instance: { type: "string", value: null },
  time: { type: "string", value: null },
  level: { type: "number", value: 0 },
  colormap: { type: "object", value: null },
  opacity: { type: "number", value: 1.0 },
  altitude: { type: "number", value: 0.0 },
  globalWrap: { type: "boolean", value: false },
  scale: { type: "number", value: 1.0 },
  offset: { type: "number", value: 0.0 },
  pickable: { type: "boolean", value: false },
  visible: { type: "boolean", value: true },
  viewportPadding: { type: "number", value: 0.1 },
  debounceWait: { type: "number", value: 100 },
  onDataLoad: { type: "function", value: null },
  errorHandlers: { type: "object", value: null },
  xvector: { type: "string", value: null },
  yvector: { type: "string", value: null },
  magnitude: { type: "string", value: null },
  direction: { type: "string", value: null },
  directionConvention: { type: "string", value: "NAUTICAL_FROM" },
};

// Typed accessors for deck.gl's untyped props/state/context
function getProps(layer: OceanumBaseLayer): OceanumLayerProps {
  return (layer as any).props;
}

function getState(layer: OceanumBaseLayer): OceanumLayerState {
  return (layer as any).state;
}

function getContext(layer: OceanumBaseLayer): { viewport?: { getBounds: () => [[number, number], [number, number]] } } {
  return (layer as any).context;
}

export default class OceanumBaseLayer extends CompositeLayer {
  static override layerName = "OceanumBaseLayer";
  static override defaultProps = defaultProps;

  override initializeState(): void {
    this.setState({
      dataset: null,
      loading: false,
      slicing: false,
      error: null,
      instance: null,
      coordNames: null,
      times: null,
      nlevels: 0,
      lats: null,
      lons: null,
      timeIndex: 0,
      levelIndex: 0,
      latRange: [0, 0],
      lonRange: [0, 0],
      fetchedBbox: null,
      slicedData: null,
      datakeys: null,
      debouncedSlice: debounce(
        () => this._requestSlice(),
        getProps(this).debounceWait,
      ),
    });

    this._openDataset();
  }

  override shouldUpdateState({ changeFlags }: any): boolean {
    return changeFlags.somethingChanged;
  }

  override updateState({ props, oldProps, changeFlags }: any): void {
    const p = props as OceanumLayerProps;
    const op = oldProps as OceanumLayerProps;
    const s = getState(this);

    if (p.debounceWait !== op.debounceWait) {
      if (s.debouncedSlice) s.debouncedSlice.cancel();
      this.setState({
        debouncedSlice: debounce(
          () => this._requestSlice(),
          p.debounceWait,
        ),
      });
    }

    if (
      p.layerId !== op.layerId ||
      p.instance !== op.instance ||
      p.serviceUrl !== op.serviceUrl ||
      this._variablePropsChanged(p, op)
    ) {
      this._openDataset();
      return;
    }

    if (!s.dataset) return;

    let needsSlice = false;

    if (p.time !== op.time && s.times) {
      const timeIndex = p.time
        ? nearestTimeIndex(s.times, p.time)
        : 0;
      if (timeIndex !== s.timeIndex) {
        this.setState({ timeIndex });
        needsSlice = true;
      }
    }

    if (p.level !== op.level) {
      const levelIndex = clampLevelIndex(p.level || 0, s.nlevels);
      if (levelIndex !== s.levelIndex) {
        this.setState({ levelIndex });
        needsSlice = true;
      }
    }

    if (needsSlice) {
      this._requestSlice();
      return;
    }

    if (changeFlags.viewportChanged && getContext(this).viewport) {
      const bbox = getViewportBbox(
        getContext(this).viewport!,
        p.viewportPadding,
      );
      if (!bboxContained(bbox, s.fetchedBbox)) {
        const lonR = indexRange(s.lons!, bbox.west, bbox.east);
        const latR = indexRange(s.lats!, bbox.south, bbox.north);
        this.setState({ latRange: latR, lonRange: lonR, fetchedBbox: bbox });
        if (s.debouncedSlice) {
          s.debouncedSlice();
        }
      }
    }
  }

  override finalizeState(): void {
    const s = getState(this);
    if (s.debouncedSlice) {
      s.debouncedSlice.cancel();
    }
  }

  _variablePropsChanged(props: OceanumLayerProps, oldProps: OceanumLayerProps): boolean {
    return (
      props.magnitude !== oldProps.magnitude ||
      props.direction !== oldProps.direction ||
      props.xvector !== oldProps.xvector ||
      props.yvector !== oldProps.yvector ||
      props.directionConvention !== oldProps.directionConvention
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _validateVariableProps(_props: OceanumLayerProps): string | null {
    return null;
  }

  _buildDatakeys(coordNames: CoordNames): ScalarDatakeys | VectorDatakeys {
    return { x: coordNames.x, y: coordNames.y };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createInnerLayer(_slicedData: SlicedData, _datakeys: ScalarDatakeys | VectorDatakeys): any {
    return null;
  }

  private _fireError(type: string, fields: Record<string, unknown>): void {
    const err = { type, ...fields } as LayerError;
    this.setState({ error: err });

    const hooks = getProps(this).errorHandlers || {};
    const hookName = `on${type.charAt(0).toUpperCase() + type.slice(1)}Error` as keyof ErrorHandlers;
    const handler = hooks[hookName] || DEFAULT_ERROR_HANDLERS[hookName];
    if (handler) handler(err);
  }

  private async _openDataset(): Promise<void> {
    const p = getProps(this);
    const { serviceUrl, layerId, authHeaders } = p;

    if (!serviceUrl || !layerId) return;

    const validationError = this._validateVariableProps(p);
    if (validationError) {
      this._fireError("validation", { message: validationError });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      let url = `${serviceUrl}/zarr/${layerId}`;
      let resolvedInstance = p.instance;

      if (!resolvedInstance) {
        const instances = await this._discoverInstances(url, authHeaders || {});
        if (instances.length > 0) {
          instances.sort();
          resolvedInstance = instances[instances.length - 1];
        }
      }

      if (resolvedInstance) {
        url = `${url}/${resolvedInstance}`;
      }

      const dataset = await Dataset.zarr(url, authHeaders || {});

      const coordNames = dataset.coordkeys;
      if (!coordNames || !coordNames.x || !coordNames.y) {
        throw new Error(
          "Dataset is missing required coordinate mappings (x, y) in _coordinates",
        );
      }

      const variableNames = getVariableNames(p);
      for (const varName of variableNames) {
        if (!dataset.variables[varName]) {
          const available = Object.keys(dataset.variables);
          this._fireError("variable", {
            layerId,
            variable: varName,
            availableVariables: available,
            message: `Variable "${varName}" not found in dataset. Available: ${available.join(", ")}`,
          });
          this.setState({ loading: false });
          return;
        }
      }

      const [lons, lats, times] = await Promise.all([
        dataset.variables[coordNames.x]?.get(),
        dataset.variables[coordNames.y]?.get(),
        coordNames.t && dataset.variables[coordNames.t]
          ? dataset.variables[coordNames.t].get()
          : null,
      ]);

      const nlevels =
        coordNames.z && dataset.dimensions[coordNames.z]
          ? dataset.dimensions[coordNames.z]
          : 0;

      const timeIndex =
        p.time && times ? nearestTimeIndex(times as number[], p.time) : 0;
      const levelIndex = clampLevelIndex(p.level || 0, nlevels);

      const cn: CoordNames = { x: coordNames.x!, y: coordNames.y!, t: coordNames.t, z: coordNames.z };
      const datakeys = this._buildDatakeys(cn);

      let latRange: [number, number] = [0, lats ? (lats as any[]).length - 1 : 0];
      let lonRange: [number, number] = [0, lons ? (lons as any[]).length - 1 : 0];
      let fetchedBbox: Bbox | null = null;

      if (getContext(this).viewport) {
        const bbox = getViewportBbox(
          getContext(this).viewport!,
          p.viewportPadding,
        );
        if (lons) lonRange = indexRange(lons as number[], bbox.west, bbox.east);
        if (lats) latRange = indexRange(lats as number[], bbox.south, bbox.north);
        fetchedBbox = bbox;
      }

      this.setState({
        dataset,
        loading: false,
        instance: resolvedInstance,
        coordNames: cn,
        times,
        nlevels,
        lats,
        lons,
        timeIndex,
        levelIndex,
        latRange,
        lonRange,
        fetchedBbox,
        datakeys,
      });

      if (p.onDataLoad) {
        const timeDates = times
          ? Array.from(times as ArrayLike<number>, (t: number) => new Date(t * 1000))
          : [];
        p.onDataLoad({
          dataset,
          times: timeDates,
          nlevels,
          instance: resolvedInstance,
        });
      }

      this._requestSlice();
    } catch (e) {
      this._fireError("metadata", {
        layerId,
        message: `Failed to open dataset: ${(e as Error).message}`,
        cause: e,
      });
      this.setState({ loading: false });
    }
  }

  private async _discoverInstances(
    rootUrl: string,
    authHeaders: Record<string, string>,
  ): Promise<string[]> {
    try {
      const resp = await fetch(`${rootUrl}/.zmetadata`, {
        headers: authHeaders,
      });
      if (!resp.ok) return [];
      const meta = await resp.json() as { metadata?: Record<string, unknown> };
      if (!meta.metadata) return [];

      const groups = new Set<string>();
      for (const key of Object.keys(meta.metadata)) {
        const parts = key.split("/");
        if (parts.length === 2 && parts[1] === ".zgroup") {
          groups.add(parts[0]);
        }
      }
      return Array.from(groups);
    } catch {
      return [];
    }
  }

  private async _requestSlice(): Promise<void> {
    const s = getState(this);
    const { dataset, coordNames, timeIndex, levelIndex, latRange, lonRange } = s;

    if (!dataset || !coordNames) return;

    const variableNames = getVariableNames(getProps(this));
    if (variableNames.length === 0) return;

    this.setState({ slicing: true });

    try {
      const slicedData = await sliceDataset(
        dataset as any,
        coordNames,
        variableNames,
        timeIndex,
        levelIndex,
        latRange,
        lonRange,
      );

      this.setState({ slicedData, slicing: false, error: null });
    } catch (e) {
      this._fireError("chunk", {
        layerId: getProps(this).layerId,
        time: s.times
          ? new Date((s.times as number[])[timeIndex] * 1000)
          : null,
        level: levelIndex,
        message: `Chunk fetch failed: ${(e as Error).message}`,
        cause: e,
      });
      this.setState({ slicing: false });
    }
  }

  override renderLayers() {
    const s = getState(this);
    if (!s.slicedData || !s.datakeys) return [];
    return this._createInnerLayer(s.slicedData, s.datakeys);
  }
}
