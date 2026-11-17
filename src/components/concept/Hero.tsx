'use client';

import { useEffect, useRef } from 'react';
import { OWNER } from '@/data/config';
import { dice } from './palette';
import { useScrollProgress } from './useScrollProgress';
import styles from './Hero.module.scss';

const WORD = 'SIMOART';
const SPEED = [150, 270, 95, 210, 125, 250, 180]; // każda litera odjeżdża w górę w swoim tempie

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  useScrollProgress(ref, 'leave');

  // Litera pod kursorem grubieje (czcionka zmienna 400→700) i przyjmuje kolor swojej kostki.
  useEffect(() => {
    const sec = ref.current;
    const w = word.current;
    if (!sec || !w || !window.matchMedia('(hover: hover)').matches) return;
    const letters = Array.from(w.querySelectorAll<HTMLElement>('[data-l]'));
    let raf = 0;
    let px = -1e4, py = -1e4;
    const paint = () => {
      raf = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / (r.height * 0.95));
        l.style.setProperty('--k', (k * k * (3 - 2 * k)).toFixed(3));
      }
    };
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    const leave = () => { px = py = -1e4; if (!raf) raf = requestAnimationFrame(paint); };
    sec.classList.add(styles.manual!);
    sec.addEventListener('pointermove', move);
    sec.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      sec.removeEventListener('pointermove', move);
      sec.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="concept-title">
      <h1 id="concept-title" className={styles.title}>
        <span className="sr-only">SimoArt studio — strony, sklepy i aplikacje</span>
        <span ref={word} className={styles.word} aria-hidden="true">
          {WORD.split('').map((ch, i) => (
            <span
              key={i}
              data-l
              className={styles.l}
              style={{ '--c': dice(i), '--sp': SPEED[i], '--i': i } as React.CSSProperties}
            >
              <span className={styles.li}>{ch}</span>
            </span>
          ))}
        </span>
      </h1>

      <div className={styles.meta} aria-hidden="true">
        <span>studio</span>
        <span className={styles.rule} />
        <span>strony · sklepy · aplikacje</span>
      </div>

      <p className={styles.owner}>{OWNER}</p>

      <span className={styles.cue} aria-hidden="true"><i /></span>
    </section>
  );
}
