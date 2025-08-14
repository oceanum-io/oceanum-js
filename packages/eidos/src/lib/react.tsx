import { useSnapshot } from 'valtio';
import { Proxy } from 'valtio/vanilla';
import { EidosSpec } from '../schema/interfaces';

export const useEidosSpec = (spec: Proxy<EidosSpec>) => {
    const specSnapshot = useSnapshot(spec);
    return specSnapshot;
};
