# Vanilla JavaScript Integration

This guide shows how to use EIDOS JavaScript bindings in plain JavaScript applications without any framework.

## Installation

### NPM/Yarn

```bash
npm install @oceanum/eidos
# or
yarn add @oceanum/eidos
```

### CDN

```html
<script type="module">
  import { embed } from 'https://unpkg.com/@oceanum/eidos/dist/eidos.js';
  // Your code here
</script>
```

## Basic Usage

### Simple Embedding

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EIDOS Vanilla JS Example</title>
  <style>
    #eidos-container {
      width: 100%;
      height: 500px;
      border: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <h1>EIDOS Visualization</h1>
  <div id="eidos-container"></div>

  <script type="module">
    import { embed } from '@oceanum/eidos';

    const spec = {
      id: 'vanilla-demo',
      name: 'Vanilla JS Demo',
      root: {
        id: 'root',
        nodeType: 'world',
        children: []
      },
      data: [],
      transforms: []
    };

    async function initEidos() {
      const container = document.getElementById('eidos-container');
      
      try {
        const eidos = await embed(container, spec, (event) => {
          console.log('EIDOS event:', event);
        });
        
        console.log('EIDOS instance created:', eidos);
        
        // Example: Add a layer after 2 seconds
        setTimeout(() => {
          eidos.root.children.push({
            id: 'demo-layer',
            nodeType: 'worldlayer',
            layerType: 'track'
          });
          console.log('Layer added');
        }, 2000);
        
      } catch (error) {
        console.error('Failed to create EIDOS:', error);
        container.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initEidos);
    } else {
      initEidos();
    }
  </script>
</body>
</html>
```

## Interactive Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive EIDOS Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    
    .container {
      display: flex;
      gap: 20px;
      height: 600px;
    }
    
    .visualization {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .controls {
      width: 300px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow-y: auto;
    }
    
    .control-group {
      margin-bottom: 20px;
    }
    
    .control-group button {
      display: block;
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .control-group button:hover {
      background: #0056b3;
    }
    
    .control-group button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .input-group {
      margin-bottom: 10px;
    }
    
    .input-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .input-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    .events {
      margin-top: 20px;
    }
    
    .event-list {
      height: 200px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      background: #f8f9fa;
    }
    
    .event-item {
      margin-bottom: 10px;
      padding: 8px;
      background: white;
      border-radius: 3px;
      font-size: 12px;
    }
    
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 18px;
      color: #666;
    }
    
    .error {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: red;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Interactive EIDOS Visualization</h1>
  
  <div class="container">
    <div id="eidos-container" class="visualization">
      <div class="loading">Loading EIDOS...</div>
    </div>
    
    <div class="controls">
      <h3>Controls</h3>
      
      <div class="control-group">
        <button id="add-layer-btn" disabled>Add Track Layer</button>
        <button id="add-gridded-btn" disabled>Add Gridded Layer</button>
        <button id="update-title-btn" disabled>Update Title</button>
        <button id="clear-events-btn">Clear Events</button>
      </div>
      
      <div class="input-group">
        <label for="title-input">Visualization Title:</label>
        <input type="text" id="title-input" placeholder="Enter title..." disabled>
      </div>
      
      <div class="input-group">
        <label for="data-url-input">Data URL:</label>
        <input type="text" id="data-url-input" placeholder="https://..." disabled>
      </div>
      
      <div>
        <p><strong>Layers:</strong> <span id="layer-count">0</span></p>
        <p><strong>Status:</strong> <span id="status">Loading...</span></p>
      </div>
      
      <div class="events">
        <h4>Events (<span id="event-count">0</span>)</h4>
        <div id="event-list" class="event-list">
          <p>No events yet...</p>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    import { embed } from '@oceanum/eidos';

    class EidosApp {
      constructor() {
        this.eidos = null;
        this.events = [];
        this.spec = {
          id: 'interactive-vanilla',
          name: 'Interactive Vanilla Demo',
          root: {
            id: 'root',
            nodeType: 'world',
            children: []
          },
          data: [],
          transforms: []
        };
        
        this.initElements();
        this.initEventListeners();
        this.initEidos();
      }
      
      initElements() {
        this.container = document.getElementById('eidos-container');
        this.addLayerBtn = document.getElementById('add-layer-btn');
        this.addGriddedBtn = document.getElementById('add-gridded-btn');
        this.updateTitleBtn = document.getElementById('update-title-btn');
        this.clearEventsBtn = document.getElementById('clear-events-btn');
        this.titleInput = document.getElementById('title-input');
        this.dataUrlInput = document.getElementById('data-url-input');
        this.layerCount = document.getElementById('layer-count');
        this.status = document.getElementById('status');
        this.eventCount = document.getElementById('event-count');
        this.eventList = document.getElementById('event-list');
      }
      
      initEventListeners() {
        this.addLayerBtn.addEventListener('click', () => this.addTrackLayer());
        this.addGriddedBtn.addEventListener('click', () => this.addGriddedLayer());
        this.updateTitleBtn.addEventListener('click', () => this.updateTitle());
        this.clearEventsBtn.addEventListener('click', () => this.clearEvents());
        
        this.titleInput.addEventListener('input', (e) => {
          if (this.eidos) {
            this.eidos.name = e.target.value;
          }
        });
        
        this.titleInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.updateTitle();
          }
        });
      }
      
      async initEidos() {
        try {
          this.eidos = await embed(this.container, this.spec, (event) => {
            this.handleEvent(event);
          });
          
          this.onEidosReady();
        } catch (error) {
          this.onEidosError(error);
        }
      }
      
      onEidosReady() {
        this.status.textContent = 'Ready';
        this.container.innerHTML = ''; // Remove loading message
        
        // Enable controls
        this.addLayerBtn.disabled = false;
        this.addGriddedBtn.disabled = false;
        this.updateTitleBtn.disabled = false;
        this.titleInput.disabled = false;
        this.dataUrlInput.disabled = false;
        
        // Set initial title
        this.titleInput.value = this.eidos.name;
        
        this.updateLayerCount();
        console.log('EIDOS ready:', this.eidos);
      }
      
      onEidosError(error) {
        this.status.textContent = 'Error';
        this.container.innerHTML = `
          <div class="error">
            <div>
              <h3>Failed to load EIDOS</h3>
              <p>${error.message}</p>
            </div>
          </div>
        `;
        console.error('EIDOS error:', error);
      }
      
      addTrackLayer() {
        if (!this.eidos) return;
        
        const layer = {
          id: `track-layer-${Date.now()}`,
          nodeType: 'worldlayer',
          layerType: 'track',
          data: {
            url: this.dataUrlInput.value || 'https://example.com/track-data.json'
          }
        };
        
        this.eidos.root.children.push(layer);
        this.updateLayerCount();
        
        console.log('Added track layer:', layer);
      }
      
      addGriddedLayer() {
        if (!this.eidos) return;
        
        const layer = {
          id: `gridded-layer-${Date.now()}`,
          nodeType: 'worldlayer',
          layerType: 'gridded',
          data: {
            url: this.dataUrlInput.value || 'https://example.com/gridded-data.zarr'
          }
        };
        
        this.eidos.root.children.push(layer);
        this.updateLayerCount();
        
        console.log('Added gridded layer:', layer);
      }
      
      updateTitle() {
        if (!this.eidos) return;
        
        const newTitle = this.titleInput.value || `Updated at ${new Date().toLocaleTimeString()}`;
        this.eidos.name = newTitle;
        this.titleInput.value = newTitle;
        
        console.log('Title updated:', newTitle);
      }
      
      updateLayerCount() {
        if (this.eidos) {
          this.layerCount.textContent = this.eidos.root.children.length;
        }
      }
      
      handleEvent(event) {
        this.events.unshift({
          ...event,
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 events
        if (this.events.length > 50) {
          this.events = this.events.slice(0, 50);
        }
        
        this.updateEventDisplay();
        console.log('EIDOS event:', event);
      }
      
      updateEventDisplay() {
        this.eventCount.textContent = this.events.length;
        
        if (this.events.length === 0) {
          this.eventList.innerHTML = '<p>No events yet...</p>';
          return;
        }
        
        const eventsHtml = this.events
          .slice(0, 10) // Show only last 10 events
          .map((event, index) => `
            <div class="event-item">
              <strong>${event.type || 'unknown'}</strong>
              <br>
              <small>${event.timestamp}</small>
              <br>
              <code>${JSON.stringify(event.payload || {}, null, 2)}</code>
            </div>
          `)
          .join('');
        
        this.eventList.innerHTML = eventsHtml;
      }
      
      clearEvents() {
        this.events = [];
        this.updateEventDisplay();
      }
    }

    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => new EidosApp());
    } else {
      new EidosApp();
    }
  </script>
</body>
</html>
```

## Module System Integration

### ES Modules

```javascript
// eidos-manager.js
import { embed } from '@oceanum/eidos';

export class EidosManager {
  constructor() {
    this.instances = new Map();
    this.eventCallbacks = new Map();
  }

  async create(id, container, spec, renderer) {
    if (this.instances.has(id)) {
      throw new Error(`Instance with id '${id}' already exists`);
    }

    const callbacks = this.eventCallbacks.get(id) || [];
    const instance = await embed(container, spec, (event) => {
      callbacks.forEach(callback => callback(event));
    }, renderer);

    this.instances.set(id, instance);
    return instance;
  }

  get(id) {
    return this.instances.get(id);
  }

  update(id, updates) {
    const instance = this.instances.get(id);
    if (instance) {
      Object.assign(instance, updates);
    }
  }

  on(id, callback) {
    const callbacks = this.eventCallbacks.get(id) || [];
    callbacks.push(callback);
    this.eventCallbacks.set(id, callbacks);
  }

  off(id, callback) {
    const callbacks = this.eventCallbacks.get(id) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  destroy(id) {
    this.instances.delete(id);
    this.eventCallbacks.delete(id);
  }
}

// Global instance
export const eidosManager = new EidosManager();
```

### CommonJS

```javascript
// eidos-wrapper.js
const { embed } = require('@oceanum/eidos');

class EidosWrapper {
  constructor(container, spec, options = {}) {
    this.container = container;
    this.spec = spec;
    this.options = options;
    this.instance = null;
    this.eventHandlers = [];
  }

  async init() {
    try {
      this.instance = await embed(
        this.container,
        this.spec,
        (event) => this.handleEvent(event),
        this.options.renderer
      );
      return this.instance;
    } catch (error) {
      console.error('Failed to initialize EIDOS:', error);
      throw error;
    }
  }

  handleEvent(event) {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    });
  }

  on(handler) {
    this.eventHandlers.push(handler);
    return () => {
      const index = this.eventHandlers.indexOf(handler);
      if (index > -1) {
        this.eventHandlers.splice(index, 1);
      }
    };
  }

  update(updates) {
    if (this.instance) {
      Object.assign(this.instance, updates);
    }
  }
}

module.exports = { EidosWrapper };
```

## Webpack Integration

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      // EIDOS may need these polyfills for browser compatibility
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

## Error Handling Patterns

```javascript
// error-handling.js
import { embed } from '@oceanum/eidos';

class EidosErrorHandler {
  static async safeEmbed(container, spec, onEvent, renderer) {
    try {
      return await embed(container, spec, onEvent, renderer);
    } catch (error) {
      this.handleError(error, container);
      throw error;
    }
  }

  static handleError(error, container) {
    console.error('EIDOS Error:', error);
    
    // Display user-friendly error message
    container.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 4px;
        color: #c66;
      ">
        <div style="text-align: center;">
          <h3>Visualization Error</h3>
          <p>${this.getUserFriendlyMessage(error)}</p>
          <details style="margin-top: 10px;">
            <summary>Technical Details</summary>
            <pre style="margin-top: 10px; font-size: 12px;">${error.message}</pre>
          </details>
        </div>
      </div>
    `;
  }

  static getUserFriendlyMessage(error) {
    if (error.message.includes('validation failed')) {
      return 'The visualization specification is invalid. Please check your data format.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Unable to connect to the visualization server. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'The visualization is taking too long to load. Please try again.';
    }
    return 'An unexpected error occurred while loading the visualization.';
  }
}

export { EidosErrorHandler };
```

## Performance Optimization

```javascript
// performance.js
import { embed } from '@oceanum/eidos';

class EidosPerformanceOptimizer {
  constructor() {
    this.instanceCache = new Map();
    this.debounceTimers = new Map();
  }

  // Debounced spec updates
  debouncedUpdate(instance, updates, delay = 100) {
    const instanceId = instance.id;
    
    if (this.debounceTimers.has(instanceId)) {
      clearTimeout(this.debounceTimers.get(instanceId));
    }

    const timer = setTimeout(() => {
      Object.assign(instance, updates);
      this.debounceTimers.delete(instanceId);
    }, delay);

    this.debounceTimers.set(instanceId, timer);
  }

  // Lazy loading
  async lazyEmbed(container, spec, onEvent, renderer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          try {
            await embed(container, spec, onEvent, renderer);
          } catch (error) {
            console.error('Lazy embed failed:', error);
          }
        }
      });
    });

    observer.observe(container);
  }

  // Spec caching
  getCachedSpec(specKey) {
    return this.instanceCache.get(specKey);
  }

  setCachedSpec(specKey, spec) {
    this.instanceCache.set(specKey, spec);
  }
}

export { EidosPerformanceOptimizer };
```

## Best Practices

1. **Error Handling**: Always wrap `embed()` calls in try-catch blocks
2. **Event Management**: Limit stored events to prevent memory leaks
3. **Performance**: Use debouncing for rapid spec updates
4. **Validation**: Validate specs before embedding when possible
5. **Cleanup**: Remove event listeners and clear references when done
6. **Loading States**: Provide visual feedback during initialization
7. **Responsive Design**: Ensure containers resize properly
8. **Browser Support**: Test across different browsers and provide fallbacks