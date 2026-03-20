# EIDOS JavaScript Bindings

A lightweight, reactive JavaScript library for embedding and controlling EIDOS visualizations in web applications. Built with Valtio for natural object mutations and AJV for comprehensive schema validation.

## Features

- **Natural API**: Mutate EIDOS specs using standard JavaScript object assignment
- **Reactive Updates**: Changes automatically propagate to the renderer via JSON patches
- **Schema Validation**: Comprehensive validation using AJV with detailed error messages
- **Framework Agnostic**: Works with React, Vue, Svelte, and vanilla JavaScript
- **Lightweight**: Small bundle size with efficient reactivity
- **Type Safe**: Full TypeScript support

## Quick Start

### Installation

```bash
npm install @oceanum/eidos
```

### React Usage (Recommended)

{% raw %}

```tsx
import { EidosProvider, useEidosSpec } from "@oceanum/eidos";

// Define your EIDOS specification
const initialSpec = {
  version: "0.9",
  id: "my-app",
  name: "My Visualization",
  root: {
    id: "root",
    nodeType: "world",
    children: [],
  },
  data: [],
};

function App() {
  return (
    <EidosProvider
      initialSpec={initialSpec}
      options={{
        renderer: "https://render.eidos.oceanum.io",
        eventListener: (event) => console.log("Event:", event),
      }}
    >
      <YourComponents />
    </EidosProvider>
  );
}

// In any child component
function YourComponent() {
  const spec = useEidosSpec();

  const addLayer = () => {
    // Mutate spec directly - changes propagate automatically to iframe
    spec.root.children.push({
      id: "new-layer",
      nodeType: "worldlayer",
      layerType: "track",
    });
  };

  return <button onClick={addLayer}>Add Layer</button>;
}
```

{% endraw %}

### Vanilla JavaScript Usage

```javascript
import { render } from "@oceanum/eidos";

// Define your EIDOS specification
const spec = {
  version: "0.9",
  id: "my-app",
  name: "My Visualization",
  root: {
    id: "root",
    nodeType: "world",
    children: [],
  },
  data: [],
};

// Render in a container element
const container = document.getElementById("eidos-container");
const result = await render(container, spec, {
  renderer: "https://render.eidos.oceanum.io",
  eventListener: (event) => {
    console.log("Received event:", event);
  },
});

// Mutate the spec naturally - changes propagate automatically
result.spec.name = "Updated Visualization";
result.spec.root.children.push({
  id: "layer-1",
  nodeType: "worldlayer",
  layerType: "track",
});

// Clean up when done
result.destroy();
```

## Advanced Usage

### Managing Multiple EIDOS Instances

The React Context API allows you to easily manage multiple EIDOS instances in the same application. Each `EidosProvider` creates its own isolated context with its own iframe and spec.

**Option 1: Multiple Providers (Recommended)**

{% raw %}

```tsx
import { EidosProvider, useEidosSpec } from "@oceanum/eidos";

function App() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Map view */}
      <EidosProvider
        initialSpec={mapSpec}
        options={{ renderer: EIDOS_URL }}
      >
        <MapControls />
      </EidosProvider>

      {/* Chart view */}
      <EidosProvider
        initialSpec={chartSpec}
        options={{ renderer: EIDOS_URL }}
      >
        <ChartControls />
      </EidosProvider>
    </div>
  );
}

function MapControls() {
  const spec = useEidosSpec(); // Gets mapSpec from nearest provider
  // Mutations only affect this instance
  const zoomIn = () => {
    spec.root.viewState.zoom += 1;
  };
  return <button onClick={zoomIn}>Zoom In</button>;
}

function ChartControls() {
  const spec = useEidosSpec(); // Gets chartSpec from nearest provider
  // Completely isolated from MapControls
  const updateData = () => {
    spec.data[0].dataSpec = newData;
  };
  return <button onClick={updateData}>Update Data</button>;
}
```

{% endraw %}

**Option 2: Low-Level Render API**

For more control, use the `render()` function directly:

```tsx
import { render } from "@oceanum/eidos";
import { useEffect, useRef, useState } from "react";

function MultiInstance() {
  const container1 = useRef(null);
  const container2 = useRef(null);
  const [specs, setSpecs] = useState({ map: null, chart: null });

  useEffect(() => {
    const init = async () => {
      const map = await render(container1.current, mapSpec, { renderer: EIDOS_URL });
      const chart = await render(container2.current, chartSpec, { renderer: EIDOS_URL });

      setSpecs({ map: map.spec, chart: chart.spec });

      return () => {
        map.destroy();
        chart.destroy();
      };
    };

    init();
  }, []);

  const updateMap = () => {
    if (specs.map) {
      specs.map.root.viewState.zoom += 1;
    }
  };

  return (
    <div>
      <div ref={container1} style={{ width: '50%', height: '100%' }} />
      <div ref={container2} style={{ width: '50%', height: '100%' }} />
      <button onClick={updateMap}>Update Map</button>
    </div>
  );
}
```

**Key Points for Multiple Instances:**

- Each instance has its own iframe and spec proxy
- Changes to one instance don't affect others
- `useEidosSpec()` always returns the spec from the nearest `EidosProvider` ancestor
- Use unique `id` values in your specs to avoid conflicts
- Each instance can connect to the same or different renderer URLs

## Framework Integration

- [React Integration](./react.md) - Hooks, components, and patterns
- [Vue.js Integration](./vue.md) - Composition API and component examples
- [Svelte Integration](./svelte.md) - Stores and reactive patterns
- [Vanilla JavaScript](./vanilla.md) - Pure JavaScript examples

## API Reference

See the [Core API](./api.md) documentation for complete API details including:

- `render()` function
- `EidosProvider` component
- `useEidosSpec()` hook
- Event handling
- Schema validation
