# API Reference

Complete API documentation for the EIDOS JavaScript bindings.

## Core Functions

### `embed(container, spec, onEvent?, renderer?)`

Embeds an EIDOS visualization in a DOM container element.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | `HTMLElement` | Yes | DOM element to embed the visualization in |
| `spec` | `EidosSpec` | Yes | EIDOS specification object |
| `onEvent` | `(event: any) => void` | No | Callback for events from the renderer |
| `renderer` | `string` | No | URL of the EIDOS renderer (default: `https://render.eidos.oceanum.io`) |

#### Returns

`Promise<EidosInstance>` - A promise that resolves to a reactive EIDOS instance

#### Example

```javascript
import { embed } from '@oceanum/eidos';

const container = document.getElementById('my-container');
const spec = {
  id: 'my-viz',
  name: 'My Visualization',
  root: { /* ... */ },
  data: [],
  transforms: []
};

const eidos = await embed(container, spec, (event) => {
  console.log('Event received:', event);
});

// Natural object mutations
eidos.name = 'Updated Name';
eidos.root.children.push(newLayer);
```

#### Throws

- `Error` - If the spec fails AJV schema validation
- `Error` - If the container element is invalid
- `Error` - If the renderer fails to load

---

### `validateSchema(spec)`

Validates an EIDOS specification against the JSON schema.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spec` | `any` | Yes | EIDOS specification to validate |

#### Returns

`Promise<boolean>` - True if validation passes

#### Example

```javascript
import { validateSchema } from '@oceanum/eidos';

try {
  await validateSchema(mySpec);
  console.log('Spec is valid');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

#### Throws

- `Error` - With detailed validation error messages if spec is invalid

---

## Types

### `EidosSpec`

The main EIDOS specification interface.

```typescript
interface EidosSpec {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  root: EidosNode;              // Root node of the visualization
  data: EidosDataSource[];      // Data sources
  transforms: EidosTransform[]; // Data transformations
  modalNodes?: EidosNode[];     // Optional modal nodes
}
```

### `EidosNode`

Represents a node in the EIDOS visualization tree.

```typescript
interface EidosNode {
  id: string;                                    // Unique node ID
  nodeType: 'grid' | 'world' | 'plot' | 'worldlayer' | 'menu'; // Node type
  children: EidosNode[];                         // Child nodes
  [key: string]: any;                           // Additional properties
}
```

#### Node Types

- **`grid`** - Layout container for organizing child nodes
- **`world`** - 3D/2D mapping visualization container
- **`plot`** - Chart/graph visualization container  
- **`worldlayer`** - Individual layer within a world (tracks, grids, etc.)
- **`menu`** - UI control panels and menus

### `EidosDataSource`

Defines a data source for the visualization.

```typescript
interface EidosDataSource {
  id: string;           // Unique data source ID
  url?: string;         // URL to fetch data from
  data?: any;           // Inline data
  [key: string]: any;   // Additional properties (format, transforms, etc.)
}
```

### `EidosTransform`

Defines a data transformation.

```typescript
interface EidosTransform {
  id: string;           // Unique transform ID
  type: string;         // Transform type
  [key: string]: any;   // Transform-specific properties
}
```

### `EidosInstance`

The reactive EIDOS instance returned by `embed()`.

```typescript
interface EidosInstance extends EidosSpec {
  // All EidosSpec properties are directly mutable
  // Changes automatically propagate to renderer via JSON patches
}
```

### `EidosEvent`

Events received from the EIDOS renderer.

```typescript
interface EidosEvent {
  type: string;         // Event type
  payload?: any;        // Event data
  timestamp?: number;   // Event timestamp
  source?: string;      // Event source
}
```

---

## Configuration

### Default Renderer

The default renderer URL can be overridden:

```javascript
// Using custom renderer
const eidos = await embed(container, spec, onEvent, 'https://my-renderer.com');
```

### Validation Options

AJV validation is configured with:

```javascript
{
  allErrors: true,    // Collect all validation errors
  verbose: true,      // Provide detailed error information  
  strict: false       // Allow additional properties
}
```

---

## Error Handling

### Validation Errors

Schema validation errors provide detailed information:

```javascript
try {
  await embed(container, invalidSpec);
} catch (error) {
  // Error message includes:
  // - Field path where validation failed
  // - Specific validation rule that failed
  // - Expected vs actual values
  console.error(error.message);
  // Example: "EIDOS spec validation failed: root/nodeType: must be equal to one of the allowed values"
}
```

### Common Error Types

| Error Type | Description | Solution |
|------------|-------------|-----------|
| Validation Error | Spec doesn't match schema | Fix spec properties to match schema requirements |
| Network Error | Can't reach renderer | Check renderer URL and network connection |
| Container Error | Invalid DOM element | Ensure container exists and is a valid HTMLElement |
| Initialization Error | Renderer failed to initialize | Check browser console for detailed errors |

---

## Event System

### Event Types

Common event types from the renderer:

| Event Type | Description | Payload |
|------------|-------------|---------|
| `init` | Renderer initialized | `{ ready: true }` |
| `click` | User clicked on visualization | `{ position: [x, y], feature?: object }` |
| `hover` | User hovered over element | `{ position: [x, y], feature?: object }` |
| `data-loaded` | Data source finished loading | `{ dataId: string, status: 'success' \| 'error' }` |
| `view-changed` | Viewport/camera changed | `{ bounds: [...], zoom: number }` |

### Event Handling Best Practices

```javascript
function handleEidosEvent(event) {
  switch (event.type) {
    case 'click':
      console.log('Clicked at:', event.payload.position);
      if (event.payload.feature) {
        showFeatureDetails(event.payload.feature);
      }
      break;
      
    case 'data-loaded':
      if (event.payload.status === 'error') {
        showDataError(event.payload.dataId);
      }
      break;
      
    default:
      console.log('Unhandled event:', event);
  }
}

const eidos = await embed(container, spec, handleEidosEvent);
```

---

## Reactivity

### How Reactivity Works

The EIDOS instance uses [Valtio](https://valtio.pmnd.rs/) under the hood to provide reactive object mutations:

1. **Proxy Creation**: The spec is wrapped in a Valtio proxy
2. **Change Detection**: Any property mutation is automatically detected
3. **Patch Generation**: Changes are converted to JSON patches
4. **Patch Transmission**: Patches are sent to the renderer via postMessage

### Mutation Examples

```javascript
// Direct property assignment
eidos.name = 'New Name';

// Array operations
eidos.root.children.push(newLayer);
eidos.data.splice(0, 1); // Remove first data source

// Nested object updates
eidos.root.children[0].visible = false;
eidos.data[0].url = 'https://new-url.com/data.json';

// Bulk updates
Object.assign(eidos.root, {
  backgroundColor: '#fff',
  showGrid: true
});
```

### Performance Considerations

- **Batching**: Multiple rapid mutations are automatically batched
- **Deep Watching**: All nested properties are reactive
- **Memory**: Valtio has minimal overhead compared to alternatives
- **JSON Patches**: Only changed properties are transmitted to renderer

---

## Advanced Usage

### Multiple Instances

Managing multiple EIDOS instances:

```javascript
const instances = new Map();

async function createInstance(id, container, spec) {
  const eidos = await embed(container, spec, (event) => {
    console.log(`Event from ${id}:`, event);
  });
  
  instances.set(id, eidos);
  return eidos;
}

function updateInstance(id, updates) {
  const eidos = instances.get(id);
  if (eidos) {
    Object.assign(eidos, updates);
  }
}
```

### Custom Renderers

Using a custom renderer endpoint:

```javascript
const customRenderer = 'https://my-company.com/eidos-renderer';
const eidos = await embed(container, spec, onEvent, customRenderer);
```

### Spec Templates

Creating reusable spec templates:

```javascript
function createWorldSpec(id, name) {
  return {
    id,
    name,
    root: {
      id: 'root',
      nodeType: 'world',
      children: [],
      projection: 'mercator',
      bounds: [[-180, -90], [180, 90]]
    },
    data: [],
    transforms: []
  };
}

const spec = createWorldSpec('my-world', 'My World Map');
```

### Dynamic Data Loading

```javascript
// Add data source dynamically
eidos.data.push({
  id: 'dynamic-data',
  url: 'https://api.example.com/live-data.json',
  format: 'geojson'
});

// Add layer that uses the data
eidos.root.children.push({
  id: 'dynamic-layer',
  nodeType: 'worldlayer',
  layerType: 'feature',
  dataId: 'dynamic-data'
});
```

---

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 80+ | Full support |
| Firefox | 75+ | Full support |
| Safari | 13+ | Full support |
| Edge | 80+ | Full support |
| IE | Not supported | Use modern browser |

### Required Features

- ES6 Modules
- Promises/async-await
- Proxy object support
- postMessage API
- iframe support

---

## Debugging

### Enable Debug Mode

```javascript
// Enable console logging for patch operations
localStorage.setItem('eidos-debug', 'true');
```

### Common Debug Tasks

```javascript
// Inspect current spec
console.log('Current spec:', JSON.stringify(eidos, null, 2));

// Monitor patches
const originalPostMessage = iframe.contentWindow.postMessage;
iframe.contentWindow.postMessage = function(data, origin) {
  if (data.type === 'patch') {
    console.log('Patch sent:', data.payload);
  }
  return originalPostMessage.call(this, data, origin);
};

// Validate spec manually
import { validateSchema } from '@oceanum/eidos';
validateSchema(eidos).catch(console.error);
```