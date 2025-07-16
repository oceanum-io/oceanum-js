# Svelte Integration

This guide shows how to integrate EIDOS JavaScript bindings with Svelte applications using stores and reactive patterns.

## Installation

```bash
npm install @oceanum/eidos svelte
```

## Basic Store

Create a reusable store for EIDOS management:

```typescript
// stores/eidos.ts
import { writable, derived, type Writable } from 'svelte/store';
import { embed } from '@oceanum/eidos';

export interface EidosStore {
  instance: any;
  loading: boolean;
  error: string | null;
  events: any[];
}

export function createEidosStore() {
  const { subscribe, set, update } = writable<EidosStore>({
    instance: null,
    loading: false,
    error: null,
    events: []
  });

  return {
    subscribe,
    
    async create(container: HTMLElement, spec: any, renderer?: string) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const instance = await embed(container, spec, (event) => {
          this.addEvent(event);
        }, renderer);
        
        update(state => ({ 
          ...state, 
          instance, 
          loading: false 
        }));
      } catch (error: any) {
        update(state => ({ 
          ...state, 
          error: error.message, 
          loading: false 
        }));
      }
    },

    updateSpec(updates: any) {
      update(state => {
        if (state.instance) {
          Object.assign(state.instance, updates);
        }
        return state;
      });
    },

    addEvent(event: any) {
      update(state => ({
        ...state,
        events: [...state.events.slice(-50), {
          ...event,
          timestamp: Date.now()
        }]
      }));
    },

    clearEvents() {
      update(state => ({ ...state, events: [] }));
    },

    reset() {
      set({
        instance: null,
        loading: false,
        error: null,
        events: []
      });
    }
  };
}
```

## Basic Component

```svelte
<!-- EidosViewer.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { embed } from '@oceanum/eidos';

  export let spec: any;
  export let renderer: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  
  let container: HTMLElement;
  let eidos: any = null;
  let loading = true;
  let error: string | null = null;

  async function createInstance() {
    if (!container || !spec) return;
    
    try {
      loading = true;
      error = null;
      
      eidos = await embed(container, spec, (event) => {
        dispatch('event', event);
      }, renderer);
    } catch (err: any) {
      error = err.message;
      dispatch('error', err);
    } finally {
      loading = false;
    }
  }

  export function updateSpec(updates: any) {
    if (eidos) {
      Object.assign(eidos, updates);
    }
  }

  onMount(() => {
    createInstance();
  });

  // Reactive statement to recreate when spec changes
  $: if (spec && container) {
    createInstance();
  }
</script>

<div class="eidos-viewer" class:loading>
  {#if error}
    <div class="eidos-error">
      <p>Failed to load EIDOS visualization:</p>
      <pre>{error}</pre>
    </div>
  {/if}
  
  {#if loading}
    <div class="eidos-loading">
      Loading visualization...
    </div>
  {/if}
  
  <div 
    bind:this={container}
    class="eidos-container"
  />
</div>

<style>
  .eidos-viewer {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .eidos-container {
    width: 100%;
    height: 100%;
  }

  .eidos-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
  }

  .eidos-error {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 4px;
    padding: 20px;
    z-index: 10;
  }

  .eidos-error pre {
    font-size: 12px;
    overflow: auto;
    margin: 10px 0 0 0;
  }
</style>
```

## Interactive Example

```svelte
<!-- InteractiveEidos.svelte -->
<script lang="ts">
  import { writable } from 'svelte/store';
  import EidosViewer from './EidosViewer.svelte';

  // Reactive spec using store
  const spec = writable({
    id: 'interactive-demo',
    name: 'Interactive Demo',
    root: {
      id: 'root',
      nodeType: 'world',
      children: []
    },
    data: [],
    transforms: []
  });

  let events: any[] = [];
  let eidosViewer: EidosViewer;

  function handleEvent(event: CustomEvent) {
    events = [{
      ...event.detail,
      timestamp: new Date().toISOString()
    }, ...events.slice(0, 9)]; // Keep last 10 events
  }

  function addLayer() {
    spec.update(s => ({
      ...s,
      root: {
        ...s.root,
        children: [...s.root.children, {
          id: `layer-${Date.now()}`,
          nodeType: 'worldlayer',
          layerType: 'track',
          data: { url: 'https://example.com/track-data.json' }
        }]
      }
    }));
  }

  function updateTitle() {
    spec.update(s => ({
      ...s,
      name: `Updated at ${new Date().toLocaleTimeString()}`
    }));
  }

  function clearEvents() {
    events = [];
  }

  // Direct mutation example (alternative to store updates)
  function directMutation() {
    if (eidosViewer) {
      eidosViewer.updateSpec({
        name: `Direct update at ${new Date().toLocaleTimeString()}`
      });
    }
  }
</script>

<div class="interactive-eidos">
  <div class="visualization">
    <EidosViewer 
      bind:this={eidosViewer}
      spec={$spec} 
      on:event={handleEvent}
    />
  </div>
  
  <div class="controls">
    <h3>Controls</h3>
    
    <div class="control-group">
      <button on:click={addLayer}>Add Layer</button>
      <button on:click={updateTitle}>Update Title (Store)</button>
      <button on:click={directMutation}>Update Title (Direct)</button>
      <button on:click={clearEvents}>Clear Events</button>
    </div>
    
    <div class="spec-editor">
      <h4>Spec Name</h4>
      <input 
        bind:value={$spec.name}
        placeholder="Visualization name"
      />
    </div>
    
    <div class="layer-count">
      <p>Layers: {$spec.root.children.length}</p>
    </div>
    
    <div class="events">
      <h4>Recent Events ({events.length})</h4>
      <div class="event-list">
        {#each events as event, i (i)}
          <div class="event-item">
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .interactive-eidos {
    display: flex;
    height: 600px;
    gap: 20px;
  }

  .visualization {
    flex: 1;
  }

  .controls {
    width: 300px;
    padding: 20px;
    border-left: 1px solid #ddd;
    overflow-y: auto;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .control-group button {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .control-group button:hover {
    background: #0056b3;
  }

  .spec-editor {
    margin-bottom: 20px;
  }

  .spec-editor input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .layer-count {
    margin-bottom: 20px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .events {
    flex: 1;
  }

  .event-list {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .event-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
    font-size: 11px;
  }

  .event-item:last-child {
    border-bottom: none;
  }

  .event-item pre {
    margin: 0;
    white-space: pre-wrap;
  }
</style>
```

## Advanced Store with Context

```typescript
// stores/eidosContext.ts
import { setContext, getContext } from 'svelte';
import { writable, derived } from 'svelte/store';
import { embed } from '@oceanum/eidos';

const EIDOS_CONTEXT_KEY = Symbol('eidos');

export interface EidosContext {
  instances: Record<string, any>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  events: any[];
}

export function createEidosContext() {
  const store = writable<EidosContext>({
    instances: {},
    loading: {},
    errors: {},
    events: []
  });

  const context = {
    subscribe: store.subscribe,
    
    async createInstance(
      id: string,
      container: HTMLElement,
      spec: any,
      renderer?: string
    ) {
      store.update(state => ({
        ...state,
        loading: { ...state.loading, [id]: true },
        errors: { ...state.errors, [id]: null }
      }));

      try {
        const instance = await embed(container, spec, (event) => {
          this.addEvent(event);
        }, renderer);

        store.update(state => ({
          ...state,
          instances: { ...state.instances, [id]: instance },
          loading: { ...state.loading, [id]: false }
        }));
      } catch (error: any) {
        store.update(state => ({
          ...state,
          errors: { ...state.errors, [id]: error.message },
          loading: { ...state.loading, [id]: false }
        }));
      }
    },

    updateSpec(id: string, updates: any) {
      store.update(state => {
        const instance = state.instances[id];
        if (instance) {
          Object.assign(instance, updates);
        }
        return state;
      });
    },

    addEvent(event: any) {
      store.update(state => ({
        ...state,
        events: [...state.events.slice(-99), {
          ...event,
          timestamp: Date.now()
        }]
      }));
    },

    getInstance: derived(store, $store => (id: string) => $store.instances[id]),
    isLoading: derived(store, $store => (id: string) => $store.loading[id] || false),
    getError: derived(store, $store => (id: string) => $store.errors[id]),
    recentEvents: derived(store, $store => $store.events.slice(-10))
  };

  setContext(EIDOS_CONTEXT_KEY, context);
  return context;
}

export function getEidosContext() {
  return getContext<ReturnType<typeof createEidosContext>>(EIDOS_CONTEXT_KEY);
}
```

## Component with Context

```svelte
<!-- EidosWithContext.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getEidosContext } from '../stores/eidosContext';

  export let spec: any;
  export let instanceId: string;
  export let renderer: string | undefined = undefined;

  const eidosContext = getEidosContext();
  
  let container: HTMLElement;

  $: instance = $eidosContext.getInstance(instanceId);
  $: loading = $eidosContext.isLoading(instanceId);
  $: error = $eidosContext.getError(instanceId);

  onMount(() => {
    if (container) {
      eidosContext.createInstance(instanceId, container, spec, renderer);
    }
  });

  export function updateSpec(updates: any) {
    eidosContext.updateSpec(instanceId, updates);
  }
</script>

<div class="eidos-with-context">
  {#if $loading}
    <div class="loading">Loading...</div>
  {/if}
  
  {#if $error}
    <div class="error">{$error}</div>
  {/if}
  
  <div 
    bind:this={container}
    class="container"
  />
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }

  .loading, .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .error {
    color: red;
    background: #fee;
    padding: 10px;
    border-radius: 4px;
  }
</style>
```

## SvelteKit Integration

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  
  let EidosViewer: any;
  let mounted = false;

  onMount(async () => {
    if (browser) {
      // Dynamic import to avoid SSR issues
      const module = await import('../lib/components/EidosViewer.svelte');
      EidosViewer = module.default;
      mounted = true;
    }
  });

  const spec = {
    id: 'sveltekit-demo',
    name: 'SvelteKit Demo',
    root: {
      id: 'root',
      nodeType: 'world',
      children: []
    },
    data: [],
    transforms: []
  };
</script>

<svelte:head>
  <title>EIDOS SvelteKit Demo</title>
</svelte:head>

<h1>EIDOS SvelteKit Integration</h1>

{#if mounted && EidosViewer}
  <div style="height: 500px;">
    <svelte:component 
      this={EidosViewer} 
      {spec}
      on:event={(e) => console.log('Event:', e.detail)}
    />
  </div>
{:else}
  <div>Loading EIDOS...</div>
{/if}
```

## Custom Actions

```typescript
// actions/eidos.ts
import { embed } from '@oceanum/eidos';

export function eidosAction(
  node: HTMLElement, 
  { spec, onEvent, renderer }: { 
    spec: any; 
    onEvent?: (event: any) => void; 
    renderer?: string; 
  }
) {
  let instance: any;

  async function createInstance() {
    try {
      instance = await embed(node, spec, onEvent, renderer);
    } catch (error) {
      console.error('Failed to create EIDOS instance:', error);
    }
  }

  createInstance();

  return {
    update({ spec: newSpec, onEvent: newOnEvent, renderer: newRenderer }: {
      spec: any;
      onEvent?: (event: any) => void;
      renderer?: string;
    }) {
      // Recreate instance on spec change
      if (JSON.stringify(spec) !== JSON.stringify(newSpec)) {
        createInstance();
      }
    },
    
    destroy() {
      // Cleanup if needed
      instance = null;
    }
  };
}
```

Using the action:

```svelte
<script lang="ts">
  import { eidosAction } from '../actions/eidos';

  const spec = { /* ... */ };
  
  function handleEvent(event: any) {
    console.log('EIDOS event:', event);
  }
</script>

<div 
  use:eidosAction={{ spec, onEvent: handleEvent }}
  style="width: 100%; height: 400px;"
/>
```

## TypeScript Support

```typescript
// app.d.ts
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    'on:event'?: (event: CustomEvent<any>) => void;
    'on:error'?: (event: CustomEvent<Error>) => void;
  }
}

// types/eidos.d.ts
export interface EidosSpec {
  id: string;
  name: string;
  root: EidosNode;
  data: EidosDataSource[];
  transforms: EidosTransform[];
}

export interface EidosNode {
  id: string;
  nodeType: 'grid' | 'world' | 'plot' | 'worldlayer' | 'menu';
  children: EidosNode[];
  [key: string]: any;
}
```

## Best Practices

1. **SSR Compatibility**: Use dynamic imports or browser checks for SvelteKit
2. **Store Management**: Use context for complex applications with multiple instances
3. **Reactive Patterns**: Leverage Svelte's reactivity for spec updates
4. **Actions**: Use custom actions for reusable EIDOS embedding logic
5. **Event Handling**: Use custom events for clean component communication
6. **Performance**: Limit stored events and use derived stores for computed values
7. **Error Handling**: Always handle embedding errors gracefully