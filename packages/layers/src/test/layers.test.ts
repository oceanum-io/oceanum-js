import { describe, it, expect } from "vitest";

import OceanumPcolorLayer from "../oceanum-pcolor-layer";
import OceanumParticleLayer from "../oceanum-particle-layer";
import OceanumPartmeshLayer from "../oceanum-partmesh-layer";
import OceanumContourLayer from "../oceanum-contour-layer";

describe("OceanumPcolorLayer", () => {
  it("has correct layer name", () => {
    expect(OceanumPcolorLayer.layerName).toBe("OceanumPcolorLayer");
  });

  it("has required default props", () => {
    const props = OceanumPcolorLayer.defaultProps;
    expect(props.serviceUrl).toBeDefined();
    expect(props.layerId).toBeDefined();
    expect(props.color).toBeDefined();
  });

  it("validates: rejects no variables", () => {
    const layer = Object.create(OceanumPcolorLayer.prototype);
    expect(layer._validateVariableProps({})).toContain("magnitude");
  });

  it("validates: accepts magnitude", () => {
    const layer = Object.create(OceanumPcolorLayer.prototype);
    expect(layer._validateVariableProps({ magnitude: "hs" })).toBeNull();
  });

  it("validates: accepts xvector + yvector", () => {
    const layer = Object.create(OceanumPcolorLayer.prototype);
    expect(
      layer._validateVariableProps({ xvector: "u10", yvector: "v10" }),
    ).toBeNull();
  });

  it("builds scalar datakeys with magnitude", () => {
    const layer = Object.create(OceanumPcolorLayer.prototype);
    layer.props = { magnitude: "temperature" };
    const dk = layer._buildDatakeys({ x: "lon", y: "lat" });
    expect(dk).toEqual({ x: "lon", y: "lat", c: "temperature" });
  });

  it("builds scalar datakeys with xvector + yvector", () => {
    const layer = Object.create(OceanumPcolorLayer.prototype);
    layer.props = { xvector: "u10", yvector: "v10" };
    const dk = layer._buildDatakeys({ x: "lon", y: "lat" });
    expect(dk).toEqual({ x: "lon", y: "lat", u: "u10", v: "v10" });
  });
});

describe("OceanumParticleLayer", () => {
  it("has correct layer name", () => {
    expect(OceanumParticleLayer.layerName).toBe("OceanumParticleLayer");
  });

  it("validates: rejects no variables", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    expect(layer._validateVariableProps({})).toContain("xvector");
  });

  it("validates: rejects both pairs", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    const result = layer._validateVariableProps({
      xvector: "u",
      yvector: "v",
      magnitude: "mag",
      direction: "dir",
    });
    expect(result).toContain("not both");
  });

  it("validates: accepts xvector + yvector", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    expect(
      layer._validateVariableProps({ xvector: "u10", yvector: "v10" }),
    ).toBeNull();
  });

  it("validates: accepts magnitude + direction", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    expect(
      layer._validateVariableProps({ magnitude: "wspd", direction: "wdir" }),
    ).toBeNull();
  });

  it("builds vector datakeys for xvector + yvector", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    layer.props = { xvector: "u10", yvector: "v10" };
    const dk = layer._buildDatakeys({ x: "lon", y: "lat" });
    expect(dk).toEqual({ x: "lon", y: "lat", u: "u10", v: "v10" });
  });

  it("builds vector datakeys for magnitude + direction", () => {
    const layer = Object.create(OceanumParticleLayer.prototype);
    layer.props = { magnitude: "wspd", direction: "wdir" };
    const dk = layer._buildDatakeys({ x: "lon", y: "lat" });
    expect(dk).toEqual({ x: "lon", y: "lat", m: "wspd", d: "wdir" });
  });
});

describe("OceanumPartmeshLayer", () => {
  it("has correct layer name", () => {
    expect(OceanumPartmeshLayer.layerName).toBe("OceanumPartmeshLayer");
  });

  it("validates: rejects no variables", () => {
    const layer = Object.create(OceanumPartmeshLayer.prototype);
    expect(layer._validateVariableProps({})).toContain("xvector");
  });

  it("validates: accepts xvector + yvector", () => {
    const layer = Object.create(OceanumPartmeshLayer.prototype);
    expect(
      layer._validateVariableProps({ xvector: "u", yvector: "v" }),
    ).toBeNull();
  });

  it("validates: accepts magnitude + direction", () => {
    const layer = Object.create(OceanumPartmeshLayer.prototype);
    expect(
      layer._validateVariableProps({ magnitude: "wspd", direction: "wdir" }),
    ).toBeNull();
  });
});

describe("OceanumContourLayer", () => {
  it("has correct layer name", () => {
    expect(OceanumContourLayer.layerName).toBe("OceanumContourLayer");
  });

  it("validates: rejects no variables", () => {
    const layer = Object.create(OceanumContourLayer.prototype);
    expect(layer._validateVariableProps({})).toContain("magnitude");
  });

  it("validates: accepts magnitude", () => {
    const layer = Object.create(OceanumContourLayer.prototype);
    expect(layer._validateVariableProps({ magnitude: "msl" })).toBeNull();
  });

  it("validates: accepts xvector + yvector", () => {
    const layer = Object.create(OceanumContourLayer.prototype);
    expect(
      layer._validateVariableProps({ xvector: "u10", yvector: "v10" }),
    ).toBeNull();
  });

  it("builds scalar datakeys with magnitude", () => {
    const layer = Object.create(OceanumContourLayer.prototype);
    layer.props = { magnitude: "msl" };
    const dk = layer._buildDatakeys({ x: "longitude", y: "latitude" });
    expect(dk).toEqual({ x: "longitude", y: "latitude", c: "msl" });
  });

  it("has contour-specific default props", () => {
    const props = OceanumContourLayer.defaultProps;
    expect(props.levels).toBeDefined();
    expect(props.labelSize).toBeDefined();
    expect(props.smoothing).toBeDefined();
  });
});
