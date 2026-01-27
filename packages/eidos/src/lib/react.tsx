import { createContext, useContext, useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';
import { Proxy } from 'valtio/vanilla';
import { EidosSpec } from '../schema/interfaces';
import { render, RenderOptions } from './render';

// Context to hold the EIDOS spec proxy
const EidosSpecContext = createContext<Proxy<EidosSpec> | null>(null);

// Hook to get the spec proxy from context
// Can be used for both reading and mutations - valtio tracks reads automatically
export const useEidosSpec = () => {
    const spec = useContext(EidosSpecContext);
    if (!spec) {
        throw new Error('useEidosSpec must be used within an EidosProvider');
    }
    return spec;
};

// Props for the EidosProvider component
interface EidosProviderProps {
    children: ReactNode;
    initialSpec: EidosSpec;
    options?: Omit<RenderOptions, 'id'>;
    containerStyle?: CSSProperties;
    onInitialized?: (spec: Proxy<EidosSpec>) => void;
}

// Provider component that renders EIDOS and provides spec to children
export const EidosProvider = ({
    children,
    initialSpec,
    options = {},
    containerStyle = { width: '100%', height: '100%', position: 'absolute' },
    onInitialized,
}: EidosProviderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [spec, setSpec] = useState<Proxy<EidosSpec> | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current || initializedRef.current) return;

        initializedRef.current = true;

        const initEidos = async () => {
            try {
                const result = await render(containerRef.current!, initialSpec, options);
                setSpec(result.spec);
                onInitialized?.(result.spec);
            } catch (error) {
                console.error('Failed to initialize EIDOS:', error);
                initializedRef.current = false;
            }
        };

        initEidos();
    }, [initialSpec, options, onInitialized]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={containerRef} style={containerStyle} />
            {spec && (
                <EidosSpecContext.Provider value={spec}>
                    {children}
                </EidosSpecContext.Provider>
            )}
        </div>
    );
};
