'use client';

import { useEffect } from 'react';
import { scrollToTarget } from '@/lib/scrollLock';

/** Linki „#sekcja” i „/#sekcja” na stronie głównej przewijają tą samą animacją co nawigacja. */
export function AnchorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null;
      if (!a || window.location.pathname !== '/') return;
      const id = a.getAttribute('href')!.split('#')[1];
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollToTarget(id, reduced);
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
