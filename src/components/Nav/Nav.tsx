'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { NavCta } from '@/components/NavCta/NavCta';
import styles from './Nav.module.scss';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { overlay, openMenu, openContact, close } = useOverlay();
  const prefersReduced = useReducedMotion();

  const menuOpen = overlay === 'menu';
  const [contactHovered, setContactHovered] = useState(false);
  const CONTACT_LABEL = 'Kontakt';

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
            className={styles.mobileContact}
            onClick={openContact}
            onMouseEnter={() => setContactHovered(true)}
            onMouseLeave={() => setContactHovered(false)}
            aria-label="Napisz do mnie"
          >
            <span className={styles.mobileContactFill} aria-hidden="true" />
            <span className={styles.mobileContactLetters} aria-hidden="true">
              {CONTACT_LABEL.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className={styles.mobileContactChar}
                  animate={
                    prefersReduced ? {} :
                    contactHovered
                      ? { y: [0, -5, 0], transition: { duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }
                      : { y: 0 }
                  }
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className={styles.mobileContactSrOnly}>Kontakt</span>
            <span className={styles.mobileContactArrow} aria-hidden="true">
              <motion.span
                animate={prefersReduced ? {} : contactHovered ? { x: 3 } : { x: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                →
              </motion.span>
            </span>
          </button>

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
