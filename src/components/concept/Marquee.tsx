'use client';

import { useCallback, useRef } from 'react';
import { dice } from './palette';
import { useScrollProgress } from './useScrollProgress';
import styles from './Marquee.module.scss';

const KINDS = ['Strony firmowe', 'Sklepy internetowe', 'Aplikacje mobilne', 'Gry', 'Aplikacje z AI'] as const;

function Row({ filled }: { filled?: boolean }) {
  const words = [...KINDS, ...KINDS, ...KINDS];
  return (
    <span className={filled ? `${styles.row} ${styles.filled}` : styles.row}>
      {words.map((w, i) => (
        <span key={i} className={styles.item} style={{ '--c': dice(i * 2 + 1) } as React.CSSProperties}>
          {w}
          <span className={styles.star} />
        </span>
      ))}
    </span>
  );
}

/** Przerywnik: dwa rzędy jadą w przeciwne strony z przewijaniem, szybki ruch je przechyla. */
export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const last = useRef({ y: 0, timer: 0 });

  const onFrame = useCallback(() => {
    const el = tilt.current;
    if (!el) return;
    const y = window.scrollY;
    const v = y - last.current.y;
    last.current.y = y;
    el.style.setProperty('--skew', `${Math.max(-9, Math.min(9, v * 0.22)).toFixed(2)}deg`);
    clearTimeout(last.current.timer);
    last.current.timer = window.setTimeout(() => el.style.setProperty('--skew', '0deg'), 90);
  }, []);
  useScrollProgress(ref, 'pass', onFrame);

  return (
    <section ref={ref} className={styles.section} aria-label="Co robię">
      <ul className="sr-only">{KINDS.map((k) => <li key={k}>{k}</li>)}</ul>
      <div ref={tilt} className={styles.tilt} aria-hidden="true">
        <Row />
        <Row filled />
      </div>
    </section>
  );
}
