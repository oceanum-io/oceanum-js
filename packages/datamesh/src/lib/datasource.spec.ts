import { assertType, test } from "vitest";
import { Datasource } from "./datasource.js";

test("datasource type", () => {
  const datasource: Datasource = {
    id: "1",
    name: "test",
    description: "test",
    schema: {
      attrs: {},
      dims: {},
      data_vars: {},
    },
  };
  assertType<Record<string, unknown>>(datasource.schema.attrs);
  assertType<Record<string, unknown>>(datasource.schema.dims);
  assertType<Record<string, unknown>>(datasource.schema.data_vars);
});
