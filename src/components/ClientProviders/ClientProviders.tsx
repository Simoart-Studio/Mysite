'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { LenisProvider } from '@/components/LenisProvider/LenisProvider';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { RevealObserver } from '@/components/RevealObserver/RevealObserver';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <OverlayProvider>
        {children}
        <RevealObserver />
        <MenuOverlay />
      </OverlayProvider>
    </LenisProvider>
  );
}
