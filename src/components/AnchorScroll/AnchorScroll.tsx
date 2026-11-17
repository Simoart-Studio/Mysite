'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToTarget } from '@/lib/scrollLock';

/** Linki „#sekcja” i „/#sekcja” na stronie głównej przewijają tą samą animacją co nawigacja. */
export function AnchorScroll() {
  const pathname = usePathname();
  const rendered = useRef(pathname);
  useEffect(() => { rendered.current = pathname; }, [pathname]);

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

    /*
     * Wpisy historii bez stanu routera (state === null) tworzy przeglądarka przy zwykłym skoku do kotwicy
     * (np. link „Przejdź do treści”, ręcznie wpisany #adres). Next 16 przy „wstecz/dalej” do takiego wpisu
     * nic nie robi (app-router.js: handlePopState) — adres się zmienia, a na ekranie zostaje poprzednia
     * podstrona. Gdy wpis wskazuje inną ścieżkę niż wyrenderowana, ładujemy ją od nowa.
     */
    const onPop = (e: PopStateEvent) => {
      if (e.state !== null) return;
      if (window.location.pathname === rendered.current) return; // ta sama podstrona, sama kotwica
      window.location.reload();
    };

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, []);
  return null;
}
