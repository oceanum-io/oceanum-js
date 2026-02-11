/*
 Example Node Express reverse proxy for @oceanum/layers

 Requirements
 - Node.js v18+ (for native fetch and web streams)
 - Environment variable DATAMESH_TOKEN set to your Datamesh token
 - Optional: LAYERS_SERVICE (defaults to https://layers.app.oceanum.io)
 - Optional: PORT (defaults to 8787)

 Usage
   DATAMESH_TOKEN=xxxx npm start
   # or
   DATAMESH_TOKEN=xxxx node index.js
*/

const express = require("express");

const app = express();
const PORT = process.env.PORT || 8787;
const TARGET = process.env.LAYERS_SERVICE || "https://layers.app.oceanum.io";

if (!process.env.DATAMESH_TOKEN) {
  console.warn(
    "Warning: DATAMESH_TOKEN is not set. Requests to the zarr service will fail with 401/403."
  );
}

// Basic CORS support (adjust for production as needed)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Proxy all routes to the zarr service, injecting the token
app.use(async (req, res) => {
  try {
    const upstreamUrl = new URL(req.originalUrl, TARGET);

    // Rebuild headers to a fresh Headers instance
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(", "));
    }

    // Ensure correct Host and auth header (overwrite any client-supplied values)
    headers.delete("host");
    headers.set("Authorization", `Bearer ${process.env.DATAMESH_TOKEN || ""}`);

    const response = await fetch(upstreamUrl, {
      method: req.method,
      headers,
    });

    // Forward headers from upstream
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });

    // Ensure CORS headers are present
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
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
  console.log(`Layers proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding to ${TARGET}`);
});
