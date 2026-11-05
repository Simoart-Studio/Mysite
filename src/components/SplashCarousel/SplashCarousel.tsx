'use client';

import { useCallback, useId, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import styles from './SplashCarousel.module.scss';

export type SplashSlide = { title: string; body: string };

const BLOBS = [
  'M318,77C357,113,374,174,361,229C348,284,305,333,250,355C195,377,128,372,84,339C40,306,19,245,27,190C35,135,72,86,122,58C172,30,279,41,318,77Z',
  'M297,52C345,79,378,133,376,190C374,247,337,307,284,343C231,379,162,391,109,365C56,339,19,275,24,212C29,149,76,87,131,57C186,27,249,25,297,52Z',
  'M330,94C368,140,377,206,352,262C327,318,268,364,204,370C140,376,71,342,40,288C9,234,16,160,52,110C88,60,153,34,216,36C279,38,292,48,330,94Z',
];
const FILLS = [
  { fill: '#FFFFFF', deep: '#CFE9B4', drop: 'var(--green)' },
  { fill: '#D6F0BC', deep: '#B4DE8E', drop: '#5E8F4A'      },
  { fill: '#F7FBF1', deep: '#D9EEC4', drop: '#8FCB5C'      },
];
const DROPS = [
  [ -20, 1.18, 14 ], [ 35, 1.22, 9 ], [ 100, 1.16, 12 ], [ 160, 1.24, 8 ],
  [ 205, 1.15, 13 ], [ 255, 1.2, 7 ], [ 300, 1.18, 10 ],
] as const;

const SWIPE = 60;

export function SplashCarousel({ slides, label }: { slides: SplashSlide[]; label: string }) {
  const reduced = !!useReducedMotion();
  const reducedDom = useReducedMotionSafe();
  const uid = useId();
  const n = slides.length;
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);

  const go = useCallback((d: 1 | -1) => {
    setState(([i]) => [(i + d + n) % n, d]);
  }, [n]);
  const to = (i: number) => setState(([cur]) => [i, i >= cur ? 1 : -1]);

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE || info.velocity.x < -400) go(1);
    else if (info.offset.x > SWIPE || info.velocity.x > 400) go(-1);
  }

  const slide = slides[index]!;
  const shape = BLOBS[index % BLOBS.length]!;
  const color = FILLS[index % FILLS.length]!;

  return (
    <div
      className={styles.root}
      role="region"
      aria-roledescription="karuzela"
      aria-label={label}
      onKeyDown={onKey}
    >
      <div className={styles.stage}>
        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label="Poprzednia zasada">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <div className={styles.viewport}>
          <AnimatePresence initial={false} mode="wait" custom={dir}>
            <motion.div
              key={index}
              className={styles.slide}
              role="group"
              aria-roledescription="slajd"
              aria-label={`${index + 1} z ${n}`}
              id={`${uid}-slide`}
              custom={dir}
              drag="x"
              dragSnapToOrigin
              dragElastic={0.35}
              onDragEnd={onDragEnd}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.35, rotate: dir * -8 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: dir * -40, transition: { duration: 0.22 } }}
              transition={reduced ? { duration: 0.25 } : { type: 'spring', stiffness: 260, damping: 15, mass: 0.9 }}
            >
              <svg className={styles.blob} viewBox="0 0 400 400" aria-hidden="true">
                <path d={shape} fill={color.deep} transform="translate(10 14)" />
                <path d={shape} fill={color.fill} />
              </svg>

              {!reducedDom && DROPS.map(([angle, dist, size], i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <span
                    key={i}
                    className={styles.drop}
                    style={{
                      width: size,
                      height: size,
                      background: color.drop,
                      ['--dx' as string]: (Math.cos(rad) * dist * 50).toFixed(1),
                      ['--dy' as string]: (Math.sin(rad) * dist * 50).toFixed(1),
                      ['--delay' as string]: `${50 + i * 25}ms`,
                    }}
                    aria-hidden="true"
                  />
                );
              })}

              <div className={styles.content}>
                <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3 className={styles.title}>{slide.title}</h3>
                <p className={styles.body}>{slide.body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label="Następna zasada">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.dots} role="group" aria-label="Wybierz zasadę">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className={styles.dot}
            aria-label={`${i + 1}. ${s.title}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => to(i)}
          />
        ))}
      </div>

      <ol className={styles.static}>
        {slides.map((s, i) => (
          <li key={s.title}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <strong>{s.title}</strong> {s.body}
          </li>
        ))}
      </ol>
    </div>
  );
}
