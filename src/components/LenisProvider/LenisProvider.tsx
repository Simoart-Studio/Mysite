'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration:     1.25,
      easing:       ease,
      smoothWheel:  true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
