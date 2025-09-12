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
DO NOT put your Datamesh token directly into browser code. For use in an SPA, you should forward your Datamesh request through a reverse proxy to conceal your token.

## Using a Datamesh Proxy

If you are building a browser application, we recommend using a reverse proxy to keep your Datamesh token secret and to simplify CORS. This package includes an example Cloudflare Worker you can deploy quickly and configure the `Connector` to use.

- See the [proxy guide](./proxy/guide.md) for more information.

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
