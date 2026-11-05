'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { RevealObserver } from '@/components/RevealObserver/RevealObserver';
import { AnchorScroll } from '@/components/AnchorScroll/AnchorScroll';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <OverlayProvider>
      {children}
      <RevealObserver />
      <AnchorScroll />
      <MenuOverlay />
    </OverlayProvider>
  );
}
