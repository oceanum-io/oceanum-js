**@oceanum/datamesh**

***

# @oceanum/datamesh

A typescript library for interacting with the Oceanum.io Datamesh.

## Installation

You can use this library in Node.js, Deno or browser code (with the caveat below)

```sh
npm install @oceanum/datamesh
```

## Usage

```javascript
import { Connector } from "@oceanum/datamesh";

//Instatiate the Datamesh Connector
const datamesh = Connector("my_datamesh_token"); //Get your datamesh token from your Oceanum.io account

//Define a datamesh query
const query = {
  datasource: "oceanum-sizing_giants",
};

//Get the data
const data = await datamesh.query(query);
```

[!WARNING]
DO NOT put your Datamesh token directly into browser code. For use in an SPA, you should forward your Datamesh request through a reverse proxy to conceal your token. Read the [library documentation](https://oceanum-js.oceanum.io/datamesh) to learn more.

## Using a Datamesh Proxy

If you are building a browser application, we recommend using a reverse proxy to keep your Datamesh token secret and to simplify CORS. This package includes an example Cloudflare Worker you can deploy quickly and configure the `Connector` to use.

- See: [`docs/proxy.md`](./docs/proxy.md)

Quick setup:

```ts
import { Connector } from "@oceanum/datamesh";

const PROXY_URL = "https://your-proxy.workers.dev"; // or your own domain

const datamesh = new Connector("proxy", {
  service: PROXY_URL,
  gateway: PROXY_URL,
});
```

Deploy the example Worker at `proxy/cloudflare/index.js` and add a secret `DATAMESH_TOKEN` with your Datamesh token in the Worker settings.

## Classes

- [Connector](classes/Connector.md)
- [Dataset](classes/Dataset.md)
- [DataVar](classes/DataVar.md)
- [Query](classes/Query.md)

## Interfaces

- [GeoFilterFeature](interfaces/GeoFilterFeature.md)
- [IQuery](interfaces/IQuery.md)
- [ZarrOptions](interfaces/ZarrOptions.md)

## Type Aliases

- [Aggregate](type-aliases/Aggregate.md)
- [AggregateOps](type-aliases/AggregateOps.md)
- [ATypedArray](type-aliases/ATypedArray.md)
- [Container](type-aliases/Container.md)
- [Coordinate](type-aliases/Coordinate.md)
- [Coordkeys](type-aliases/Coordkeys.md)
- [CoordSelector](type-aliases/CoordSelector.md)
- [Data](type-aliases/Data.md)
- [DatameshSchema](type-aliases/DatameshSchema.md)
- [Datasource](type-aliases/Datasource.md)
- [DataVariable](type-aliases/DataVariable.md)
- [GeoFilter](type-aliases/GeoFilter.md)
- [GeoFilterInterp](type-aliases/GeoFilterInterp.md)
- [GeoFilterType](type-aliases/GeoFilterType.md)
- [LevelFilter](type-aliases/LevelFilter.md)
- [LevelFilterInterp](type-aliases/LevelFilterInterp.md)
- [LevelFilterType](type-aliases/LevelFilterType.md)
- [NDArray](type-aliases/NDArray.md)
- [ResampleType](type-aliases/ResampleType.md)
- [Scalar](type-aliases/Scalar.md)
- [Schema](type-aliases/Schema.md)
- [TimeFilter](type-aliases/TimeFilter.md)
- [TimeFilterType](type-aliases/TimeFilterType.md)

## Functions

- [wkb\_to\_geojson](functions/wkb_to_geojson.md)
