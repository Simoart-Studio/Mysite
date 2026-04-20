'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import styles from './Currently.module.scss';

const EASE = [0.76, 0, 0.24, 1] as const;

const ITEMS = [
  { label: 'Reading',   value: 'Shape Up — Ryan Singer' },
  { label: 'Learning',  value: 'Język Hiszpański'        },
  { label: 'Listening', value: 'Alternatywny Rock'       },
] as const;

/* col 0 → from top, col 1 → from bottom, col 2 → from top */
const Y_FROM = [-60, 60, -60] as const;

export function Currently() {
  const ref          = useRef<HTMLElement>(null);
  const isInView     = useInView(ref, { once: false, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  return (
    <section className={styles.section} ref={ref} aria-label="Aktualnie">
      <div className={styles.inner}>
        {ITEMS.map(({ label, value }, i) => (
          <motion.div
            key={label}
            className={styles.item}
            initial={prefersReduced ? false : { opacity: 0, y: Y_FROM[i] }}
            animate={
              prefersReduced
                ? {}
                : isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: Y_FROM[i] }
            }
            transition={
              prefersReduced
                ? {}
                : {
                    duration: 0.75,
                    ease: EASE,
                    delay: i * 0.1,
                  }
            }
          >
            <p className={styles.label}>{label}</p>
            <p className={styles.value}>{value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
