'use client';

import { motion, useReducedMotion } from 'framer-motion';
import styles from './Hero.module.scss';

const EASE = [0.76, 0, 0.24, 1] as const;

function Line({
  children,
  delay,
  reduced,
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean | null;
}) {
  return (
    <span className={styles.lineWrap} aria-hidden="true">
      <motion.span
        className={styles.lineInner}
        initial={reduced ? false : { y: '108%', skewY: 4 }}
        animate={reduced ? {} : { y: '0%', skewY: 0 }}
        transition={reduced ? {} : { duration: 0.85, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.hero} aria-labelledby="hero-h1">
      <motion.div
        className={styles.glow}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      <div className={styles.inner}>
        <motion.p
          className={styles.label}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.6, ease: EASE, delay: 0.25 }}
        >
          <span className="sr-only">Rola: </span>
          Frontend Developer&ensp;·&ensp;Polska
        </motion.p>

        <h1 id="hero-h1" className={styles.h1}>
          <Line reduced={reduced} delay={0.45}>Good Site</Line>
          <Line reduced={reduced} delay={0.58}>Better Life.</Line>
          <span className="sr-only">Good Site Better Life.</span>
        </h1>

        <motion.p
          className={styles.lead}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.7, ease: EASE, delay: 0.85 }}
        >
          Projektuję i buduję strony, które zarabiają — nie tylko wyglądają.
        </motion.p>

        <motion.div
          className={styles.bottom}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={reduced ? {} : { duration: 0.6, ease: EASE, delay: 1.05 }}
        >
          <span className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            <span className="sr-only">Status: </span>
            Dostępny Q2&nbsp;2026
          </span>
        </motion.div>
      </div>
    </section>
  );
}
