import { assertType, test, expect } from "vitest";
import { Datasource } from "../lib/datasource";
import { Connector } from "../lib/connector";
import { datameshTest } from "./fixtures";

test("datasource type", () => {
  const datasource: Datasource = {
    id: "1",
    name: "test",
    description: "test",
    schema: {
      attrs: {},
      dims: {},
      vars: {},
    },
  };
  assertType<Record<string, unknown>>(datasource.schema.attrs);
  assertType<Record<string, unknown>>(datasource.schema.dims);
  assertType<Record<string, unknown>>(datasource.schema.vars);
});

datameshTest("datasource_metadata", async ({ metadata }) => {
  const connector = new Connector(process.env.DATAMESH_TOKEN);
  const datasource = await connector.getDatasource(metadata.id);
  assertType<Datasource>(datasource);
  expect(datasource.id).toBe(metadata.id);
  expect(datasource.name).toBe(metadata.name);
});
