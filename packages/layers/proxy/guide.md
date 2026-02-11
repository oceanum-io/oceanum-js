---
title: Proxy Guide
group: Documents
category: Guides
---

# Using a Proxy with @oceanum/layers

A reverse proxy lets you serve Oceanum zarr layers from a public web app without exposing your Datamesh token in client-side code and helps you avoid CORS issues.

This repo includes example proxies you can deploy quickly, and shows how to point the layers to them.

- Cloudflare Worker: `packages/layers/proxy/cloudflare/index.js`
- Node/Express: `packages/layers/proxy/express/index.js`
- Client package: `@oceanum/layers`

## Why use a proxy?

- Protect secrets: keep your Datamesh token server-side.
- Simpler CORS: proxy can add permissive CORS headers.
- Stable domain: front your app with your own domain.

## How layers authenticate

All `@oceanum/layers` layers accept an `authHeaders` prop — a plain object of HTTP headers that are sent with every zarr chunk and metadata request. Without a proxy, you'd pass your token directly:

```ts
new OceanumPcolorLayer({
  authHeaders: { Authorization: `Bearer ${token}` },
  // ...
});
```

With a proxy, the token lives server-side and the client needs no `authHeaders` at all.

## Cloudflare Worker proxy (example)

The example Cloudflare Worker:

- Forwards all requests to the zarr service.
- Injects the `Authorization` header using a Worker Secret.
- Adds permissive CORS headers for browser apps.

```js
// Example Cloudflare Worker reverse proxy for @oceanum/layers
// Add your datamesh token as a secret in the Cloudflare worker environment

const LAYERS_SERVICE = "https://layers.app.oceanum.io";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const TOKEN = env.DATAMESH_TOKEN;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Build the upstream request URL
    const upstreamUrl = new URL(url.pathname + url.search, LAYERS_SERVICE);

    // Clone request and forward headers/method
    const modifiedRequest = new Request(upstreamUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });

    // Inject/overwrite the authorization header
    modifiedRequest.headers.set("Authorization", `Bearer ${TOKEN}`);

    // Forward
    const response = await fetch(modifiedRequest);

    // Add CORS headers for the browser
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  },
};
```

### Deploy on Cloudflare

1. Create a new Worker in the Cloudflare dashboard.
2. Paste the contents of `packages/layers/proxy/cloudflare/index.js`.
3. Add a Worker Secret named `DATAMESH_TOKEN` and set it to your Datamesh token.
4. (Optional) Change `LAYERS_SERVICE` to point at a different upstream if needed.
5. Deploy, and note your Worker URL, e.g. `https://your-proxy.workers.dev`.

### Local testing tips

- You can test the Worker locally with `wrangler dev`.
- If you front the Worker with your own domain, ensure HTTPS is enabled and the domain is added to your app's allowed origins if you use restrictive CORS elsewhere.

## Node/Express proxy (example)

You can also run a simple Node/Express reverse proxy locally or deploy it to your own infrastructure.

- Example: `packages/layers/proxy/express/index.js`

### Run locally

1. Install dependencies in the example folder:

   ```sh
   cd packages/layers/proxy/express
   npm init -y
   npm install express
   ```

2. Start the proxy:

   ```sh
   DATAMESH_TOKEN=your_token_here node index.js
   # Optional:
   # LAYERS_SERVICE=https://layers.app.oceanum.io PORT=8787 DATAMESH_TOKEN=your_token_here node index.js
   ```

The proxy will listen on `http://localhost:8787` by default and forward all requests to `LAYERS_SERVICE`, injecting the `Authorization` header and adding permissive CORS headers.

## Configure @oceanum/layers to use the proxy

Point `serviceUrl` to your proxy origin and omit `authHeaders` — the proxy injects the token.

```ts
import { OceanumPcolorLayer } from "@oceanum/layers";

const PROXY_URL = "https://your-proxy.workers.dev"; // or your custom domain

new OceanumPcolorLayer({
  id: "wave-height",
  serviceUrl: PROXY_URL,
  // No authHeaders needed — the proxy injects the token
  datasource: "oceanum_wave_glob05",
  variable: "hs",
  time: "2024-01-15T00:00:00Z",
  colormap: {
    scale: [
      "#313695", "#4575b4", "#74add1", "#abd9e9",
      "#fee090", "#fdae61", "#f46d43", "#d73027",
    ],
    domain: [0, 1, 2, 3, 4, 5, 6, 8],
  },
});
```

Notes:

- `authHeaders` defaults to `{}` when omitted — the proxy takes care of authentication.
- All zarr chunk requests go through your proxy, so make sure it forwards the full path (e.g. `/zarr/oceanum_wave_glob05/latest/.zmetadata`).

## Security considerations

- Never commit your Datamesh token. Store it as a Worker Secret (or equivalent secret store) in your hosting platform.
- Consider limiting origins or tightening CORS in production if your app does not need broad access.
- The examples overwrite the `Authorization` header to prevent client-supplied values from reaching the upstream.
- Zarr requests are read-only `GET` requests, so you can safely restrict the proxy to `GET` and `OPTIONS` methods only.
