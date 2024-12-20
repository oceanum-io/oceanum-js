import { test, expect } from "vitest";
import { Connector } from "../lib/connector";
import { datameshTest } from "./fixtures";

datameshTest(
  "dataframe",
  async ({ dataframe }) => {
    // Test with the connector
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const df = await datamesh.loadDatasource("oceanum-js-test-df");
    const data = await df.asDataframe();

    // Test data structure
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBe(3);

    // Test data content
    expect(data[0]).toMatchObject(dataframe.data[0]);

    // Test spatial progression

    // Test time series
    const times = data.map((row) => row.time);
    expect(times).toEqual(dataframe.data.map((row) => row.time));

    // Test numeric values
    const temperatures = data.map((row) => row.temperature);
    expect(temperatures).toEqual(dataframe.data.map((row) => row.temperature));
  },
  { timeout: 100000 }
);

datameshTest(
  "geodataframe",
  async ({ geodataframe }) => {
    // Test with the connector
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const gdf = await datamesh.loadDatasource("oceanum-js-test-gdf");
    const data = await gdf.asGeojson();

    // Test GeoJSON structure
    expect(data.type).toBe("FeatureCollection");
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features.length).toBe(3);

    // Test first feature structure
    const feature = data.features[0];
    expect(feature.type).toBe("Feature");
    expect(feature.geometry.type).toBe("Point");
    expect(Array.isArray(feature.geometry.coordinates)).toBe(true);
    expect(feature.properties).toBeDefined();

    // Test spatial progression
    const coordinates = data.features.map((f) => f.geometry.coordinates[0]);
    expect(coordinates).toEqual([174.0, 174.1, 174.2]);

    // Test time series
    const times = data.features.map((f) => f.properties.time);
    expect(times).toEqual([
      "1970-01-01T00:00:00.000Z",
      "1970-01-02T00:00:00.000Z",
      "1970-01-03T00:00:00.000Z",
    ]);

    // Test numeric values
    const temperatures = data.features.map((f) => f.properties.temperature);
    expect(temperatures).toEqual([15.5, 15.8, 15.3]);
  },
  { timeout: 100000 }
);

datameshTest(
  "dataframe with geometry",
  async ({ dataframe }) => {
    // Test with the connector
    const datamesh = new Connector(process.env.DATAMESH_TOKEN);
    const df = await datamesh.loadDatasource("oceanum-js-test-df");
    const data = await df.asGeojson({
      type: "Point",
      coordinates: [174.0, -41.0],
    });

    // Test GeoJSON structure
    expect(data.type).toBe("FeatureCollection");
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features.length).toBe(3);

    // Test first feature structure with passed geometry
    const feature = data.features[0];
    expect(feature.type).toBe("Feature");
    expect(feature.geometry.type).toBe("Point");
    expect(feature.geometry.coordinates).toEqual([174.0, -41.0]);
    expect(feature.properties).toBeDefined();

    // Test properties from dataframe
    expect(feature.properties.temperature).toBeDefined();
    expect(feature.properties.time).toBeDefined();

    // Test time series
    const times = data.features.map((f) => f.properties.time);
    expect(times).toEqual(dataframe.data.map((row) => row.time));

    // Test numeric values
    const temperatures = data.features.map((f) => f.properties.temperature);
    expect(temperatures).toEqual(dataframe.data.map((row) => row.temperature));
  },
  { timeout: 100000 }
);
