'use client';

import type { ReactNode } from 'react';
import { LazyMotion } from 'framer-motion';
import { OverlayProvider } from '@/context/OverlayContext';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { RevealObserver } from '@/components/RevealObserver/RevealObserver';
import { AnchorScroll } from '@/components/AnchorScroll/AnchorScroll';

const loadMotionFeatures = () => import('@/lib/motionFeatures').then((m) => m.default);

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <OverlayProvider>
      {children}
      <RevealObserver />
      <AnchorScroll />
      <MenuOverlay />
    </OverlayProvider>
    </LazyMotion>
  );
}
