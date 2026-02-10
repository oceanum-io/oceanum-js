/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContourLayer } from "@oceanum/deck-gl-grid";
import OceanumBaseLayer from "./oceanum-base-layer";
import type { OceanumLayerProps } from "./oceanum-base-layer";
import { buildScalarDatakeys } from "./utils/coordinates";
import type { CoordNames, ScalarDatakeys } from "./utils/coordinates";
import type { SlicedData } from "./utils/dataset-slice";

export interface OceanumContourLayerProps extends OceanumLayerProps {
  levels: number[];
  labelSize: number;
  labelColor: [number, number, number, number];
  smoothing: boolean;
  numLabels: number;
  color: [number, number, number];
}

const defaultProps = {
  ...OceanumBaseLayer.defaultProps,
  levels: { type: "array", value: [] },
  labelSize: { type: "number", value: 12 },
  labelColor: { type: "array", value: [255, 255, 255, 255] },
  smoothing: { type: "boolean", value: false },
  numLabels: { type: "number", value: 1 },
  color: { type: "array", value: [200, 200, 200] },
};

export default class OceanumContourLayer extends OceanumBaseLayer {
  static override layerName = "OceanumContourLayer";
  static override defaultProps = defaultProps;

  override _validateVariableProps(props: OceanumLayerProps): string | null {
    const hasMag = !!props.magnitude;
    const hasXY = props.xvector && props.yvector;
    if (!hasMag && !hasXY) {
      return 'OceanumContourLayer requires "magnitude" or "xvector" + "yvector"';
    }
    return null;
  }

  override _buildDatakeys(coordNames: CoordNames): ScalarDatakeys {
    return buildScalarDatakeys(coordNames, (this as any).props);
  }

  override _createInnerLayer(slicedData: SlicedData, datakeys: ScalarDatakeys) {
    const p = (this as any).props as OceanumContourLayerProps;
    return new ContourLayer({
      id: `${p.id}-inner`,
      data: slicedData,
      datakeys,
      opacity: p.opacity,
      altitude: p.altitude,
      globalWrap: p.globalWrap,
      colormap: p.colormap,
      scale: p.scale,
      offset: p.offset,
      color: p.color,
      levels: p.levels,
      labelSize: p.labelSize,
      labelColor: p.labelColor,
      smoothing: p.smoothing,
      numLabels: p.numLabels,
      pickable: p.pickable,
      visible: p.visible,
    });
  }
}
