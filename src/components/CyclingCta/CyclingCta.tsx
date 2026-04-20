'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styles from './CyclingCta.module.scss';

const PHRASES = [
  'Porozmawiajmy',
  'Zacznijmy',
  'Napisz do mnie',
  'Umów call',
] as const;

type Props = {
  href?:     string;
  onClick?:  () => void;
  size?:     'sm' | 'md' | 'lg';
  variant?:  'text' | 'pill';
};

export function CyclingCta({ href, onClick, size = 'md', variant = 'text' }: Props) {
  const [index, setIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PHRASES.length),
      2600
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  const phrase = PHRASES[index] ?? PHRASES[0];

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }
    if (href?.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onClick, href]);

  const inner = (
    <>
      <span className={styles.textWrap}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={prefersReduced ? 'static' : index}
            className={styles.phrase}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {phrase}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        &nbsp;→
      </span>
    </>
  );

  const cls = `${styles.cta} ${styles[size]} ${variant === 'pill' ? styles.pill : styles.textVariant}`;

  return href && !href.startsWith('#') ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <button type="button" className={cls} onClick={handleClick}>
      {inner}
    </button>
  );
}
