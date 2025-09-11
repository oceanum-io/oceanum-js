# @oceanum/datamesh

## Overview

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

### Using Sessions

Sessions provide a way to manage authentication and resource allocation for datamesh operations:

```javascript
import { Connector } from "@oceanum/datamesh";

//Instantiate the Datamesh Connector with session support
const datamesh = new Connector(process.env.DATAMESH_TOKEN, {
  sessionDuration: 2 // Session will last for 2 hours
});

//Create a session
const session = await datamesh.createSession();

try {
  //Define a datamesh query
  const query = {
    datasource: "oceanum-sizing_giants",
  };

  //Get the data (session headers are automatically included)
  const data = await datamesh.query(query);
  
  //Close the session when done
  await datamesh.closeSession();
} catch (error) {
  console.error("Error:", error);
  //Make sure to close the session even if there's an error
  await datamesh.closeSession();
}
```

See the [Sessions Guide](guides/sessions.md) for more detailed information on using sessions.

### Warning

DO NOT put your Datamesh token directly into browser code. For use in an SPA, you should forward your Datamesh request through a reverse proxy to conceal your token. See the [Using a Proxy](guides/proxy.md) guide. Read the [library documentation](https://oceanum-js.oceanum.io/datamesh) to learn more.

## Classes

- [Connector](classes/Connector.md)
- [Dataset](classes/Dataset.md)
- [DataVar](classes/DataVar.md)
- [Query](classes/Query.md)
- [Session](classes/Session.md)

## Interfaces

- [GeoFilterFeature](interfaces/GeoFilterFeature.md)
- [IQuery](interfaces/IQuery.md)
- [ZarrOptions](interfaces/ZarrOptions.md)

## Guides

- [Using Sessions](guides/sessions.md)
- [Using a Proxy](guides/proxy.md)

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
