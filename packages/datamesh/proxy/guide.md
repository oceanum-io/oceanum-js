---
title: Proxy Guide
group: Documents
category: Guides
---

# Using a Datamesh Proxy with @oceanum/datamesh

A reverse proxy lets you call Datamesh from a public web app without exposing your Datamesh token and helps you avoid CORS issues.

This repo includes example proxies you can deploy quickly, and shows how to point the `Connector` to them.

- Cloudflare Worker: `packages/datamesh/proxy/cloudflare/index.js`
- Node/Express: `packages/datamesh/proxy/express/index.js`
- Client package: `@oceanum/datamesh`

## Why use a proxy?

- Protect secrets: keep your Datamesh token server-side.
- Simpler CORS: proxy can add permissive CORS headers.
- Stable domain: front your app with your own domain.

## Cloudflare Worker proxy (example)

The example Cloudflare Worker:

- Forwards all requests to the Datamesh API.
- Overwrites the `x-DATAMESH-TOKEN` header using a Worker Secret.
- Adds permissive CORS headers for browser apps.

```js
// Example Cloudflare Worker reverse proxy
// Add your datamesh token as a secret in the Cloudflare worker environment

const DATAMESH = "https://datamesh.oceanum.io";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const DATAMESH_TOKEN = env.DATAMESH_TOKEN;

    // Build the upstream request URL
    const datameshUrl = new URL(url.pathname + url.search, DATAMESH);

    // Clone request and forward body/headers/method
    const modifiedRequest = new Request(datameshUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Inject/overwrite the token
    modifiedRequest.headers.set("x-DATAMESH-TOKEN", `${DATAMESH_TOKEN}`);

    // Forward
    const response = await fetch(modifiedRequest);

    // Add CORS headers for the browser
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  },
};
```

### Deploy on Cloudflare

1. Create a new Worker in the Cloudflare dashboard.
2. Paste the contents of `packages/datamesh/proxy/cloudflare/index.js`.
3. Add a Worker Secret named `DATAMESH_TOKEN` and set it to your Datamesh token.
4. (Optional) Change `DATAMESH` to point at a different upstream if needed.
5. Deploy, and note your Worker URL, e.g. `https://your-proxy.workers.dev`.

## Node/Express proxy (example)

You can also run a simple Node/Express reverse proxy locally or deploy it to your own infrastructure.

- Example: `packages/datamesh/proxy/express/index.js`

### Run locally

1. Install dependencies in the example folder:

   ```sh
   cd packages/datamesh/proxy/express
   npm init -y
   npm install express
   ```

2. Start the proxy:

   ```sh
   DATAMESH_TOKEN=your_token_here node index.js
   # Optional:
   # DATAMESH_URL=https://datamesh.oceanum.io PORT=8787 DATAMESH_TOKEN=your_token_here node index.js
   ```

The proxy will listen on `http://localhost:8787` by default and forward all requests to `DATAMESH_URL`, injecting `x-DATAMESH-TOKEN` and adding permissive CORS headers.

## Configure @oceanum/datamesh to use the proxy

Point both `service` and `gateway` to your proxy origin. The proxy injects the token, so you can pass any non-empty string for the required `token` parameter.

```ts
import { Connector } from "@oceanum/datamesh";

const PROXY_URL = "https://your-proxy.workers.dev"; // or your custom domain

const connector = new Connector("proxy", {
  service: PROXY_URL,
  gateway: PROXY_URL,
  // Optional: tweak caching and session duration as needed
  // nocache: true,
  // sessionDuration: 1,
});
```

Notes:

- The constructor requires a `token`. When using the proxy, the token you pass here is ignored by the upstream because the proxy overwrites the `x-DATAMESH-TOKEN` header with the secret.
- The connector will probe `GET /session` on the `gateway` to detect the API version. Ensure your proxy forwards that path.

## Local testing tips

- You can test the Worker locally with `wrangler dev`.
- If you front the Worker with your own domain, ensure HTTPS is enabled and the domain is added to your app’s allowed origins if you use restrictive CORS elsewhere.

## Security considerations

- Never commit your Datamesh token. Store it as a Worker Secret (or equivalent secret store) in your hosting platform.
- Consider limiting origins or tightening CORS in production if your app does not need broad access.
- Audit which headers you forward. The example purposely overwrites `x-DATAMESH-TOKEN` to prevent client-supplied values from leaking upstream.
