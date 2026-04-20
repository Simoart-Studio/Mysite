'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import styles from './MenuOverlay.module.scss';

const WAVE_EASE = [0.76, 0, 0.24, 1] as const;

const NAV_ITEMS = [
  { href: '/#works',   label: 'Realizacje', num: '01' },
  { href: '/#about',   label: 'O mnie',     num: '02' },
  { href: '/#contact', label: 'Kontakt',    num: '03' },
] as const;

export function MenuOverlay() {
  const { overlay, close, openContact } = useOverlay();
  const prefersReduced = useReducedMotion();
  const closeRef       = useRef<HTMLButtonElement>(null);

  const isOpen = overlay === 'menu';

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  const dur   = prefersReduced ? 0 : 0.75;
  const skew  = prefersReduced ? 0 : 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu główne"
          className={styles.overlay}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: prefersReduced ? 0 : 0.65, ease: WAVE_EASE }}
        >
          {/* Header row */}
          <div className={styles.topBar}>
            <span className={styles.logoMark} aria-hidden="true">SP</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Zamknij menu"
            >
              <span className={styles.closeLabel}>Zamknij</span>
              <span className={styles.closeX} aria-hidden="true">
                <span /><span />
              </span>
            </button>
          </div>

          {/* Nav items — wave reveal */}
          <nav className={styles.nav} aria-label="Nawigacja główna">
            {NAV_ITEMS.map(({ href, label, num }, i) => (
              <div key={href} className={styles.itemWrap}>
                <motion.div
                  initial={{ y: '105%', skewY: skew }}
                  animate={{ y: 0, skewY: 0 }}
                  exit={{ y: '105%', skewY: skew }}
                  transition={{
                    duration: dur,
                    delay: prefersReduced ? 0 : 0.1 + i * 0.08,
                    ease: WAVE_EASE,
                  }}
                >
                  <Link
                    href={href}
                    className={styles.navItem}
                    onClick={close}
                  >
                    <span className={styles.navNum} aria-hidden="true">{num}</span>
                    <span className={styles.navLabel}>{label}</span>
                  </Link>
                </motion.div>
              </div>
            ))}
          </nav>

          {/* Bottom bar */}
          <motion.div
            className={styles.bottom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : 0.45 }}
          >
            <span className={styles.tagline}>Z Polski dla świata.</span>
            <button
              type="button"
              className={styles.contactBtn}
              onClick={() => { close(); openContact(); }}
            >
              Napisz do mnie →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
