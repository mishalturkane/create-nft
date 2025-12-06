import { createContext, useContext } from 'react';
import { Umi } from '@metaplex-foundation/umi';

interface UmiContextType {
  umi: Umi | null;
}

export const UmiContext = createContext<UmiContextType>({ umi: null });

export const useUmi = () => {
  const context = useContext(UmiContext);
  if (!context) {
    throw new Error('useUmi must be used within a UmiProvider');
  }
  return context;
};