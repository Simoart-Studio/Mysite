'use client';

import { useEffect } from 'react';

const SELECTOR = '[data-reveal]:not(.is-in)';

/**
 * Odsłania elementy `[data-reveal]`, gdy wejdą na ekran.
 *
 * Komponent żyje w głównym layoucie, więc montuje się RAZ na całą sesję. Po nawigacji po stronie klienta
 * (np. /works → logo → /) React buduje nowe elementy, których jednorazowy skan by nie zobaczył — zostałyby
 * na zawsze z opacity: 0. Dlatego MutationObserver dopina do obserwacji każdy nowo dodany element.
 */
export function RevealObserver() {
  useEffect(() => {
    document.documentElement.classList.add('js');

    if (!('IntersectionObserver' in window)) {
      const showAll = () => document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => el.classList.add('is-in'));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();

    // skan raz na klatkę, niezależnie od liczby mutacji
    let raf = 0;
    const mo = new MutationObserver((records) => {
      if (raf) return;
      if (!records.some((r) => r.addedNodes.length)) return;
      raf = requestAnimationFrame(() => { raf = 0; scan(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { mo.disconnect(); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return null;
}
