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
const datamesh=Connector("my_datamesh_token"); //Get your datamesh token from your Oceanum.io account

//Define a datamesh query
const query={
    "datasource":"oceanum-sizing_giants"
}

//Get the data
const data=await datamesh.query(query);
```

[!WARNING]
DO NOT put your Datamesh token directly into browser code. For use in an SPA, you should forward your Datamesh request through a reverse proxy to conceal your token. Read the [library documentation](https://oceanum-js.oceanum.io/datamesh/reverse_proxy) to learn more.