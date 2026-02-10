/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartmeshLayer } from "@oceanum/deck-gl-grid";
import OceanumBaseLayer from "./oceanum-base-layer";
import type { OceanumLayerProps } from "./oceanum-base-layer";
import { buildVectorDatakeys } from "./utils/coordinates";
import type { CoordNames, VectorDatakeys } from "./utils/coordinates";
import type { SlicedData } from "./utils/dataset-slice";

export interface OceanumPartmeshLayerProps extends OceanumLayerProps {
  speed: number;
  size: number;
  color: [number, number, number];
  meshShape: string;
  meshLength: number;
  meshWidth: number;
  meshSize: number;
}

const defaultProps = {
  ...OceanumBaseLayer.defaultProps,
  speed: { type: "number", value: 1.0 },
  size: { type: "number", value: 3 },
  color: { type: "array", value: [200, 200, 200] },
  meshShape: { type: "string", value: "cone" },
  meshLength: { type: "number", value: 4 },
  meshWidth: { type: "number", value: 1 },
  meshSize: { type: "number", value: 1 },
};

export default class OceanumPartmeshLayer extends OceanumBaseLayer {
  static override layerName = "OceanumPartmeshLayer";
  static override defaultProps = defaultProps;

  override _validateVariableProps(props: OceanumLayerProps): string | null {
    const hasXY = props.xvector && props.yvector;
    const hasMagDir = props.magnitude && props.direction;

    if (!hasXY && !hasMagDir) {
      return 'OceanumPartmeshLayer requires "xvector" + "yvector" or "magnitude" + "direction"';
    }
    if (hasXY && hasMagDir) {
      return 'OceanumPartmeshLayer: provide "xvector" + "yvector" or "magnitude" + "direction", not both';
    }
    return null;
  }

  override _buildDatakeys(coordNames: CoordNames): VectorDatakeys {
    return buildVectorDatakeys(coordNames, (this as any).props);
  }

  override _createInnerLayer(slicedData: SlicedData, datakeys: VectorDatakeys) {
    const p = (this as any).props as OceanumPartmeshLayerProps;
    return new PartmeshLayer({
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
      direction: p.directionConvention,
      speed: p.speed,
      size: p.size,
      mesh: {
        shape: p.meshShape,
        length: p.meshLength,
        width: p.meshWidth,
        size: p.meshSize,
      },
      pickable: p.pickable,
      visible: p.visible,
    });
  }
}
