import { assertType, test, expect } from "vitest";
import { Dataset } from "../lib/datamodel";
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
  assertType<Record<string, unknown>>(query.geofilter);
});

datameshTest(
  "datamesh query",
  async ({ dataset }) => {
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const query = {
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
    assertType<Dataset>(dstest);
    const datatest = await dstest.variables.temperature.get();
    expect(datatest).toBeInstanceOf(Float64Array);
    expect(datatest.length).toBe(10);
    expect(datatest[5]).toEqual(dataset.data_vars.temperature.data[5][11][10]);
  },
  { timeout: 100000 }
);
