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

## Datasource notices

Oceanum.io publishes notices about datasources, such as deprecations, changes and outages. Get the current notices about a datasource with `getNotices`:

```ts
const notices = await datamesh.getNotices("oceanum-sizing_giants");
for (const notice of notices) {
  console.log(notice.severity, notice.title); // notice.body is markdown
}
```

Notices are fetched from the Oceanum.io admin service with the connector's own credential, and only for datasources that credential can read. The admin service is derived from the Datamesh service (`https://datamesh.oceanum.io` uses `https://admin.oceanum.io`); for any other service (a proxy, for example) set it with the `adminService` connector option, or no notices are fetched. `getNotices` never throws: on any failure, or after 3 seconds, it resolves to an empty list. Results are cached per datasource for 10 minutes (a failed request for 30 seconds).

By default, when you query or load a datasource, the connector also checks its notices in the background and logs a `console.warn` for each `action_required` or `outage` notice, once per notice. This never delays or fails the query. It means the first query of each datasource sends the connector's credential (your Datamesh token or JWT) to the admin service, which forwards it to Datamesh to check that you can read the datasource; the credential is not sent anywhere else (redirects are refused). To turn the check off:

```ts
const datamesh = new Connector("my_datamesh_token", { notices: false });
```

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
