/**
 * Example application demonstrating @oceanum/layers.
 *
 * Prerequisites:
 *   - A running zarr service with accessible Oceanum datasources
 *   - A valid auth token (if required)
 *
 * To run:
 *   npm run example
 */

import React, { useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { Map } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  OceanumPcolorLayer,
  OceanumParticleLayer,
  OceanumPartmeshLayer,
  OceanumContourLayer,
} from "@oceanum/layers";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE =
  import.meta.env.VITE_MAPBOX_STYLE || "mapbox://styles/mapbox/dark-v11";

// Replace with your zarr service URL and auth token
const SERVICE_URL = "https://layers.apps.oceanum.io";
const AUTH_HEADERS = {
  "X-DATAMESH-TOKEN": import.meta.env.VITE_DATAMESH_TOKEN,
};
const INITIAL_VIEW_STATE = {
  longitude: 124,
  latitude: -20,
  zoom: 5,
  pitch: 0,
  bearing: 0,
};

function App() {
  const [time, setTime] = useState(null);
  const [level, setLevel] = useState(0);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [nlevels, setNlevels] = useState(0);
  const [activeLayer, setActiveLayer] = useState("pcolor");

  const handleDataLoad = useCallback(({ times, nlevels, instance }) => {
    setAvailableTimes((prev) => {
      if (prev.length === 0 && times.length > 0) {
        setTime(times[0].toISOString());
      }
      return times;
    });
    setNlevels(nlevels);
    console.log(
      `Loaded instance: ${instance}, ${times.length} time steps, ${nlevels} levels`,
    );
  }, []);

  const errorHooks = {
    onMetadataError: (err) => console.error("Metadata error:", err.message),
    onChunkError: (err) => console.warn("Chunk error:", err.message),
    onVariableError: (err) =>
      console.error(
        "Variable error:",
        err.message,
        "Available:",
        err.availableVariables,
      ),
    onValidationError: (err) => console.error("Validation error:", err.message),
  };

  if (!SERVICE_URL) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2>deck-gl-datamesh-layers Example</h2>
        <p>
          To run this example, edit <code>examples/layers/app.jsx</code> and set
          the <code>SERVICE_URL</code> to your layer service endpoint.
        </p>
        <pre>{`const SERVICE_URL = 'https://layers.apps.oceanum.io';
const AUTH_HEADERS = { X-DATAMESH-TOKEN: 'YOUR_TOKEN' };`}</pre>
      </div>
    );
  }

  const COLORMAP = {
    scale: [
      "#6271b7",
      "#39619f",
      "#4a94a9",
      "#4d8d7b",
      "#53a553",
      "#359f35",
      "#a79d51",
      "#9f7f3a",
      "#a16c5c",
      "#813a4e",
      "#af5088",
      "#754a93",
      "#6d61a3",
      "#44698d",
      "#5c9098",
      "#7d44a5",
      "#e7d7d7",
      "#dbd487",
      "#cdca70",
      "#808080",
    ],
    domain: [
      0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 24, 27, 29, 36, 46, 51, 77, 104,
    ],
  };

  const layers = [];

  if (activeLayer === "pcolor") {
    layers.push(
      new OceanumPcolorLayer({
        id: "wave-height",
        serviceUrl: SERVICE_URL,
        authHeaders: AUTH_HEADERS,
        layerId: "ecmwf_wind10m_0p25",
        xvector: "u10",
        yvector: "v10",
        time,
        level,
        colormap: COLORMAP,
        opacity: 0.8,
        scale: 1.92,
        pickable: true,
        onDataLoad: handleDataLoad,
        errorHandlers: errorHooks,
      }),
    );
  }

  if (activeLayer === "particle") {
    layers.push(
      new OceanumParticleLayer({
        id: "wind",
        serviceUrl: SERVICE_URL,
        authHeaders: AUTH_HEADERS,
        layerId: "ecmwf_wind10m_0p25",
        xvector: "u10",
        yvector: "v10",
        time,
        npart: 5000,
        speed: 2.0,
        colormap: COLORMAP,
        onDataLoad: handleDataLoad,
        errorHandlers: errorHooks,
      }),
    );
  }

  if (activeLayer === "partmesh") {
    layers.push(
      new OceanumPartmeshLayer({
        id: "wind-mesh",
        serviceUrl: SERVICE_URL,
        authHeaders: AUTH_HEADERS,
        layerId: "ecmwf_wind10m_0p25",
        xvector: "u10",
        yvector: "v10",
        time,
        speed: 2.0,
        colormap: COLORMAP,
        onDataLoad: handleDataLoad,
        errorHandlers: errorHooks,
        meshShape: "arrow",
      }),
    );
  }

  if (activeLayer === "contour") {
    layers.push(
      new OceanumContourLayer({
        id: "pressure",
        serviceUrl: SERVICE_URL,
        authHeaders: AUTH_HEADERS,
        layerId: "ecmwf_wind10m_0p25",
        xvector: "u10",
        yvector: "v10",
        time,
        levels: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21],
        colormap: COLORMAP,
        onDataLoad: handleDataLoad,
        errorHandlers: errorHooks,
      }),
    );
  }

  const timeIndex = availableTimes.findIndex(
    (t) => t.toISOString() === new Date(time).toISOString(),
  );

  return (
    <>
      <div className="controls">
        <label>
          Layer:
          <select
            value={activeLayer}
            onChange={(e) => setActiveLayer(e.target.value)}
          >
            <option value="pcolor">Pcolor (scalar)</option>
            <option value="particle">Particle (vector)</option>
            <option value="partmesh">Particle Mesh (vector)</option>
            <option value="contour">Contour (scalar)</option>
          </select>
        </label>

        {availableTimes.length > 0 && (
          <label>
            Time: {new Date(time).toISOString().slice(0, 16)}
            <br />
            <input
              type="range"
              min={0}
              max={availableTimes.length - 1}
              value={Math.max(0, timeIndex)}
              onChange={(e) =>
                setTime(availableTimes[e.target.value].toISOString())
              }
            />
          </label>
        )}

        {nlevels > 1 && (
          <label>
            Level: {level}
            <br />
            <input
              type="range"
              min={0}
              max={nlevels - 1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </label>
        )}
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        views={new MapView({ repeat: true })}
      >
        {MAPBOX_TOKEN && (
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle={MAPBOX_STYLE}
            reuseMaps
          />
        )}
      </DeckGL>
    </>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
