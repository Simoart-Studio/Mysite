'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { NavCta } from '@/components/NavCta/NavCta';
import { BRAND } from '@/data/config';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import styles from './Nav.module.scss';

export function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);
  const { overlay, openMenu, openContact, close } = useOverlay();
  const prefersReduced = useReducedMotion();
  const reducedDom = useReducedMotionSafe();

  const menuOpen = overlay === 'menu';
  const [contactHovered, setContactHovered] = useState(false);
  const CONTACT_LABEL = 'Kontakt';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y > 200) {
        setNavHidden(y > lastY.current);
      } else {
        setNavHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}
      role="banner"
      animate={{ y: navHidden && !menuOpen ? '-100%' : '0%' }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {!reducedDom && (
        <motion.div
          className={styles.progressBar}
          style={{ scaleX, transformOrigin: 'left' }}
        />
      )}

      <div className={styles.inner}>
        <button
          type="button"
          className={styles.logo}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
          }
          aria-label={`${BRAND} — powrót na górę`}
        >
          <span className={styles.logoMain}>SimoArt</span>{' '}
          <span className={styles.logoSub}>studio</span>
        </button>

        <div className={styles.right}>
          <div className={styles.ctaWrap}>
            <NavCta onClick={() => openContact()} />
          </div>

          <button
            type="button"
            className={styles.mobileContact}
            onClick={() => openContact()}
            onMouseEnter={() => setContactHovered(true)}
            onMouseLeave={() => setContactHovered(false)}
            aria-label="Kontakt — napisz do mnie"
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
    </motion.header>
  );
}
