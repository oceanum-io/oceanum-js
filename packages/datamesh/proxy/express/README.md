# Node Express Proxy (Example)

Example reverse proxy for Oceanum Datamesh using Node.js + Express.

## Prerequisites

- Node.js v18+ (native `fetch` and web streams)
- Environment variable `DATAMESH_TOKEN` set to your Datamesh token
- Optional: `DATAMESH_URL` (defaults to `https://datamesh.oceanum.io`)
- Optional: `PORT` (defaults to `8787`)

## Install and run

Create a small project in this directory and install Express:

```sh
npm init -y
npm install express
```

Run the proxy:

```sh
DATAMESH_TOKEN=your_token_here node index.js
# or with a custom upstream and port
DATAMESH_TOKEN=your_token_here DATAMESH_URL=https://datamesh.oceanum.io PORT=8080 node index.js
```

## What it does

- Forwards all incoming requests to `DATAMESH_URL`.
- Injects/overwrites the `x-DATAMESH-TOKEN` header with your secret token.
- Adds permissive CORS headers for browser apps.

## Use with @oceanum/datamesh

Point both `service` and `gateway` to your proxy origin:

```ts
import { Connector } from "@oceanum/datamesh";

const PROXY_URL = "http://localhost:8787"; // or your deployed proxy

const connector = new Connector("proxy", {
  service: PROXY_URL,
  gateway: PROXY_URL,
});
```

## Security notes

- Never commit your real token. Use env vars or a secret store.
- Consider tightening CORS and limiting allowed origins in production.
- This is an example; adapt logging/error handling and header allowlists to your needs.
