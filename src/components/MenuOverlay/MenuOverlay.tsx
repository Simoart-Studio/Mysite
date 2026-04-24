'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import styles from './MenuOverlay.module.scss';

const E_WAVE = [0.76, 0, 0.24, 1] as const;
const E_SOFT = [0.22, 1, 0.36, 1] as const;

/*
 * Koordynaty SVG w viewBox="0 0 1440 760".
 * preserveAspectRatio="none" → punkt (x,y) = CSS left:x/1440*100%, top:y/760*100%
 * Dzięki temu dotLeft i dotTop są gwarantowanym przybliżeniem punktu końcowego gałęzi.
 */
type Item = {
  href:      string;
  label:     string;
  branch:    string;
  twig:      string | null;
  junctionY: number;
  dotLeft:   string;  // CSS left: X% — musi odpowiadać SVG x/1440*100
  dotTop:    string;  // CSS top: Y% — musi odpowiadać SVG y/760*100
  swingDir:  1 | -1;  // kierunek wychylenia wahadła (+1 = prawo, -1 = lewo)
  tBranch:   number;
  tItem:     number;
};

const ITEMS: Item[] = [
  {
    href:      '/#works',
    label:     'Realizacje',
    // endpoint (216, 99) → 216/1440=15%, 99/760=13%
    branch:    'M 720,200 C 570,172 370,126 216,99',
    twig:      'M 450,152 C 375,139 305,128 248,120',
    junctionY: 200,
    dotLeft:   '15%',
    dotTop:    '13%',
    swingDir:  -1,
    tBranch:   0.72,
    tItem:     1.48,
  },
  {
    href:      '/#about',
    label:     'O mnie',
    // endpoint (1224, 114) → 85%, 15%
    branch:    'M 720,290 C 875,262 1060,172 1224,114',
    twig:      'M 968,207 C 1048,190 1118,172 1168,159',
    junctionY: 290,
    dotLeft:   '85%',
    dotTop:    '15%',
    swingDir:  1,
    tBranch:   0.92,
    tItem:     1.68,
  },
  {
    href:      '/#process',
    label:     'Jak pracuję',
    // endpoint (202, 403) → 14%, 53%
    branch:    'M 720,440 C 555,430 368,416 202,403',
    twig:      null,
    junctionY: 440,
    dotLeft:   '14%',
    dotTop:    '53%',
    swingDir:  -1,
    tBranch:   1.12,
    tItem:     1.88,
  },
  {
    href:      '/#contact',
    label:     'Kontakt',
    // endpoint (1238, 502) → 86%, 66%
    branch:    'M 720,540 C 892,530 1082,514 1238,502',
    twig:      null,
    junctionY: 540,
    dotLeft:   '86%',
    dotTop:    '66%',
    swingDir:  1,
    tBranch:   1.32,
    tItem:     2.08,
  },
];

const TRUNK = 'M 720,748 C 717,590 723,400 720,52';

export function MenuOverlay() {
  const { overlay, close, openContact } = useOverlay();
  const prefersReduced = useReducedMotion();
  const closeRef       = useRef<HTMLButtonElement>(null);
  const isOpen         = overlay === 'menu';

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  const d = (t: number) => prefersReduced ? 0 : t;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu główne"
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: d(0.2) }}
        >
          {/* ─── Top bar ─── */}
          <div className={styles.topBar}>
            <span className={styles.logoMark} aria-hidden="true">SP</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Zamknij menu"
            >
              ✕
            </button>
          </div>

          {/* ─── Drzewo ─── */}
          <div className={styles.treeArea}>

            {/* SVG — pień + gałęzie */}
            <svg
              viewBox="0 0 1440 760"
              preserveAspectRatio="none"
              className={styles.treeSvg}
              aria-hidden="true"
            >
              {/* Pień */}
              <motion.path
                d={TRUNK}
                className={styles.trunk}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: d(1.1), delay: d(0.1), ease: 'easeInOut' }}
              />

              {ITEMS.map((item) => (
                <g key={item.href}>
                  {/* punkt przyłączenia gałęzi do pnia */}
                  <motion.circle
                    cx={720} cy={item.junctionY} r={4}
                    className={styles.junctionDot}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: d(0.3), delay: d(item.tBranch), ease: E_SOFT }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                  {/* gałąź główna */}
                  <motion.path
                    d={item.branch}
                    className={styles.branch}
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: d(0.72), delay: d(item.tBranch), ease: E_WAVE }}
                  />
                  {/* odnoga */}
                  {item.twig && (
                    <motion.path
                      d={item.twig}
                      className={styles.twig}
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: d(0.42), delay: d(item.tBranch + 0.22), ease: E_WAVE }}
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Zawieszki — dot + linka + label, centrowane na końcu gałęzi */}
            <nav className={styles.treeNav} aria-label="Nawigacja główna">
              {ITEMS.map((item) => (
                <motion.div
                  key={item.href}
                  className={styles.ornament}
                  style={{ left: item.dotLeft, top: item.dotTop }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: d(0.15), delay: d(item.tItem) }}
                >
                  {/* wahadło — obraca się wokół górnego punktu przyczepu */}
                  <motion.div
                    className={styles.hangGroup}
                    initial={{ rotate: prefersReduced ? 0 : item.swingDir * 18 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: prefersReduced ? 0 : item.swingDir * -4 }}
                    transition={{
                      rotate: {
                        type:      'spring',
                        stiffness: 80,
                        damping:   12,
                        delay:     d(item.tItem),
                      },
                    }}
                  >
                    {/* mały punkt przyczepu */}
                    <span className={styles.hangDot} aria-hidden="true" />
                    {/* linka */}
                    <span className={styles.hangString} aria-hidden="true" />
                    {/* etykieta */}
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </nav>

            {/* Mobile nav */}
            <nav className={styles.mobileNav} aria-label="Nawigacja główna">
              {ITEMS.map((item, i) => (
                <div key={item.href} className={styles.mobileItem}>
                  <motion.div
                    className={styles.mobileRow}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: d(0.7), delay: d(0.06 + i * 0.12), ease: E_WAVE }}
                  >
                    <span className={styles.mobileNum} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Link href={item.href} className={styles.mobileLink} onClick={close}>
                      {item.label}
                    </Link>
                    <span className={styles.mobileArrow} aria-hidden="true">→</span>
                  </motion.div>
                </div>
              ))}
            </nav>
          </div>

          {/* ─── Bottom ─── */}
          <motion.div
            className={styles.bottom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: d(0.4), delay: d(2.4) }}
          >
            <button
              type="button"
              className={styles.talkBtn}
              onClick={() => { close(); openContact(); }}
            >
              <span>Napisz do mnie →</span>
            </button>
            <span className={styles.tagline}>Z Polski dla świata.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
