'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import styles from './MenuOverlay.module.scss';

const E_WAVE = [0.76, 0, 0.24, 1] as const;
const E_SOFT = [0.22, 1, 0.36, 1] as const;

type Item = {
  href:      string;
  label:     string;
  branch:    string;
  twig:      string | null;
  junctionY: number;
  dotLeft:   string;
  dotTop:    string;
  swingDir:  1 | -1;
  tBranch:   number;
  tItem:     number;
};

const ITEMS: Item[] = [
  {
    href:      '/#works',
    label:     'Realizacje',
    branch:    'M 720,200 C 618,178 492,152 318,126',
    twig:      'M 510,162 C 466,154 422,146 374,139',
    junctionY: 200,
    dotLeft:   '22%',
    dotTop:    '13%',
    swingDir:  -1,
    tBranch:   0.72,
    tItem:     1.48,
  },
  {
    href:      '/#about',
    label:     'O mnie',
    branch:    'M 720,290 C 842,268 982,202 1122,150',
    twig:      'M 930,216 C 982,202 1034,188 1078,175',
    junctionY: 290,
    dotLeft:   '78%',
    dotTop:    '15%',
    swingDir:  1,
    tBranch:   0.92,
    tItem:     1.68,
  },
  {
    href:      '/#process',
    label:     'Jak pracuję',
    branch:    'M 720,440 C 615,433 492,422 322,412',
    twig:      null,
    junctionY: 440,
    dotLeft:   '22%',
    dotTop:    '53%',
    swingDir:  -1,
    tBranch:   1.12,
    tItem:     1.88,
  },
  {
    href:      '/#contact',
    label:     'Kontakt',
    branch:    'M 720,540 C 856,532 990,520 1122,510',
    twig:      null,
    junctionY: 540,
    dotLeft:   '78%',
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

  function handleNav(e: React.MouseEvent, href: string) {
    if (!href.startsWith('/#')) return;
    e.preventDefault();
    close();
    const id = href.slice(2);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block:    'start',
      });
    }, prefersReduced ? 0 : 240);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu główne"
          className={styles.overlay}
          initial={prefersReduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', opacity: 1 }}
          animate={prefersReduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)',   opacity: 1 }}
          exit={prefersReduced   ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)',  opacity: 1 }}
          transition={{
            clipPath: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            opacity:  { duration: 0.18 },
          }}
        >
          {/* ─── Top bar ─── */}
          <div className={styles.topBar}>
            <span className={styles.logoMark} aria-hidden="true">SimoArt</span>
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

            <svg
              viewBox="0 0 1440 760"
              preserveAspectRatio="none"
              className={styles.treeSvg}
              aria-hidden="true"
            >
              <defs>
                <filter id="tree-grain" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>

              <g filter="url(#tree-grain)">
                <motion.path
                  d={TRUNK}
                  className={styles.trunk}
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: d(1.1), delay: d(0.45), ease: 'easeInOut' }}
                />
                {ITEMS.map((item) => (
                  <g key={item.href}>
                    <motion.path
                      d={item.branch}
                      className={styles.branch}
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: d(0.72), delay: d(item.tBranch + 0.25), ease: E_WAVE }}
                    />
                    {item.twig && (
                      <motion.path
                        d={item.twig}
                        className={styles.twig}
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: d(0.42), delay: d(item.tBranch + 0.47), ease: E_WAVE }}
                      />
                    )}
                  </g>
                ))}
              </g>

              {ITEMS.map((item) => (
                <motion.circle
                  key={item.href}
                  cx={720} cy={item.junctionY} r={4}
                  className={styles.junctionDot}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: d(0.3), delay: d(item.tBranch + 0.25), ease: E_SOFT }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              ))}
            </svg>

            {/* Desktop — zawieszki na drzewie */}
            <nav className={styles.treeNav} aria-label="Nawigacja główna">
              {ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  className={styles.ornament}
                  style={{ left: item.dotLeft, top: item.dotTop }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: d(0.2), delay: d(item.tItem + 0.25) }}
                >
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
                        delay:     d(item.tItem + 0.25),
                      },
                    }}
                  >
                    <span className={styles.hangDot}    aria-hidden="true" />
                    <span className={styles.hangString} aria-hidden="true" />
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      onClick={(e) => handleNav(e, item.href)}
                    >
                      <span className={styles.navIndex} aria-hidden="true">0{i + 1}</span>
                      <span className={styles.navWord}>{item.label}</span>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </nav>

            {/* Mobile — zjawa: każdy element materializuje się z nicości */}
            <nav className={styles.mobileNav} aria-label="Nawigacja główna">
              {ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  className={styles.mobileItem}
                  initial={{ opacity: 0, filter: 'blur(14px)', y: 10 }}
                  animate={{ opacity: 1, filter: 'blur(0px)',  y: 0  }}
                  transition={prefersReduced ? { duration: 0 } : {
                    duration: 1.1,
                    delay:    0.25 + i * 0.2,
                    ease:     E_SOFT,
                  }}
                >
                  <Link
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={(e) => handleNav(e, item.href)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* ─── Bottom ─── */}
          <motion.div
            className={styles.bottom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: d(0.4), delay: d(0.75) }}
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
