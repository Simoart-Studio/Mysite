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

/** Przewiń do sekcji (lub na górę) z odstępem pod przyklejoną nawigacją. */
export function scrollToTarget(target: string | 0, reduced = false) {
  const navH = (document.querySelector('header[role=banner]') as HTMLElement | null)?.offsetHeight ?? 72;
  if (target === 0) {
    if (lenis) lenis.scrollTo(0, { immediate: reduced });
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }
  const el = document.getElementById(target.replace(/^#/, ''));
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -(navH + 16), immediate: reduced });
  else {
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }
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
