'use client';

import type Lenis from 'lenis';

let lenis: Lenis | null = null;
let locks = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Blokuje przewijanie strony (np. pod modalem). Liczy blokady, więc modale mogą się zagnieżdżać. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = 'hidden';
    lenis?.stop();
  }
  return () => {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.overflow = '';
      lenis?.start();
    }
  };
}
