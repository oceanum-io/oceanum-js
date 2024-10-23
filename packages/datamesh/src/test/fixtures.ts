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
    data_vars: {},
  },
  coordinates: { t: "time" },
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
export const dataset: Schema = {
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

export const datameshTest = test.extend({
  metadata: async ({}, use: Function) => {
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
  dataset: async ({}, use: Function) => {
    // setup the fixture before each test function

    let resp = await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test/", {
      method: "PUT",
      headers: HEADERS,
      body: jsonify(dataset),
    });
    if (resp.status !== 200) {
      throw new Error("Failed to write dataset");
    }
    const patch = jsonify({
      coordinates: { t: "time", x: "lon", y: "lat" },
    });
    resp = await fetch(DATAMESH_SERVICE + "/datasource/oceanum-js-test/", {
      method: "PATCH",
      headers: HEADERS,
      body: patch,
    });
    if (resp.status !== 200) {
      throw new Error("Failed to register dataset");
    }
    dataset.attrs = { id: "oceanum-js-test" };

    // use the fixture value
    await use(dataset);

    // cleanup the fixture after each test function
    await fetch(DATAMESH_GATEWAY + "/data/oceanum-js-test", {
      method: "DELETE",
      headers: HEADERS,
    });
  },
});
