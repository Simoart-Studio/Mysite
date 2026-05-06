'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './Carousel.module.scss';

interface Props {
  children: React.ReactNode[];
  label?: string;
}

export function Carousel({ children, label }: Props) {
  const [idx, setIdx] = useState(0);
  const n = children.length;

  const go = useCallback(
    (next: number) => setIdx(Math.max(0, Math.min(n - 1, next))),
    [n],
  );

  return (
    <div className={styles.root} role="region" aria-label={label}>
      <div className={styles.viewport}>
        <motion.div
          className={styles.track}
          animate={{ x: `${-idx * 100}%` }}
          transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.85 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.06}
          style={{ touchAction: 'pan-y' }}
          onDragEnd={(_, info) => {
            const swipeL = info.offset.x < -50 || info.velocity.x < -480;
            const swipeR = info.offset.x >  50 || info.velocity.x >  480;
            if (swipeL && idx < n - 1) go(idx + 1);
            if (swipeR && idx > 0)     go(idx - 1);
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className={styles.slide}
              aria-hidden={i !== idx ? true : undefined}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {n > 1 && (
        <div className={styles.dots} aria-hidden="true">
          {children.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
              onClick={() => go(i)}
              tabIndex={-1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
