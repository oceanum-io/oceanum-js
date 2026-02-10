/* eslint-disable @typescript-eslint/no-explicit-any */
import { PcolorLayer } from "@oceanum/deck-gl-grid";
import OceanumBaseLayer from "./oceanum-base-layer";
import type { OceanumLayerProps } from "./oceanum-base-layer";
import { buildScalarDatakeys } from "./utils/coordinates";
import type { CoordNames, ScalarDatakeys } from "./utils/coordinates";
import type { SlicedData } from "./utils/dataset-slice";

export interface OceanumPcolorLayerProps extends OceanumLayerProps {
  color: [number, number, number];
  material: boolean;
}

const defaultProps = {
  ...OceanumBaseLayer.defaultProps,
  color: { type: "array", value: [200, 200, 200] },
  material: false,
};

export default class OceanumPcolorLayer extends OceanumBaseLayer {
  static override layerName = "OceanumPcolorLayer";
  static override defaultProps = defaultProps;

  override _validateVariableProps(props: OceanumLayerProps): string | null {
    const hasMag = !!props.magnitude;
    const hasXY = props.xvector && props.yvector;
    if (!hasMag && !hasXY) {
      return 'OceanumPcolorLayer requires "magnitude" or "xvector" + "yvector"';
    }
    return null;
  }

  override _buildDatakeys(coordNames: CoordNames): ScalarDatakeys {
    return buildScalarDatakeys(coordNames, (this as any).props);
  }

  override _createInnerLayer(slicedData: SlicedData, datakeys: ScalarDatakeys) {
    const p = (this as any).props as OceanumPcolorLayerProps;
    return new PcolorLayer({
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
      material: p.material,
      pickable: p.pickable,
      visible: p.visible,
    });
  }
}
