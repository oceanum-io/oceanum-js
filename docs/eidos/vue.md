# Vue.js Integration

This guide shows how to integrate EIDOS JavaScript bindings with Vue.js applications using the Composition API.

## Installation

```bash
npm install @oceanum/eidos vue
```

## Composable

Create a reusable composable for EIDOS management:

```typescript
// composables/useEidos.ts
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';
import { embed } from '@oceanum/eidos';

export interface UseEidosOptions {
  spec: Ref<any> | any;
  onEvent?: (event: any) => void;
  renderer?: string;
}

export function useEidos({ spec, onEvent, renderer }: UseEidosOptions) {
  const container = ref<HTMLElement>();
  const eidos = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const createInstance = async () => {
    if (!container.value) return;
    
    try {
      loading.value = true;
      error.value = null;
      
      const specValue = typeof spec === 'object' && 'value' in spec ? spec.value : spec;
      
      const instance = await embed(
        container.value,
        specValue,
        onEvent,
        renderer
      );
      
      eidos.value = instance;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const updateSpec = (updates: any) => {
    if (!eidos.value) return;
    
    // Natural object mutation - changes propagate automatically
    Object.assign(eidos.value, updates);
  };

  onMounted(() => {
    createInstance();
  });

  // Watch for spec changes if it's reactive
  if (typeof spec === 'object' && 'value' in spec) {
    watch(spec, createInstance, { deep: true });
  }

  return {
    container,
    eidos: readonly(eidos),
    loading: readonly(loading),
    error: readonly(error),
    updateSpec
  };
}
```

## Basic Component

```vue
<!-- components/EidosViewer.vue -->
<template>
  <div class="eidos-viewer" :class="{ loading }">
    <div v-if="error" class="eidos-error">
      <p>Failed to load EIDOS visualization:</p>
      <pre>{{ error }}</pre>
    </div>
    
    <div v-if="loading" class="eidos-loading">
      Loading visualization...
    </div>
    
    <div 
      ref="container" 
      class="eidos-container"
      :style="{ width: '100%', height: '100%' }"
    />
  </div>
</template>

<script setup lang="ts">
import { useEidos } from '../composables/useEidos';

interface Props {
  spec: any;
  renderer?: string;
}

interface Emits {
  (e: 'event', event: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { container, loading, error } = useEidos({
  spec: props.spec,
  onEvent: (event) => emit('event', event),
  renderer: props.renderer
});
</script>

<style scoped>
.eidos-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}

.eidos-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.eidos-error {
  padding: 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  margin: 10px;
}

.eidos-error pre {
  font-size: 12px;
  overflow: auto;
}
</style>
```

## Interactive Example

```vue
<!-- components/InteractiveEidos.vue -->
<template>
  <div class="interactive-eidos">
    <div class="visualization">
      <EidosViewer 
        :spec="spec" 
        @event="handleEvent"
      />
    </div>
    
    <div class="controls">
      <h3>Controls</h3>
      
      <div class="control-group">
        <button @click="addLayer">Add Layer</button>
        <button @click="updateTitle">Update Title</button>
        <button @click="clearEvents">Clear Events</button>
      </div>
      
      <div class="spec-editor">
        <h4>Spec Name</h4>
        <input 
          v-model="spec.name" 
          placeholder="Visualization name"
        />
      </div>
      
      <div class="events">
        <h4>Recent Events ({{ events.length }})</h4>
        <div class="event-list">
          <div 
            v-for="(event, index) in events" 
            :key="index"
            class="event-item"
          >
            <pre>{{ JSON.stringify(event, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import EidosViewer from './EidosViewer.vue';

const spec = reactive({
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

const events = ref<any[]>([]);

const handleEvent = (event: any) => {
  events.value.unshift({
    ...event,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 10 events
  if (events.value.length > 10) {
    events.value = events.value.slice(0, 10);
  }
};

const addLayer = () => {
  spec.root.children.push({
    id: `layer-${Date.now()}`,
    nodeType: 'worldlayer',
    layerType: 'track',
    data: { url: 'https://example.com/track-data.json' }
  });
};

const updateTitle = () => {
  spec.name = `Updated at ${new Date().toLocaleTimeString()}`;
};

const clearEvents = () => {
  events.value = [];
};
</script>

<style scoped>
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

## Pinia Store Integration

```typescript
// stores/eidos.ts
import { defineStore } from 'pinia';
import { embed } from '@oceanum/eidos';

interface EidosState {
  instances: Record<string, any>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  events: any[];
}

export const useEidosStore = defineStore('eidos', {
  state: (): EidosState => ({
    instances: {},
    loading: {},
    errors: {},
    events: []
  }),

  actions: {
    async createInstance(
      id: string, 
      container: HTMLElement, 
      spec: any,
      renderer?: string
    ) {
      this.loading[id] = true;
      this.errors[id] = null;

      try {
        const instance = await embed(container, spec, (event) => {
          this.addEvent(event);
        }, renderer);

        this.instances[id] = instance;
      } catch (error: any) {
        this.errors[id] = error.message;
      } finally {
        this.loading[id] = false;
      }
    },

    updateSpec(id: string, updates: any) {
      const instance = this.instances[id];
      if (instance) {
        Object.assign(instance, updates);
      }
    },

    addEvent(event: any) {
      this.events.unshift({
        ...event,
        timestamp: Date.now()
      });

      // Keep only last 100 events
      if (this.events.length > 100) {
        this.events = this.events.slice(0, 100);
      }
    },

    removeInstance(id: string) {
      delete this.instances[id];
      delete this.loading[id];
      delete this.errors[id];
    }
  },

  getters: {
    getInstance: (state) => (id: string) => state.instances[id],
    isLoading: (state) => (id: string) => state.loading[id] || false,
    getError: (state) => (id: string) => state.errors[id],
    recentEvents: (state) => state.events.slice(0, 10)
  }
});
```

## Vue Component with Pinia

```vue
<!-- components/EidosWithPinia.vue -->
<template>
  <div class="eidos-with-pinia">
    <div 
      ref="container"
      class="eidos-container"
    />
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEidosStore } from '../stores/eidos';

interface Props {
  spec: any;
  instanceId: string;
  renderer?: string;
}

const props = defineProps<Props>();
const container = ref<HTMLElement>();
const eidosStore = useEidosStore();

const loading = computed(() => eidosStore.isLoading(props.instanceId));
const error = computed(() => eidosStore.getError(props.instanceId));
const instance = computed(() => eidosStore.getInstance(props.instanceId));

onMounted(() => {
  if (container.value) {
    eidosStore.createInstance(
      props.instanceId,
      container.value,
      props.spec,
      props.renderer
    );
  }
});

// Expose instance for parent component access
defineExpose({
  instance,
  updateSpec: (updates: any) => eidosStore.updateSpec(props.instanceId, updates)
});
</script>

<style scoped>
.eidos-container {
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

## Options API Example

```vue
<!-- components/EidosOptionsAPI.vue -->
<template>
  <div class="eidos-options">
    <div 
      ref="container"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { embed } from '@oceanum/eidos';

export default defineComponent({
  name: 'EidosOptionsAPI',
  
  props: {
    spec: {
      type: Object as PropType<any>,
      required: true
    },
    renderer: {
      type: String,
      default: undefined
    }
  },

  emits: ['event', 'error'],

  data() {
    return {
      eidos: null as any,
      loading: true,
      error: null as string | null
    };
  },

  async mounted() {
    try {
      this.loading = true;
      this.error = null;

      this.eidos = await embed(
        this.$refs.container as HTMLElement,
        this.spec,
        (event: any) => this.$emit('event', event),
        this.renderer
      );
    } catch (err: any) {
      this.error = err.message;
      this.$emit('error', err);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    updateSpec(updates: any) {
      if (this.eidos) {
        Object.assign(this.eidos, updates);
      }
    }
  },

  watch: {
    spec: {
      handler() {
        // Recreate instance when spec changes
        this.$nextTick(() => {
          if (this.$refs.container) {
            this.mounted();
          }
        });
      },
      deep: true
    }
  }
});
</script>
```

## TypeScript Support

```typescript
// types/eidos.d.ts
declare module '@oceanum/eidos' {
  export interface EidosInstance {
    id: string;
    name: string;
    root: any;
    data: any[];
    transforms: any[];
    [key: string]: any;
  }

  export function embed(
    container: HTMLElement,
    spec: any,
    onEvent?: (event: any) => void,
    renderer?: string
  ): Promise<EidosInstance>;
}
```

## Nuxt.js Integration

```vue
<!-- components/EidosViewer.client.vue -->
<template>
  <div class="eidos-nuxt">
    <ClientOnly>
      <EidosViewer 
        :spec="spec"
        @event="handleEvent"
      />
      <template #fallback>
        <div class="loading">Loading EIDOS...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// This component will only render on client-side
const props = defineProps<{
  spec: any;
}>();

const handleEvent = (event: any) => {
  console.log('EIDOS event:', event);
};
</script>
```

## Best Practices

1. **Reactive Specs**: Use `reactive()` for specs that need deep reactivity
2. **Component Keys**: Use unique keys when spec changes require full re-initialization
3. **Event Handling**: Limit stored events to prevent memory leaks
4. **SSR**: Use `ClientOnly` in Nuxt.js or dynamic imports in other SSR frameworks
5. **Error Boundaries**: Implement proper error handling for visualization failures
6. **Performance**: Use `readonly()` for computed values that shouldn't be mutated