import { assertType, test, expect } from "vitest";
import { Dataset, IDataVar } from "../lib/datamodel";
import { Connector } from "../lib/connector";
import { dataset, datameshTest, DATAMESH_GATEWAY, HEADERS } from "./fixtures";

test("dataset init", async () => {
  const dstest = await Dataset.init(dataset);
  assertType<Record<string, unknown>>(dstest.attrs);
  assertType<Record<string, IDataVar>>(dstest.data_vars);
  const datatest = await dstest.data_vars.temperature.get();
  expect(datatest).toBeInstanceOf(Array);
  expect(datatest.length).toBe(10);
  expect(datatest[0].length).toBe(30);
  expect(datatest[0][0].length).toBe(20);
  expect(datatest[3][4][5]).toEqual(
    dataset.data_vars.temperature.data[3][4][5]
  );
  const datatest0 = await dstest.data_vars.scalar.get();
  expect(datatest0[0]).closeTo(10.1, 0.0001);
});

datameshTest(
  "dataset zarr",
  async ({ dataset: Dataset }) => {
    //Test the zarr proxy endpoint directly
    const dstest = await Dataset.zarr(
      DATAMESH_GATEWAY + "/zarr/" + dataset.attrs.id,
      HEADERS
    );
    assertType<Record<string, unknown>>(dstest.attrs);
    assertType<Record<string, IDataVar>>(dstest.data_vars);
    let datatest = await dstest.data_vars.temperature.get();
    expect(datatest).toBeInstanceOf(Array);
    expect(datatest.length).toBe(10);
    expect(datatest[0].length).toBe(30);
    expect(datatest[0][0].length).toBe(20);
    expect(datatest[3][4][5]).toEqual(
      dataset.data_vars.temperature.data[3][4][5]
    );
    datatest = await dstest.data_vars.scalar.get();
    expect(datatest[0]).closeTo(10.1, 0.0001);

    //Now test with the connector
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const dstest2 = await datamesh.loadDatasource(dataset.attrs.id);
    assertType<Record<string, unknown>>(dstest2.attrs);
    assertType<Record<string, IDataVar>>(dstest2.data_vars);
    datatest = await dstest.data_vars.temperature.get();
    expect(datatest).toBeInstanceOf(Array);
    expect(datatest.length).toBe(10);
    expect(datatest[0].length).toBe(30);
    expect(datatest[0][0].length).toBe(20);
    expect(datatest[3][4][5]).toEqual(
      dataset.data_vars.temperature.data[3][4][5]
    );
    datatest = await dstest.data_vars.scalar.get();
    expect(datatest[0]).closeTo(10.1, 0.0001);
  },
  { timeout: 100000 }
);
