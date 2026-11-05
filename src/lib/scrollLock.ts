'use client';

let locks = 0;
let savedPadding = '';

export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    savedPadding = document.body.style.paddingRight;
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    document.documentElement.style.overflow = 'hidden';
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = savedPadding;
    }
  };
}

let cancelAnim: (() => void) | null = null;

function navOffset() {
  const nav = document.querySelector('header[role=banner]') as HTMLElement | null;
  return (nav?.offsetHeight ?? 88) + 16;
}

function targetY(target: string | 0) {
  if (target === 0) return 0;
  const el = document.getElementById(target.replace(/^#/, ''));
  if (!el) return null;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = el.getBoundingClientRect().top + window.scrollY - navOffset();
  return Math.max(0, Math.min(max, Math.round(y)));
}

/**
 * Przewija do sekcji albo na samą górę.
 * Własna animacja (zamiast scroll-behavior: smooth), bo Safari potrafi przerwać
 * natywne płynne przewijanie przy zmianie wysokości okna i zatrzymać się przed celem.
 */
export function scrollToTarget(target: string | 0, reduced = false) {
  cancelAnim?.();
  const root = document.documentElement;
  const first = targetY(target);
  if (first === null) return;

  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  const restore = () => { root.style.scrollBehavior = prevBehavior; };

  if (reduced) {
    window.scrollTo(0, first);
    restore();
    return;
  }

  const startY = window.scrollY;
  const distance = Math.abs(first - startY);
  const duration = Math.min(1100, Math.max(400, distance * 0.35));
  const t0 = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  let raf = 0;
  let stopped = false;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchstart', stop);
    window.removeEventListener('keydown', stop);
    restore();
    cancelAnim = null;
  };
  cancelAnim = stop;
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);

  const step = (now: number) => {
    const goal = targetY(target) ?? first;
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, Math.round(startY + (goal - startY) * ease(t)));
    if (t < 1) { raf = requestAnimationFrame(step); return; }
    window.scrollTo(0, goal);
    stop();
  };
  raf = requestAnimationFrame(step);
}
