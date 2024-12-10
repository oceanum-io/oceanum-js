**@oceanum/datamesh** • **Docs**

***

# @oceanum/datamesh

A typescript library for interacting with the Oceanum.io Datamesh.

## Installation

You can use this library in Node.js, Deno or browser code

```sh
npm install @oceanum/datamesh
```

## Usage

```javascript
import { Connector } from "@oceanum/datamesh";

//Instatiate the Datamesh Connector
const datamesh=Connector("my_datamesh_token"); //Get your datamesh token from your Oceanum.io account

//Define a datamesh query
const query={
    "datasource":"oceanum-sizing_giants"
}

//Get the data
const data=await datamesh.query(query);
```

DO NOT put your Datamesh token directly into browser code. For use in an SPA, you can either forward your Datamesh request through a proxy or implement a token exchange. Read the [library documentation](https://oceanum-js.oceanum.io/) to learn more.

## Enumerations

- [AggregateOps](enumerations/AggregateOps.md)
- [Coordinate](enumerations/Coordinate.md)
- [GeoFilterInterp](enumerations/GeoFilterInterp.md)
- [GeoFilterType](enumerations/GeoFilterType.md)
- [LevelFilterInterp](enumerations/LevelFilterInterp.md)
- [LevelFilterType](enumerations/LevelFilterType.md)
- [ResampleType](enumerations/ResampleType.md)
- [TimeFilterType](enumerations/TimeFilterType.md)

## Classes

- [Connector](classes/Connector.md)
- [Dataset](classes/Dataset.md)
- [DataVar](classes/DataVar.md)
- [Query](classes/Query.md)

## Interfaces

- [IQuery](interfaces/IQuery.md)

## Type Aliases

- [Aggregate](type-aliases/Aggregate.md)
- [ATypedArray](type-aliases/ATypedArray.md)
- [Coordinates](type-aliases/Coordinates.md)
- [CoordSelector](type-aliases/CoordSelector.md)
- [Data](type-aliases/Data.md)
- [Datasource](type-aliases/Datasource.md)
- [DataVariable](type-aliases/DataVariable.md)
- [GeoFilter](type-aliases/GeoFilter.md)
- [LevelFilter](type-aliases/LevelFilter.md)
- [NDArray](type-aliases/NDArray.md)
- [Scalar](type-aliases/Scalar.md)
- [Schema](type-aliases/Schema.md)
- [TimeFilter](type-aliases/TimeFilter.md)
