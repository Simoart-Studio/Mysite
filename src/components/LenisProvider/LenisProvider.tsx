'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { registerLenis } from '@/lib/scrollLock';

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ruch ograniczony: zostawiamy natywne przewijanie
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration:     1.25,
      easing:       ease,
      smoothWheel:  true,
      anchors:      true,
    });
    registerLenis(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
