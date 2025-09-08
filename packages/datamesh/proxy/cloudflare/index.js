//Example cloudfalre worker reverse proxy
//Add your datamesh token as a secret in the cloudflare worker environment

const DATAMESH = "https://datamesh-v1.oceanum.io";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const DATAMESH_TOKEN = env.DATAMESH_TOKEN;

    // Extract the path and construct the datamesh API URL
    const datameshUrl = new URL(url.pathname + url.search, DATAMESH);

    // Clone the request to modify headers
    const modifiedRequest = new Request(datameshUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Inject the DATAMESH_TOKEN header
    modifiedRequest.headers.set("x-DATAMESH-TOKEN", `${DATAMESH_TOKEN}`);

    // Forward the request to datamesh
    const response = await fetch(modifiedRequest);

    // Return the response with CORS headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });

    return modifiedResponse;
  },
};
