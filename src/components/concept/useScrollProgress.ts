'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * pin   — sekcja przypięta: 0 gdy jej góra dotyka góry ekranu, 1 gdy jej dół dotyka dołu.
 * pass  — 0 gdy sekcja wchodzi od dołu, 1 gdy całkiem wyjdzie górą.
 * leave — 0 na starcie, 1 gdy sekcja całkiem wyjdzie górą (dla pierwszego ekranu).
 */
export type ScrollMode = 'pin' | 'pass' | 'leave';
type OnFrame = (p: number, rect: DOMRect) => void;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Postęp przewijania sekcji jako zmienna CSS `--p` (0–1), liczony raz na klatkę. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: ScrollMode, onFrame?: OnFrame) {
  const cb = useRef(onFrame);
  useEffect(() => { cb.current = onFrame; });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === 'pin' ? clamp01(-r.top / Math.max(1, r.height - vh))
        : mode === 'leave' ? clamp01(-r.top / Math.max(1, r.height))
        : clamp01((vh - r.top) / (r.height + vh));
      el.style.setProperty('--p', p.toFixed(4));
      cb.current?.(p, r);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [ref, mode]);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
