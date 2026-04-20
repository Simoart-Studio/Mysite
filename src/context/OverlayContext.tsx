'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

type OverlayType = 'menu' | 'contact' | null;

interface OverlayCtx {
  overlay: OverlayType;
  openMenu: () => void;
  openContact: () => void;
  close: () => void;
}

const OverlayContext = createContext<OverlayCtx | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayType>(null);

  const openMenu    = useCallback(() => setOverlay('menu'), []);
  const openContact = useCallback(() => setOverlay('contact'), []);
  const close       = useCallback(() => setOverlay(null), []);

  useEffect(() => {
    document.body.style.overflow = overlay ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [overlay]);

  useEffect(() => {
    if (!overlay) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [overlay, close]);

  return (
    <OverlayContext.Provider value={{ overlay, openMenu, openContact, close }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}
