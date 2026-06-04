import { assertType, test, expect } from "vitest";
import { Dataset, HttpZarr, TempZarr } from "../lib/datamodel";
import { IQuery } from "../lib/query";
import { Connector } from "../lib/connector";
import { datameshTest } from "./fixtures";

test("datasource type", () => {
  const query: IQuery = {
    datasource: "test",
    geofilter: {
      type: "feature",
      geom: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [10, -10],
        },
      },
    },
    variables: ["temperature"],
  };
  assertType<Record<string, unknown>>(query.geofilter!);
});

datameshTest("datamesh query", { timeout: 100000 }, async ({ dataset }) => {
  const datamesh = new Connector(process.env.DATAMESH_TOKEN);
  const query: IQuery = {
    datasource: dataset.attrs.id,
    geofilter: {
      type: "feature",
      geom: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [10, -11],
        },
      },
    },
  };
  const dstest = await datamesh.query(query);
  if (!dstest) throw new Error("No dataset returned");
  assertType<Dataset<HttpZarr | TempZarr>>(dstest);
  const datatest = (await dstest.variables.temperature.get()) as Float64Array;
  expect(datatest).toBeInstanceOf(Float64Array);
  expect(datatest.length).toBe(10);
  expect(datatest[5]).toEqual(
    (dataset.data_vars.temperature.data as number[][][])[5][11][10],
  );
});
