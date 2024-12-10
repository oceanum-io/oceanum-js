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