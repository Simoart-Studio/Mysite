'use client';

import { useState, useEffect, useRef } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { BRAND } from '@/data/config';
import { scrollToTarget } from '@/lib/scrollLock';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './Nav.module.scss';

const LINKS = [
  { id: 'works',   label: 'Projekty'   },
  { id: 'uslugi',  label: 'Usługi'     },
  { id: 'process', label: 'Współpraca' },
  { id: 'about',   label: 'O mnie'     },
] as const;

export function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [active, setActive]       = useState<string | null>(null);
  const [heroCta, setHeroCta]     = useState(false);
  const lastY = useRef(0);
  const { overlay, openMenu, close } = useOverlay();
  const prefersReduced = useReducedMotion();
  const menuOpen = overlay === 'menu';


  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const dy = y - lastY.current;
      setNavHidden((prev) => (y < 240 ? false : dy > 4 ? true : dy < -4 ? false : prev));
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Na stronie głównej CTA w nawigacji pojawia się dopiero, gdy przyciski hero znikną z ekranu.
  useEffect(() => {
    const el = document.querySelector('[data-hero-actions]');
    if (!el) { setHeroCta(false); return; }
    const io = new IntersectionObserver(([e]) => setHeroCta(!!e?.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function go(e: React.MouseEvent, id: string) {
    if (!document.getElementById(id)) return;
    e.preventDefault();
    scrollToTarget(id, !!prefersReduced);
    history.replaceState(null, '', `#${id}`);
  }

  return (
    <m.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
      animate={{ y: navHidden && !menuOpen ? '-110%' : '0%' }}
      transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className={styles.inner}>
        <a
          href="/"
          className={styles.logo}
          aria-label={`${BRAND}, strona główna`}
          onClick={(e) => {
            if (window.location.pathname !== '/') return;
            e.preventDefault();
            scrollToTarget(0, !!prefersReduced);
          }}
        >
          SimoArt<span className={styles.logoDot} aria-hidden="true" />
        </a>

        <nav className={styles.links} aria-label="Główna nawigacja">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              className={`${styles.link} ${active === l.id ? styles.linkActive : ''}`}
              aria-current={active === l.id ? 'true' : undefined}
              onClick={(e) => go(e, l.id)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <span className={`${styles.ctaWrap} ${heroCta ? styles.ctaAway : ''}`} inert={heroCta || undefined}>
            <ContactTrigger className={`btn ${styles.cta}`}>
              Porozmawiajmy
              <BtnIcon />
            </ContactTrigger>
          </span>

          <button
            type="button"
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => (menuOpen ? close() : openMenu())}
            aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-overlay"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

    </m.header>
  );
}
