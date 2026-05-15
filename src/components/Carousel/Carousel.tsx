'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Carousel.module.scss';

interface Props {
  children: React.ReactNode[];
  label?: string;
}

export function Carousel({ children, label }: Props) {
  const [idx, setIdx] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const n = children.length;

  const go = useCallback(
    (next: number) => setIdx(Math.max(0, Math.min(n - 1, next))),
    [n],
  );

  return (
    <div className={styles.root} role="region" aria-label={label}>
      <div className={styles.viewportWrap}>
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
              if (swipeL && idx < n - 1) { go(idx + 1); setSwiped(true); }
              if (swipeR && idx > 0)     { go(idx - 1); setSwiped(true); }
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

        <AnimatePresence>
          {!swiped && n > 1 && (
            <motion.div
              className={styles.hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              aria-hidden="true"
            >
              <span className={styles.hintArrow}>swipe</span>
              <span className={styles.hintChevron}>→</span>
            </motion.div>
          )}
        </AnimatePresence>
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
