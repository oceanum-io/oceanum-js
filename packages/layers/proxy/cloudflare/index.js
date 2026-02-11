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
