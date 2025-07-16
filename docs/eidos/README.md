# EIDOS JavaScript Bindings

A lightweight, reactive JavaScript library for embedding and controlling EIDOS visualizations in web applications. Built with Valtio for natural object mutations and AJV for comprehensive schema validation.

## Features

- 🚀 **Natural API**: Mutate EIDOS specs using standard JavaScript object assignment
- ⚡ **Reactive Updates**: Changes automatically propagate to the renderer via JSON patches
- 🔍 **Schema Validation**: Comprehensive validation using AJV with detailed error messages
- 🎯 **Framework Agnostic**: Works with React, Vue, Svelte, and vanilla JavaScript
- 📦 **Lightweight**: Small bundle size with efficient reactivity
- 🔒 **Type Safe**: Full TypeScript support

## Quick Start

### Installation

```bash
npm install @oceanum/eidos
```

### Basic Usage

```javascript
import { embed } from "@oceanum/eidos";

// Define your EIDOS specification
const spec = {
  id: "my-app",
  name: "My Visualization",
  root: {
    id: "root",
    nodeType: "world",
    children: [],
  },
  data: [],
  transforms: [],
};

// Embed in a container element
const container = document.getElementById("eidos-container");
const eidos = await embed(container, spec, (event) => {
  console.log("Received event:", event);
});

// Mutate the spec naturally - changes propagate automatically
eidos.name = "Updated Visualization";
eidos.root.children.push({
  id: "layer-1",
  nodeType: "worldlayer",
  layerType: "track",
});
```

## Framework Integration

- [React Integration](./react.md) - Hooks, components, and patterns
- [Vue.js Integration](./vue.md) - Composition API and component examples
- [Svelte Integration](./svelte.md) - Stores and reactive patterns
- [Vanilla JavaScript](./vanilla.md) - Pure JavaScript examples

## API Reference

- [Core API](./api.md) - Complete API documentation
- [Events](./events.md) - Event handling and communication
- [Validation](./validation.md) - Schema validation details
