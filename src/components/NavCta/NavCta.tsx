'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './NavCta.module.scss';

const LABEL = 'Zacznijmy';

export function NavCta({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Zacznijmy współpracę"
    >
      <span className={styles.fill} aria-hidden="true" />

      <span className={styles.letters} aria-hidden="true">
        {LABEL.split('').map((char, i) => (
          <motion.span
            key={i}
            className={styles.char}
            animate={
              reduced ? {} :
              hovered
                ? { y: [0, -5, 0], transition: { duration: 0.4, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] } }
                : { y: 0 }
            }
          >
            {char}
          </motion.span>
        ))}
      </span>

      <span className={styles.srOnly}>{LABEL}</span>

      <span className={styles.arrow} aria-hidden="true">
        <motion.span
          animate={reduced ? {} : hovered ? { x: 3 } : { x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          →
        </motion.span>
      </span>
    </button>
  );
}
