import React, { useRef, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useSnapshot } from 'valtio';
import { proxy } from 'valtio/vanilla';
import { validateSchema } from './eidosmodel';
import { EidosSpec } from '../schema/interfaces';
import { render } from './render';

// Context for sharing the Eidos proxy across the application
interface EidosContextValue {
  proxy: object | null;
  setProxy: (spec: object) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EidosContext = createContext<EidosContextValue | null>(null);

// Provider component that manages the Eidos proxy state
interface EidosProviderProps {
  children: ReactNode;
  initialSpec?: object;
}

const EidosProvider: React.FC<EidosProviderProps> = ({ children, initialSpec }) => {
  const [eidosProxy, setEidosProxy] = useState<EidosSpec>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setProxy = async (spec: EidosSpec) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate the spec before creating proxy
      await validateSchema(spec);
      
      // Create Valtio proxy
      const newProxy = proxy(structuredClone(spec));
      setEidosProxy(newProxy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Eidos proxy');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with initial spec if provided
  useEffect(() => {
    if (initialSpec && !eidosProxy) {
      setProxy(initialSpec);
    }
  }, [initialSpec, eidosProxy]);

  const contextValue: EidosContextValue = {
    proxy: eidosProxy,
    setProxy,
    isLoading,
    error
  };

  return (
    <EidosContext.Provider value={contextValue}>
      {children}
    </EidosContext.Provider>
  );
};

// Unified hook that provides all Eidos functionality
interface UseEidosReturn<T extends object = object> {
  // State
  specSnapshot: T; // Reactive snapshot
  spec: T; // Proxy for mutations
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSpec: (spec: EidosSpec) => Promise<void>;
  
  // Component
  EidosRenderer: React.FC<Omit<EidosRendererProps, 'spec' | 'useProvider'>>;
}

const useEidos = <T extends object = object>(): UseEidosReturn<T> => {
  const context = useContext(EidosContext);
  if (!context) {
    throw new Error('useEidos must be used within an EidosProvider');
  }
  
  const { proxy, setProxy, isLoading, error } = context;
  const spec = useSnapshot(proxy as T);
  
  // Create a bound EidosRenderer component that automatically uses the provider
  const BoundEidosRenderer: React.FC<Omit<EidosRendererProps, 'spec' | 'useProvider'>> = (props) => (
    <EidosRenderer {...props} useProvider={true} />
  );
  
  return {
    specSnapshot: spec,
    spec: proxy as T,
    isLoading,
    error,
    setSpec: setProxy,
    EidosRenderer: BoundEidosRenderer
  };
};



interface EidosRendererProps {
  spec?: EidosSpec; // Optional when using provider
  onEvent?: (payload: unknown) => void;
  renderer?: string;
  style?: React.CSSProperties;
  className?: string;
  useProvider?: boolean; // Whether to use the provider or manage state locally
}

/**
 * React component that renders an Eidos specification and reacts to changes
 * @param spec The Eidos specification object
 * @param onEvent Optional callback for handling events from the renderer
 * @param renderer Optional custom renderer URL
 * @param style Optional CSS styles for the container
 * @param className Optional CSS class name for the container
 */
const EidosRenderer: React.FC<EidosRendererProps> = ({
spec,
  onEvent,
  renderer,
  style,
  className,
  useProvider = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!useProvider && !spec) {
    throw new Error('EidosRenderer requires either spec prop or useProvider=true');
  }
  
  // Get state from provider when using provider mode
  const eidosHook = useProvider ? useEidos() : null;
  const initSpec = useProvider ? eidosHook?.spec : spec;

  // Initialize the renderer when component mounts or spec changes
  useEffect(() => {
    if (!containerRef.current) return;
    if (useProvider && !initSpec) return; // Wait for provider to have spec
    if (!useProvider && !spec) return; // Need spec when not using provider

    const initializeRenderer = async () => {
      try {
        // Clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        // Use spec from props or provider
        const specToRender = initSpec || spec;
        if (!specToRender) return;
        
        // Render the Eidos spec
        if (!containerRef.current) return;
        const proxySpec = await render(
          containerRef.current,
          specToRender,
          onEvent,
          renderer
        );
        
        // If using provider, update the provider's spec with the proxy
        if (useProvider && eidosHook) {
          eidosHook.setSpec(proxySpec);
        }
      } catch (err) {
        console.error('Failed to render Eidos spec:', err);
      }
    };

    initializeRenderer();
  }, [spec, onEvent, renderer, useProvider, initSpec]);

  // Get error state for display
  const error = useProvider ? eidosHook?.error : null;

  if (error) {
    return (
      <div 
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          ...style
        }}
      >
        <div>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style
      }}
    >
      
    </div>
  );
};

export {
  EidosProvider,
  useEidos,
};
export type { EidosProviderProps, UseEidosReturn };
