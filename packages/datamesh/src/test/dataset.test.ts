import { assertType, test, expect } from "vitest";
import { Dataset, IDataVar } from "../lib/datamodel";
import { Connector } from "../lib/connector";
import { dataset, datameshTest, DATAMESH_GATEWAY, HEADERS } from "./fixtures";

test("dataset init", async () => {
  const dstest = await Dataset.init(dataset);
  assertType<Record<string, unknown>>(dstest.attributes);
  assertType<Record<string, IDataVar>>(dstest.variables);
  const datatest = await dstest.variables.temperature.get();
  expect(datatest).toBeInstanceOf(Array);
  expect(datatest.length).toBe(10);
  expect(datatest[0].length).toBe(30);
  expect(datatest[0][0].length).toBe(20);
  expect(datatest[3][4][5]).toEqual(
    dataset.variables.temperature.data[3][4][5]
  );
  const datatest0 = await dstest.variables.scalar.get();
  expect(datatest0[0]).closeTo(10.1, 0.0001);
});

datameshTest(
  "dataset zarr",
  async ({ dataset }) => {
    //Test the zarr proxy endpoint directly
    const dstest = await Dataset.zarr(
      DATAMESH_GATEWAY + "/zarr/" + dataset.attrs.id,
      HEADERS
    );
    assertType<Record<string, unknown>>(dstest.attributes);
    assertType<Record<string, IDataVar>>(dstest.variables);
    let datatest = await dstest.variables.temperature.get();
    expect(datatest).toBeInstanceOf(Array);
    expect(datatest.length).toBe(10);
    expect(datatest[0].length).toBe(30);
    expect(datatest[0][0].length).toBe(20);
    expect(datatest[3][4][5]).toEqual(
      dataset.data_vars.temperature.data[3][4][5]
    );
    datatest = await dstest.variables.scalar.get();
    expect(datatest[0]).closeTo(10.1, 0.0001);

    //Now test with the connector
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const dstest2 = await datamesh.loadDatasource(dataset.attrs.id);
    assertType<Record<string, unknown>>(dstest2.attributes);
    assertType<Record<string, IDataVar>>(dstest2.variables);
    datatest = await dstest2.variables.temperature.get();
    expect(datatest).toBeInstanceOf(Array);
    expect(datatest.length).toBe(10);
    expect(datatest[0].length).toBe(30);
    expect(datatest[0][0].length).toBe(20);
    expect(datatest[3][4][5]).toEqual(
      dataset.data_vars.temperature.data[3][4][5]
    );
    datatest = await dstest2.variables.scalar.get();
    expect(datatest[0]).closeTo(10.1, 0.0001);
  },
  { timeout: 200000 }
);

datameshTest("dataset fromGeojson", async () => {
  // Test invalid FeatureCollection (no features array)
  const invalidGeoJson = {
    type: "FeatureCollection",
  };
  await expect(Dataset.fromGeojson(invalidGeoJson)).rejects.toThrow(
    "Invalid FeatureCollection: features array is required"
  );

  // Test empty FeatureCollection
  const emptyGeoJson = {
    type: "FeatureCollection",
    features: [],
  };
  await expect(Dataset.fromGeojson(emptyGeoJson)).rejects.toThrow(
    "FeatureCollection contains no features"
  );

  // Test valid GeoJSON with multiple features and property types
  const validGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [174.0, -37.0],
        },
        properties: {
          time: "1970-01-01T00:00:00.000Z",
          temperature: 15.5,
          elevation: 100,
          name: "Location A",
          active: true,
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [174.1, -37.1],
            [174.2, -37.2],
          ],
        },
        properties: {
          time: "1970-01-02T00:00:00.000Z",
          temperature: 16.5,
          elevation: 200,
          name: "Path B",
          active: false,
        },
      },
    ],
  };

  const ds = await Dataset.fromGeojson(validGeoJson);

  // Test that Dataset was created with correct structure
  expect(ds).toBeInstanceOf(Dataset);
  assertType<Record<string, unknown>>(ds.attributes);
  assertType<Record<string, IDataVar>>(ds.variables);

  // Test that all properties were correctly extracted
  expect(Object.keys(ds.variables)).toContain("temperature");
  expect(Object.keys(ds.variables)).toContain("elevation");
  expect(Object.keys(ds.variables)).toContain("name");
  expect(Object.keys(ds.variables)).toContain("active");

  // Test property values
  const names = await ds.variables.name.get();
  expect(names).toBeInstanceOf(Array);
  expect(names).toHaveLength(2);
  expect(names[0]).toBe("Location A");
  expect(names[1]).toBe("Path B");

  const active = await ds.variables.active.get();
  expect(active).toBeInstanceOf(Array);
  expect(active).toHaveLength(2);
  expect(active[0]).toBe(true);
  expect(active[1]).toBe(false);

  const temp = await ds.variables.temperature.get();
  expect(temp).toBeInstanceOf(Float32Array);
  expect(temp).toHaveLength(2);
  expect(temp[0]).toBe(15.5);
  expect(temp[1]).toBe(16.5);

  // Test with custom coordmap
  const customCoordmap = { t: "time", g: "geometry" };
  const dsWithCoordmap = await Dataset.fromGeojson(
    validGeoJson,
    customCoordmap
  );
  expect(dsWithCoordmap.coordmap).toEqual(customCoordmap);
});
