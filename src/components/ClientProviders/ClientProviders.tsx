'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { Cursor } from '@/components/Cursor/Cursor';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactOverlay } from '@/components/ContactOverlay/ContactOverlay';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <OverlayProvider>
      {children}
      <Cursor />
      <MenuOverlay />
      <ContactOverlay />
    </OverlayProvider>
  );
}
