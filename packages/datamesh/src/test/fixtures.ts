import { test } from "vitest";
import { Datasource } from "../lib/datasource";

const HEADERS = {
  Authorization: `Token ${process.env.DATAMESH_TOKEN}`,
  "X-DATAMESH-TOKEN": process.env.DATAMESH_TOKEN,
  Accept: "application/json",
  "Content-Type": "application/json",
};
const DATAMESH_SERVICE =
  process.env.DATAMESH_SERVICE || "https://datamesh.oceanum.io";
const DATAMESH_GATEWAY =
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
  driver: "onzarr",
};

export const datameshTest = test.extend({
  metadata: async ({}, use) => {
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
  dataset: async ({}, use) => {
    // setup the fixture before each test function

    const resp = await fetch(GATEWAY_SERVICE + "/data/" + datasource.id, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(datasource),
    });
    if (resp.status !== 200) {
      throw new Error("Failed to register dataset");
    }

    // use the fixture value
    await use(true);

    // cleanup the fixture after each test function
    await fetch(GATEWAY_SERVICE + "/data/" + datasource.id, {
      method: "DELETE",
      headers: HEADERS,
    });
  },
});
