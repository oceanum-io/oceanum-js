# React Integration

This guide shows how to integrate EIDOS JavaScript bindings with React applications.

## Installation

```bash
npm install @oceanum/eidos react react-dom
```

## Basic Hook

Create a custom hook for managing EIDOS instances:

```typescript
// hooks/useEidos.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { embed } from "@oceanum/eidos";

export interface UseEidosOptions {
  spec: any;
  onEvent?: (event: any) => void;
  renderer?: string;
}

export function useEidos({ spec, onEvent, renderer }: UseEidosOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eidos, setEidos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !spec) return;

    const initEidos = async () => {
      try {
        setLoading(true);
        setError(null);

        const instance = await embed(
          containerRef.current!,
          spec,
          onEvent,
          renderer
        );

        setEidos(instance);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initEidos();
  }, [spec, onEvent, renderer]);

  const updateSpec = useCallback(
    (updates: any) => {
      if (!eidos) return;

      // Natural object mutation - changes propagate automatically
      Object.assign(eidos, updates);
    },
    [eidos]
  );

  return {
    containerRef,
    eidos,
    loading,
    error,
    updateSpec,
  };
}
```

## Basic Component

```typescript
// components/EidosViewer.tsx
import { CSSProperties } from 'react';
import { useEidos } from '../hooks/useEidos';

interface EidosViewerProps {
  spec: any;
  onEvent?: (event: any) => void;
  className?: string;
}

export function EidosViewer({ spec, onEvent, className }: EidosViewerProps) {
  const { containerRef, loading, error } = useEidos({ spec, onEvent });

  if (error) {
    return (
      <div className="eidos-error">
        <p>Failed to load EIDOS visualization:</p>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div className={className}>
      {loading && <div className="eidos-loading">Loading visualization...</div>}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
```

## Interactive Example

```typescript
// components/InteractiveEidos.tsx
import React, { useState } from 'react';
import { useEidos } from '../hooks/useEidos';

const initialSpec = {
  id: 'interactive-demo',
  name: 'Interactive Demo',
  root: {
    id: 'root',
    nodeType: 'world',
    children: []
  },
  data: [],
  transforms: []
};

export function InteractiveEidos() {
  const [events, setEvents] = useState<any[]>([]);

  const { containerRef, eidos, loading, error } = useEidos({
    spec: initialSpec,
    onEvent: (event) => {
      setEvents(prev => [...prev.slice(-10), event]); // Keep last 10 events
    }
  });

  const addLayer = () => {
    if (!eidos) return;

    // Add a new layer to the visualization
    eidos.root.children.push({
      id: `layer-${Date.now()}`,
      nodeType: 'worldlayer',
      layerType: 'track',
      data: { url: 'https://example.com/track-data.json' }
    });
  };

  const updateTitle = () => {
    if (!eidos) return;

    // Update the visualization title
    eidos.name = `Updated at ${new Date().toLocaleTimeString()}`;
  };

  return (
    <div style={{ display: 'flex', height: '600px' }}>
      {/* Visualization */}
      <div style={{ flex: 1 }}>
        {error && <div>Error: {error}</div>}
        {loading && <div>Loading...</div>}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Controls */}
      <div style={{ width: '300px', padding: '20px' }}>
        <h3>Controls</h3>
        <button onClick={addLayer}>Add Layer</button>
        <button onClick={updateTitle}>Update Title</button>

        <h4>Recent Events</h4>
        <div style={{ height: '200px', overflow: 'auto' }}>
          {events.map((event, i) => (
            <div key={i} style={{ fontSize: '12px', marginBottom: '5px' }}>
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## State Management Integration

### With Redux Toolkit

```typescript
// store/eidosSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { embed } from "@oceanum/eidos";

export const createEidosInstance = createAsyncThunk(
  "eidos/create",
  async ({ container, spec }: { container: HTMLElement; spec: any }) => {
    return await embed(container, spec);
  }
);

const eidosSlice = createSlice({
  name: "eidos",
  initialState: {
    instance: null,
    loading: false,
    error: null,
    events: [],
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateSpec: (state, action) => {
      if (state.instance) {
        Object.assign(state.instance, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEidosInstance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEidosInstance.fulfilled, (state, action) => {
        state.loading = false;
        state.instance = action.payload;
      })
      .addCase(createEidosInstance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addEvent, updateSpec } = eidosSlice.actions;
export default eidosSlice.reducer;
```

### With Zustand

```typescript
// store/eidosStore.ts
import { create } from "zustand";
import { embed } from "@oceanum/eidos";

interface EidosStore {
  instance: any;
  loading: boolean;
  error: string | null;
  events: any[];

  createInstance: (container: HTMLElement, spec: any) => Promise<void>;
  updateSpec: (updates: any) => void;
  addEvent: (event: any) => void;
}

export const useEidosStore = create<EidosStore>((set, get) => ({
  instance: null,
  loading: false,
  error: null,
  events: [],

  createInstance: async (container, spec) => {
    set({ loading: true, error: null });
    try {
      const instance = await embed(container, spec, (event) => {
        get().addEvent(event);
      });
      set({ instance, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateSpec: (updates) => {
    const { instance } = get();
    if (instance) {
      Object.assign(instance, updates);
    }
  },

  addEvent: (event) => {
    set((state) => ({
      events: [...state.events.slice(-50), event],
    }));
  },
}));
```

## Error Boundaries

```typescript
// components/EidosErrorBoundary.tsx
import { ErrorBoundary, ReactNode, ComponentType } from 'react';

interface EidosErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error }>;
}

const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
    <h3>EIDOS Visualization Error</h3>
    <details>
      <summary>Error Details</summary>
      <pre>{error.message}</pre>
    </details>
  </div>
);

export function EidosErrorBoundary({
  children,
  fallback: Fallback = DefaultErrorFallback
}: EidosErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={Fallback}>
      {children}
    </ErrorBoundary>
  );
}
```

## TypeScript Types

```typescript
// types/eidos.ts
export interface EidosSpec {
  id: string;
  name: string;
  root: EidosNode;
  data: EidosDataSource[];
  transforms: EidosTransform[];
  modalNodes?: EidosNode[];
}

export interface EidosNode {
  id: string;
  nodeType: "grid" | "world" | "plot" | "worldlayer" | "menu";
  children: EidosNode[];
  [key: string]: any;
}

export interface EidosDataSource {
  id: string;
  url?: string;
  data?: any;
  [key: string]: any;
}

export interface EidosTransform {
  id: string;
  type: string;
  [key: string]: any;
}

export interface EidosEvent {
  type: string;
  payload: any;
  timestamp: number;
}
```

## Best Practices

1. **Memoize Specs**: Use `useMemo` for specs to prevent unnecessary re-renders
2. **Event Cleanup**: Store events in a limited array to prevent memory leaks
3. **Error Handling**: Always wrap EIDOS components in error boundaries
4. **Loading States**: Provide visual feedback during EIDOS initialization
5. **Natural Mutations**: Use direct object assignment for spec updates - the library handles reactivity

## Next.js Integration

```typescript
// components/EidosViewer.tsx (Next.js)
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const EidosViewer = dynamic(
  () => import('./EidosViewer').then(mod => mod.EidosViewer),
  {
    ssr: false,
    loading: () => <div>Loading EIDOS visualization...</div>
  }
);

export default EidosViewer;
```
