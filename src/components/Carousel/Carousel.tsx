'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Carousel.module.scss';

const PEEK = 40;
const GAP  = 12;

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 36, mass: 0.9 };

interface Props {
  children: React.ReactNode[];
  label?: string;
}

export function Carousel({ children, label }: Props) {
  const [idx, setIdx] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const n = children.length;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    setContainerW(el.offsetWidth);
    const ro = new ResizeObserver(([entry]) => { if (entry) setContainerW(entry.contentRect.width); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ready  = containerW > 0;
  const slideW = ready ? containerW - PEEK - GAP : 0;
  const stepW  = ready ? slideW + GAP : 0;

  const go = useCallback(
    (next: number) => setIdx(Math.max(0, Math.min(n - 1, next))),
    [n],
  );

  return (
    <div className={styles.root} role="region" aria-label={label}>
      <div className={styles.viewportWrap}>
        <div className={styles.viewport} ref={viewportRef}>
          <motion.div
            className={styles.track}
            style={{ touchAction: 'pan-y', gap: ready ? GAP : 0 }}
            animate={{ x: ready ? -(idx * stepW) : `${-idx * 100}%` }}
            transition={SPRING}
            drag="x"
            dragConstraints={{ left: ready ? -((n - 1) * stepW) : 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const swipeL = info.offset.x < -40 || info.velocity.x < -400;
              const swipeR = info.offset.x >  40 || info.velocity.x >  400;
              if (swipeL && idx < n - 1) go(idx + 1);
              if (swipeR && idx > 0)     go(idx - 1);
            }}
          >
            {children.map((child, i) => (
              <motion.div
                key={i}
                className={styles.slide}
                style={ready ? { flex: `0 0 ${slideW}px` } : undefined}
                animate={ready ? {
                  opacity: i === idx ? 1    : 0.4,
                  scale:   i === idx ? 1    : 0.94,
                  y:       i === idx ? 0    : 10,
                } : undefined}
                transition={SPRING}
                aria-hidden={i !== idx ? true : undefined}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {n > 1 && (
        <div className={styles.controls}>
          <motion.button
            className={styles.navBtn}
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            aria-label="Poprzedni"
            whileTap={{ scale: 0.88, transition: { type: 'spring', stiffness: 500, damping: 28 } }}
          >
            ←
          </motion.button>

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

          <motion.button
            className={styles.navBtn}
            onClick={() => go(idx + 1)}
            disabled={idx === n - 1}
            aria-label="Następny"
            whileTap={{ scale: 0.88, transition: { type: 'spring', stiffness: 500, damping: 28 } }}
          >
            →
          </motion.button>
        </div>
      )}
    </div>
  );
}
