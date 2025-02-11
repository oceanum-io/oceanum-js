/// <reference lib="dom" />

import { test } from "vitest";
import { Datasource, Schema } from "../lib/datasource";

const DATAMESH_TOKEN: string = process.env.DATAMESH_TOKEN || "$DATAMESH_TOKEN";
export const HEADERS: HeadersInit = {
  Authorization: `Token ${DATAMESH_TOKEN}`,
  "X-DATAMESH-TOKEN": DATAMESH_TOKEN,
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const DATAMESH_SERVICE =
  process.env.DATAMESH_SERVICE || "https://datamesh.oceanum.io";
export const DATAMESH_GATEWAY =
  process.env.DATAMESH_GATEWAY || "https://gateway.datamesh.oceanum.io";

const datasource: Datasource = {
  id: "datamesh-js-test",
  name: "test",
  description: "datamesh-js test registration",
  schema: {
    attrs: {},
    dims: {},
    vars: {},
  },
  coordmap: { t: "time" },
  driver: "onzarr",
};

//Create multidemensional random array of typed data
const createFloatArray = (
  dims: number[],
  depth = 0,
  typed = false
): number[] | Float32Array | Float32Array[] => {
  const size = dims[depth];
  const array =
    typed && depth == dims.length - 1
      ? new Float32Array(size)
      : new Array(size);
  if (depth === dims.length - 1) {
    for (let i = 0; i < size; i++) {
      array[i] = Math.random();
    }
  } else {
    for (let i = 0; i < size; i++) {
      array[i] = createFloatArray(dims, depth + 1, typed);
    }
  }
  return array;
};

const jsonify = (data: Record<string, unknown>): string => {
  return JSON.stringify(data, function (key, value) {
    if (
      value instanceof Int8Array ||
      value instanceof Uint8Array ||
      value instanceof Uint8ClampedArray ||
      value instanceof Int16Array ||
      value instanceof Uint16Array ||
      value instanceof Int32Array ||
      value instanceof Uint32Array ||
      value instanceof Float32Array ||
      value instanceof Float64Array
    ) {
      return Array.from(value);
    }
    return value;
  });
};

const scalar = new Float32Array(1);
scalar[0] = 10.1;

export const datameshTest = test.extend({
  metadata: async ({}, use: (dsrc: Datasource) => Promise<void>) => {
    // setup the fixture before each test function
    console.log(HEADERS);
    const resp = await fetch(DATAMESH_SERVICE + "/datasource/", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(datasource),
    });
    if (resp.status !== 201) {
      const text = await resp.text();
      throw new Error("Failed to register datasource: " + text);
    }

    // use the fixture value
    await use(datasource);

    // cleanup the fixture after each test function
    await fetch(DATAMESH_SERVICE + "/datasource/" + datasource.id, {
      method: "DELETE",
      headers: HEADERS,
    });
  },
  dataset: async ({}, use: (ds: object) => Promise<void>) => {
    const ds = {
      attrs: { id: "oceanum-js-test-ds" },
      dims: { one: 1, time: 10, lon: 20, lat: 30 },
      coords: {
        time: {
          dims: ["time"],
          attrs: { units: "unix timestamp" },
          data: [...Array(10).keys()].map((i) => 86400000 * i),
        },
        lon: {
          dims: ["lon"],
          attrs: { units: "degrees east" },
          data: [...Array(20).keys()].map((i) => i),
        },
        lat: {
          dims: ["lat"],
          attrs: { units: "degrees north" },
          data: [...Array(30).keys()].map((i) => -i),
        },
      },
      data_vars: {
        temperature: {
          dims: ["time", "lat", "lon"],
          attrs: { units: "C" },
          data: createFloatArray([10, 30, 20], 0, true),
        },
        elevation: {
          dims: ["lat", "lon"],
          attrs: { units: "m" },
          data: createFloatArray([30, 20], 0, false),
        },
        scalar: {
          dims: ["one"],
          attrs: { units: "m" },
          data: scalar,
        },
      },
    };
    // setup the fixture before each test function
    let resp = await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-ds/", {
      method: "PUT",
      headers: HEADERS,
      body: jsonify(ds),
    });
    if (resp.status !== 200) {
      const text = await resp.text();
      throw new Error("Failed to write dataset: " + text);
    }
    const patch = jsonify({
      coordmap: { t: "time", x: "lon", y: "lat" },
    });
    resp = await fetch(DATAMESH_SERVICE + "/datasource/oceanum-js-test-ds/", {
      method: "PATCH",
      headers: HEADERS,
      body: patch,
    });
    if (resp.status !== 200) {
      throw new Error("Failed to register dataset");
    }

    // use the fixture value
    await use(ds);

    // cleanup the fixture after each test function
    await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-ds", {
      method: "DELETE",
      headers: HEADERS,
    });
  },
  dataframe: async ({}, use: (df: object) => Promise<void>) => {
    // setup the fixture before each test function
    const df = {
      schema: {
        fields: [
          { name: "time", type: "datetime", tz: "UTC" },
          { name: "temperature", type: "number" },
          { name: "elevation", type: "number" },
        ],
        primaryKey: ["time"],
        pandas_version: "1.4.0",
      },
      data: [
        { time: "1970-01-01T00:00:00.000Z", temperature: 15.5, elevation: 100 },
        { time: "1970-01-02T00:00:00.000Z", temperature: 15.8, elevation: 120 },
        { time: "1970-01-03T00:00:00.000Z", temperature: 15.3, elevation: 110 },
      ],
    };

    let resp = await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-df/", {
      method: "PUT",
      headers: HEADERS,
      body: jsonify(df),
    });
    if (resp.status !== 200) {
      const text = await resp.text();
      throw new Error("Failed to write dataframe: " + text);
    }

    const patch = jsonify({
      coordmap: { t: "time" },
      container: "dataframe",
    });
    resp = await fetch(DATAMESH_SERVICE + "/datasource/oceanum-js-test-df/", {
      method: "PATCH",
      headers: HEADERS,
      body: patch,
    });
    if (resp.status !== 200) {
      throw new Error("Failed to register dataframe");
    }

    //use the fixture value
    await use(df);

    // cleanup the fixture after each test function
    await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-df", {
      method: "DELETE",
      headers: HEADERS,
    });
  },
  geodataframe: async ({}, use: (df: object) => Promise<void>) => {
    // setup the fixture before each test function
    const gdf = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordmap: [174.0, -37.0],
          },
          properties: {
            time: "1970-01-01T00:00:00.000Z",
            temperature: 15.5,
            elevation: 100,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordmap: [174.1, -37.0],
          },
          properties: {
            time: "1970-01-02T00:00:00.000Z",
            temperature: 15.8,
            elevation: 100,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordmap: [174.2, -37.0],
          },
          properties: {
            time: "1970-01-03T00:00:00.000Z",
            temperature: 15.3,
            elevation: 100,
          },
        },
      ],
    };

    let resp = await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-gdf/", {
      method: "PUT",
      headers: HEADERS,
      body: jsonify(gdf),
    });
    if (resp.status !== 200) {
      throw new Error("Failed to write geodataframe");
    }

    const patch = jsonify({
      coordmap: { t: "time", g: "geometry" },
      container: "geodataframe",
    });
    resp = await fetch(DATAMESH_SERVICE + "/datasource/oceanum-js-test-gdf/", {
      method: "PATCH",
      headers: HEADERS,
      body: patch,
    });
    if (resp.status !== 200) {
      throw new Error("Failed to register geodataframe");
    }

    // use the fixture value
    await use(gdf);

    // cleanup the fixture after each test function
    await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test-gdf", {
      method: "DELETE",
      headers: HEADERS,
    });
  },
});
