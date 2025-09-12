/*
 Example Node Express reverse proxy for Oceanum Datamesh

 Requirements
 - Node.js v18+ (for native fetch and web streams)
 - Environment variable DATAMESH_TOKEN set to your Datamesh token
 - Optional: DATAMESH_URL (defaults to https://datamesh.oceanum.io)
 - Optional: PORT (defaults to 8787)

 Usage
   DATAMESH_TOKEN=xxxx npm start
   # or
   DATAMESH_TOKEN=xxxx node index.js
*/

const express = require("express");

const app = express();
const PORT = process.env.PORT || 8787;
const TARGET = process.env.DATAMESH_URL || "https://datamesh.oceanum.io";

if (!process.env.DATAMESH_TOKEN) {
  console.warn(
    "Warning: DATAMESH_TOKEN is not set. Requests to Datamesh will fail with 401/403."
  );
}

// Basic CORS support (adjust for production as needed)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-requested-with, x-datamesh-token"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Proxy all routes to Datamesh, injecting the token
app.use(async (req, res) => {
  try {
    const upstreamUrl = new URL(req.originalUrl, TARGET);

    // Rebuild headers to a fresh Headers instance
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(", "));
    }

    // Ensure correct Host and token header (overwrite any client-supplied values)
    headers.delete("host");
    headers.set("x-DATAMESH-TOKEN", process.env.DATAMESH_TOKEN || "");

    // Prepare request init
    const method = req.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);
    const init = {
      method,
      headers,
      body: hasBody ? req : undefined, // Stream the incoming request body
    };

    const response = await fetch(upstreamUrl, init);

    // Forward headers from upstream
    response.headers.forEach((value, key) => {
      // Skip hop-by-hop or problematic headers if necessary
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });

    // We already added CORS above; ensure it's present in case upstream overrides
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-requested-with"
    );

    // Status
    res.status(response.status);

    // Stream body
    if (response.body) {
      response.body
        .pipeTo(
          new WritableStream({
            write(chunk) {
              res.write(Buffer.from(chunk));
            },
            close() {
              res.end();
            },
            abort(err) {
              console.error("Proxy stream aborted:", err);
              res.end();
            },
          })
        )
        .catch((err) => {
          console.error("Proxy piping error:", err);
          res.end();
        });
    } else {
      res.end();
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ detail: "Proxy error", error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Datamesh proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding to ${TARGET}`);
});
