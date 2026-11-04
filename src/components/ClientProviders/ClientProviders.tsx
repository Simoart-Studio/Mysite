'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { RevealObserver } from '@/components/RevealObserver/RevealObserver';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <OverlayProvider>
      {children}
      <RevealObserver />
      <MenuOverlay />
    </OverlayProvider>
  );
}
