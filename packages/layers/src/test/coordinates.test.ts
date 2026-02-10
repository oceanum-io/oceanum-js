import { describe, it, expect } from "vitest";
import {
  buildScalarDatakeys,
  buildVectorDatakeys,
  getVariableNames,
} from "../utils/coordinates";

describe("buildScalarDatakeys", () => {
  it("builds datakeys with magnitude", () => {
    const result = buildScalarDatakeys(
      { x: "longitude", y: "latitude" },
      { magnitude: "temperature" },
    );
    expect(result).toEqual({
      x: "longitude",
      y: "latitude",
      c: "temperature",
    });
  });

  it("builds datakeys with xvector + yvector", () => {
    const result = buildScalarDatakeys(
      { x: "lon", y: "lat" },
      { xvector: "u10", yvector: "v10" },
    );
    expect(result).toEqual({ x: "lon", y: "lat", u: "u10", v: "v10" });
  });
});

describe("buildVectorDatakeys", () => {
  it("builds datakeys for xvector + yvector", () => {
    const result = buildVectorDatakeys(
      { x: "lon", y: "lat" },
      { xvector: "u10", yvector: "v10" },
    );
    expect(result).toEqual({ x: "lon", y: "lat", u: "u10", v: "v10" });
  });

  it("builds datakeys for magnitude + direction", () => {
    const result = buildVectorDatakeys(
      { x: "lon", y: "lat" },
      { magnitude: "wspd", direction: "wdir" },
    );
    expect(result).toEqual({ x: "lon", y: "lat", m: "wspd", d: "wdir" });
  });
});

describe("getVariableNames", () => {
  it("returns magnitude", () => {
    expect(getVariableNames({ magnitude: "hs" })).toEqual(["hs"]);
  });

  it("returns xvector + yvector", () => {
    expect(getVariableNames({ xvector: "u10", yvector: "v10" })).toEqual([
      "u10",
      "v10",
    ]);
  });

  it("returns magnitude + direction", () => {
    expect(getVariableNames({ magnitude: "wspd", direction: "wdir" })).toEqual([
      "wspd",
      "wdir",
    ]);
  });

  it("returns empty for no variable props", () => {
    expect(getVariableNames({})).toEqual([]);
  });
});
