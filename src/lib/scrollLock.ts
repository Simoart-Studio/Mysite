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

export function scrollToTarget(target: string | 0, reduced = false) {
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  if (target === 0) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(target.replace(/^#/, ''));
  if (!el) return;
  el.scrollIntoView({ behavior, block: 'start' });
}
