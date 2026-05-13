import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Brand = 'hangri' | 'twc';

interface BrandContextValue {
  activeBrand: Brand;
  toggleBrand: () => void;
  isTWC: boolean;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [activeBrand, setActiveBrand] = useState<Brand>('hangri');

  const toggleBrand = useCallback(() => {
    setActiveBrand((prev) => (prev === 'hangri' ? 'twc' : 'hangri'));
  }, []);

  return (
    <BrandContext.Provider value={{ activeBrand, toggleBrand, isTWC: activeBrand === 'twc' }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
