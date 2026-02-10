/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParticleLayer } from "@oceanum/deck-gl-grid";
import OceanumBaseLayer from "./oceanum-base-layer";
import type { OceanumLayerProps } from "./oceanum-base-layer";
import { buildVectorDatakeys } from "./utils/coordinates";
import type { CoordNames, VectorDatakeys } from "./utils/coordinates";
import type { SlicedData } from "./utils/dataset-slice";

export interface OceanumParticleLayerProps extends OceanumLayerProps {
  speed: number;
  npart: number;
  size: number;
  length: number;
  color: [number, number, number];
}

const defaultProps = {
  ...OceanumBaseLayer.defaultProps,
  speed: { type: "number", value: 1.0 },
  npart: { type: "number", value: 1000 },
  size: { type: "number", value: 3 },
  length: { type: "number", value: 12 },
  color: { type: "array", value: [200, 200, 200] },
};

export default class OceanumParticleLayer extends OceanumBaseLayer {
  static override layerName = "OceanumParticleLayer";
  static override defaultProps = defaultProps;

  override _validateVariableProps(props: OceanumLayerProps): string | null {
    const hasXY = props.xvector && props.yvector;
    const hasMagDir = props.magnitude && props.direction;

    if (!hasXY && !hasMagDir) {
      return 'OceanumParticleLayer requires "xvector" + "yvector" or "magnitude" + "direction"';
    }
    if (hasXY && hasMagDir) {
      return 'OceanumParticleLayer: provide "xvector" + "yvector" or "magnitude" + "direction", not both';
    }
    return null;
  }

  override _buildDatakeys(coordNames: CoordNames): VectorDatakeys {
    return buildVectorDatakeys(coordNames, (this as any).props);
  }

  override _createInnerLayer(slicedData: SlicedData, datakeys: VectorDatakeys) {
    const p = (this as any).props as OceanumParticleLayerProps;
    return new ParticleLayer({
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
      npart: p.npart,
      size: p.size,
      length: p.length,
      pickable: p.pickable,
      visible: p.visible,
    });
  }
}
