'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { NavCta } from '@/components/NavCta/NavCta';
import styles from './Nav.module.scss';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { overlay, openMenu, openContact, close } = useOverlay();
  const prefersReduced = useReducedMotion();

  const menuOpen = overlay === 'menu';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.logo}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
          }
          aria-label="Szymon Pochopień — powrót na górę"
        >
          SP
        </button>

        <div className={styles.right}>
          <div className={styles.ctaWrap}>
            <NavCta onClick={openContact} />
          </div>

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
    </header>
  );
}
