'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { lockScroll, scrollToTarget } from '@/lib/scrollLock';

type OverlayType = 'menu' | null;

export interface ContactPreset {
  goal?: string;
  nonce?: number;
}

interface OverlayCtx {
  overlay: OverlayType;
  contactPreset: ContactPreset;
  openMenu: () => void;
  openContact: (preset?: Omit<ContactPreset, 'nonce'>) => void;
  close: () => void;
}

const OverlayContext = createContext<OverlayCtx | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [contactPreset, setContactPreset] = useState<ContactPreset>({});

  const openMenu = useCallback(() => setOverlay('menu'), []);
  const close    = useCallback(() => setOverlay(null), []);

  const openContact = useCallback((preset: Omit<ContactPreset, 'nonce'> = {}) => {
    if (!document.getElementById('contact')) {
      window.location.href = '/#contact';
      return;
    }
    setOverlay(null);
    setContactPreset({ ...preset, nonce: Date.now() });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => scrollToTarget('contact', reduced), 30);
  }, []);

  useEffect(() => {
    if (!overlay) return;
    return lockScroll();
  }, [overlay]);

  useEffect(() => {
    if (!overlay) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [overlay, close]);

  return (
    <OverlayContext.Provider value={{ overlay, contactPreset, openMenu, openContact, close }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}
