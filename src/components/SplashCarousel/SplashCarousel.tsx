'use client';

import { Fragment, useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, m, useInView, useReducedMotion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './SplashCarousel.module.scss';

export type SplashSlide = { title: string; body: string };

const STEP_MS = 16;

/** Dzieli tekst na słowa i litery; każda litera dostaje kolejny indeks animacji. */
function SmokeText({ text, start, plain }: { text: string; start: number; plain: boolean }) {
  if (plain) return <>{text}</>;
  const words = text.split(' ');
  let k = start;
  const offsets = words.map((w) => { const o = k; k += w.length + 1; return o; });
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className={styles.word}>
            {Array.from(w).map((ch, ci) => (
              <span key={ci} className={styles.ch} style={{ ['--i' as string]: offsets[wi]! + ci }}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  );
}

const SWIPE = 60;

export function SplashCarousel({ slides, label }: { slides: SplashSlide[]; label: string }) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const n = slides.length;
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);

  const go = useCallback((d: 1 | -1) => {
    setState(([i]) => [(i + d + n) % n, d]);
  }, [n]);

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE || info.velocity.x < -400) go(1);
    else if (info.offset.x > SWIPE || info.velocity.x > 400) go(-1);
  }

  const slide = slides[index]!;
  const side = index % 2 === 0 ? styles.tailLeft : styles.tailRight;
  const bodyStart = slide.title.length + 1;
  const total = bodyStart + slide.body.length;

  // Po zakończeniu animacji litery są zastępowane zwykłym tekstem (pełny kerning i ligatury).
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.45 });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (reduced) { setDone(true); return; }
    setDone(false);
    if (!inView) return;
    const t = window.setTimeout(() => setDone(true), 120 + total * STEP_MS + 1000);
    return () => window.clearTimeout(t);
  }, [index, total, reduced, inView]);

  return (
    <div
      ref={rootRef}
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
            <m.div
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
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 14 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, x: dir * -32, filter: 'blur(6px)', transition: { duration: 0.24 } }}
              transition={reduced ? { duration: 0.25 } : { type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className={`${styles.bubble} ${side}${inView ? ` ${styles.play}` : ''}`} style={{ ['--n' as string]: total, ['--step' as string]: `${STEP_MS}ms` }}>
                <span className={styles.smoke} aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
                <h3 className={styles.title}>
                  <span className="sr-only">{slide.title}</span>
                  <span aria-hidden="true"><SmokeText text={slide.title} start={0} plain={done} /></span>
                </h3>
                <p className={styles.body}>
                  <span className="sr-only">{slide.body}</span>
                  <span aria-hidden="true"><SmokeText text={slide.body} start={bodyStart} plain={done} /></span>
                </p>
                <svg className={styles.tail} viewBox="0 0 30 22" aria-hidden="true">
                  <path className={styles.tailFill} d="M0 0 L0 20.5 Q0 22 1.3 21.2 L28 0 Z" />
                  <path className={styles.tailStroke} d="M0.75 0 L0.75 20.4 Q0.75 21.4 1.6 20.8 L28 0" />
                </svg>
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label="Następna zasada">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>

      <ol className={styles.static}>
        {slides.map((s) => (
          <li key={s.title}>
            <strong>{s.title}</strong> {s.body}
          </li>
        ))}
      </ol>
    </div>
  );
}
