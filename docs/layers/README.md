**@oceanum/layers**

---

# @oceanum/layers

deck.gl layers for visualising gridded data from [Oceanum Datamesh](https://oceanum.io/datamesh-environmental-data-platform/) zarr datasets.

This library wraps [@oceanum/deck-gl-grid](https://github.com/oceanum/deck-gl-grid) layers with automatic data fetching from pre-cached zarr archives on the Datamesh. It handles time/level dimension selection, viewport-based spatial chunk loading, and debounced fetching — all through a simple props-based API.

## Installation

```bash
npm install @oceanum/layers
```

### Peer dependencies

```bash
npm install @deck.gl/core @deck.gl/layers @luma.gl/core
```

## Quick Start

```jsx
import { OceanumPcolorLayer } from "@oceanum/layers";
import DeckGL from "@deck.gl/react";

function App() {
  const [time, setTime] = useState("2024-01-15T00:00:00Z");

  const layers = [
    new OceanumPcolorLayer({
      id: "wave-height",
      authHeaders: { Authorization: `Bearer ${token}` },
      datasource: "oceanum_wave_glob05",
      variable: "hs",
      time,
      colormap: {
        scale: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
        ],
        domain: [0, 1, 2, 3, 4, 5, 6, 8],
      },
      opacity: 0.8,
    }),
  ];

  return <DeckGL layers={layers} />;
}
```

## Layers

### OceanumPcolorLayer

Renders a scalar variable as coloured grid cells.

```javascript
new OceanumPcolorLayer({
  id: 'sst',
  serviceUrl: 'https://zarr.datamesh.oceanum.io',
  datasource: 'my_dataset',
  variable: 'temperature',
  time: '2024-01-15T00:00:00Z',
  colormap: { scale: [...], domain: [...] },
});
```

| Prop       | Type              | Default         | Description                              |
| ---------- | ----------------- | --------------- | ---------------------------------------- |
| `variable` | `string`          | _required_      | Scalar variable name in the zarr dataset |
| `color`    | `[r,g,b]`         | `[200,200,200]` | Fallback colour when no colormap         |
| `material` | `boolean\|object` | `false`         | Phong material for lighting              |

### OceanumParticleLayer

Renders animated particles flowing through a vector field.

```javascript
new OceanumParticleLayer({
  id: "wind",
  serviceUrl: "https://zarr.datamesh.oceanum.io",
  datasource: "era5_wind",
  uVariable: "u10",
  vVariable: "v10",
  time: "2024-01-15T00:00:00Z",
  npart: 5000,
  speed: 2.0,
});
```

| Prop                  | Type     | Default           | Description                                                  |
| --------------------- | -------- | ----------------- | ------------------------------------------------------------ |
| `uVariable`           | `string` | —                 | U (eastward) component variable                              |
| `vVariable`           | `string` | —                 | V (northward) component variable                             |
| `magnitudeVariable`   | `string` | —                 | Magnitude variable (alternative to u/v)                      |
| `directionVariable`   | `string` | —                 | Direction variable (alternative to u/v)                      |
| `speed`               | `number` | `1.0`             | Animation speed multiplier                                   |
| `npart`               | `number` | `1000`            | Number of particles                                          |
| `size`                | `number` | `3`               | Particle size in pixels                                      |
| `length`              | `number` | `12`              | Particle trail length                                        |
| `directionConvention` | `string` | `'NAUTICAL_FROM'` | `'NAUTICAL_FROM'`, `'NAUTICAL_TO'`, or `'CARTESIAN_RADIANS'` |

Provide either (`uVariable` + `vVariable`) **or** (`magnitudeVariable` + `directionVariable`).

### OceanumPartmeshLayer

Renders mesh-based arrows for a vector field. Same variable props as ParticleLayer.

```javascript
new OceanumPartmeshLayer({
  id: "currents",
  serviceUrl: "https://zarr.datamesh.oceanum.io",
  datasource: "ocean_currents",
  uVariable: "uo",
  vVariable: "vo",
  time: "2024-01-15T00:00:00Z",
});
```

| Prop                                      | Type     | Default           | Description                |
| ----------------------------------------- | -------- | ----------------- | -------------------------- |
| `uVariable` / `vVariable`                 | `string` | —                 | Vector component pair      |
| `magnitudeVariable` / `directionVariable` | `string` | —                 | Alternative vector pair    |
| `speed`                                   | `number` | `1.0`             | Animation speed multiplier |
| `size`                                    | `number` | `3`               | Arrow size in pixels       |
| `directionConvention`                     | `string` | `'NAUTICAL_FROM'` | Direction convention       |

### OceanumContourLayer

Renders contour lines with labels for a scalar variable.

```javascript
new OceanumContourLayer({
  id: "pressure",
  serviceUrl: "https://zarr.datamesh.oceanum.io",
  datasource: "era5_surface",
  variable: "msl",
  time: "2024-01-15T00:00:00Z",
  levels: [990, 995, 1000, 1005, 1010, 1015, 1020, 1025],
});
```

| Prop         | Type        | Default             | Description             |
| ------------ | ----------- | ------------------- | ----------------------- |
| `variable`   | `string`    | _required_          | Scalar variable name    |
| `levels`     | `number[]`  | `[]`                | Contour level values    |
| `labelSize`  | `number`    | `12`                | Label font size         |
| `labelColor` | `[r,g,b,a]` | `[255,255,255,255]` | Label colour            |
| `smoothing`  | `boolean`   | `false`             | Smooth contour lines    |
| `numLabels`  | `number`    | `1`                 | Labels per contour line |

## Common Props

All layers share these props:

| Prop              | Type           | Default    | Description                                                                  |
| ----------------- | -------------- | ---------- | ---------------------------------------------------------------------------- |
| `serviceUrl`      | `string`       | _required_ | Root URL of the zarr service                                                 |
| `authHeaders`     | `object`       | `{}`       | HTTP headers for authentication                                              |
| `datasource`      | `string`       | _required_ | Dataset name (subpath of the service URL)                                    |
| `instance`        | `string`       | latest     | Zarr group name. Defaults to the latest (last lexicographically)             |
| `time`            | `string\|Date` | first      | ISO 8601 string or `Date`. Resolved to nearest available time step           |
| `level`           | `number`       | `0`        | 0-based index into the level dimension                                       |
| `colormap`        | `object`       | `null`     | `{ scale: string[], domain: number[] }`                                      |
| `opacity`         | `number`       | `1.0`      | Layer opacity (0-1)                                                          |
| `altitude`        | `number`       | `0.0`      | Altitude offset                                                              |
| `globalWrap`      | `boolean`      | `false`    | Wrap across the antimeridian                                                 |
| `scale`           | `number`       | `1.0`      | Value multiplier before colormapping                                         |
| `offset`          | `number`       | `0.0`      | Value offset before colormapping                                             |
| `pickable`        | `boolean`      | `false`    | Enable picking                                                               |
| `visible`         | `boolean`      | `true`     | Layer visibility                                                             |
| `viewportPadding` | `number`       | `0.1`      | Spatial padding fraction beyond viewport edges                               |
| `debounceWait`    | `number`       | `100`      | Debounce delay (ms) for slice requests                                       |
| `onDataLoad`      | `function`     | —          | Called when metadata loads. Receives `{ dataset, times, nlevels, instance }` |
| `onError`         | `object`       | —          | Error hooks object (see below)                                               |

## Zarr Dataset Structure

The zarr archives are expected to have:

- A `_coordinates` attribute in the root `.zattrs` mapping dimension roles:
  ```json
  { "x": "longitude", "y": "latitude", "t": "time", "z": "level" }
  ```
- Dimensions: `(time, [level], latitude, longitude)`
- One or more instance groups at the root level (optional)

## Error Hooks

The `onError` prop accepts per-state callbacks:

```javascript
onError: {
  onMetadataError:   (err) => { /* dataset open failed */ },
  onChunkError:      (err) => { /* chunk fetch failed */ },
  onVariableError:   (err) => { /* variable not found */ },
  onValidationError: (err) => { /* invalid props */ },
}
```

| Hook                | When                          | Layer Behaviour        |
| ------------------- | ----------------------------- | ---------------------- |
| `onMetadataError`   | Dataset open fails            | Renders nothing        |
| `onChunkError`      | Chunk fetch fails             | Keeps last valid slice |
| `onVariableError`   | Variable not found in dataset | Renders nothing        |
| `onValidationError` | Invalid prop combination      | Renders nothing        |

## Classes

- [OceanumBaseLayer](classes/OceanumBaseLayer.md)
- [OceanumContourLayer](classes/OceanumContourLayer.md)
- [OceanumParticleLayer](classes/OceanumParticleLayer.md)
- [OceanumPartmeshLayer](classes/OceanumPartmeshLayer.md)
- [OceanumPcolorLayer](classes/OceanumPcolorLayer.md)

## Interfaces

- [Colormap](interfaces/Colormap.md)
- [ErrorHandlers](interfaces/ErrorHandlers.md)
- [LayerError](interfaces/LayerError.md)
- [OceanumLayerProps](interfaces/OceanumLayerProps.md)
- [OnDataLoadInfo](interfaces/OnDataLoadInfo.md)
