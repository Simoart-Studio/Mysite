'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { Project } from '@/types/project';
import { scrollToTarget } from '@/lib/scrollLock';
import styles from './HeroDeck.module.scss';

type Mini = Pick<Project, 'slug' | 'name' | 'thumbnail'>;

const FAN = [
  { rotate: -14, x: -78, y: 14 },
  { rotate:   0, x:   0, y: 0  },
  { rotate:  14, x:  78, y: 14 },
] as const;

/**
 * Interaktywna mini-talia w hero: wachlarz reaguje na kursor (tilt),
 * karty unoszą się na hover, kliknięcie prowadzi do talii projektów.
 * Działa od razu po załadowaniu, bez animacji wejścia.
 */
export function HeroDeck({ cards }: { cards: Mini[] }) {
  const reduced = !!useReducedMotion();
  const [spread, setSpread] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my, reduced]);

  function goToWorks() {
    scrollToTarget('works', reduced);
  }

  const shown = cards.slice(0, 3);

  return (
    <div className={styles.wrap}>
      <motion.a
        href="#works"
        className={styles.deck}
        style={reduced ? undefined : { rotateX: rx, rotateY: ry }}
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
        onFocus={() => setSpread(true)}
        onBlur={() => setSpread(false)}
        onClick={(e) => { e.preventDefault(); goToWorks(); }}
      >
        <span className="sr-only">Projekty — przejdź do talii</span>
        {shown.map((c, i) => {
          const f = FAN[i]!;
          const k = spread ? 1.35 : 1;
          return (
            <motion.span
              key={c.slug}
              className={styles.card}
              initial={false}
              animate={{ rotate: f.rotate * k, x: f.x * k, y: f.y * (spread ? 1.6 : 1) - (spread && i === 1 ? 12 : 0) }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
              style={{ zIndex: i === 1 ? 3 : 2 - Math.abs(i - 1) }}
              aria-hidden="true"
            >
              {i === 1 ? (
                <span className={styles.back}>
                  <span className={styles.backTitle}>Projekty</span>
                  <span className={styles.backSub} aria-hidden="true">↗</span>
                </span>
              ) : (
                <span className={styles.front}>
                  {c.thumbnail && (
                    <Image
                      src={c.thumbnail.src}
                      alt=""
                      width={c.thumbnail.width}
                      height={c.thumbnail.height}
                      sizes="140px"
                      className={styles.img}
                      fetchPriority="low"
                    />
                  )}
                  <span className={styles.name}>{c.name}</span>
                </span>
              )}
            </motion.span>
          );
        })}
      </motion.a>
    </div>
  );
}
