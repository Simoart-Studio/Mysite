'use client';

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { prefersReducedMotion } from './useScrollProgress';
import styles from './Details.module.scss';

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

/* 01 — czcionka zmienna: kursor w poziomie ustawia grubość 400–700 */
function TypeTile() {
  const ref = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const w = Math.round(400 + Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 300);
    el.classList.add(styles.manual!);
    el.style.setProperty('--w', String(w));
    if (out.current) out.current.textContent = String(w);
  };
  return (
    <div ref={ref} className={`${styles.tile} ${styles.type}`} onPointerMove={move}>
      <Label n="01" name="Typografia" />
      <span className={styles.aa} aria-hidden="true">Aa</span>
      <span className={styles.axis} aria-hidden="true">
        wght <span ref={out}>400–700</span>
        <i />
      </span>
    </div>
  );
}

/* 02 — wydajność: wynik Lighthouse odliczany po wejściu w ekran */
const SCORE = 95;
function SpeedTile() {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const out = num.current;
    if (!el || !out) return;
    if (prefersReducedMotion()) { el.classList.add(styles.counted!); return; }
    out.textContent = '0'; // kafel jest pod linią ekranu — wynik odliczy się, gdy wjedzie
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      el.classList.add(styles.counted!);
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600);
        out.textContent = String(Math.round(SCORE * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className={`${styles.tile} ${styles.speed}`}>
      <Label n="02" name="Wydajność" />
      <span className={styles.ring} style={{ '--s': SCORE / 100 } as React.CSSProperties}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" className={styles.track} />
          <circle cx="60" cy="60" r="52" className={styles.arc} pathLength={1} />
        </svg>
        <span ref={num} className={styles.score}>{SCORE}</span>
      </span>
      <span className={styles.caption}>Lighthouse</span>
    </div>
  );
}

/* 03 — światło: kursor odsłania ukrytą siatkę */
function LightTile() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.classList.add(styles.manual!);
    el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  return (
    <div ref={ref} className={`${styles.tile} ${styles.light}`} onPointerMove={move}>
      <span className={styles.dots} aria-hidden="true" />
      <Label n="03" name="Światło" />
    </div>
  );
}

/* 04 — magnetyzm: przycisk przyciągany przez kursor, wraca sprężyście */
function MagnetTile() {
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLSpanElement>(null);
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current, b = btn.current;
    if (!el || !b || !canHover()) return;
    const r = b.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    b.style.setProperty('--tx', `${(dx * 0.38).toFixed(1)}px`);
    b.style.setProperty('--ty', `${(dy * 0.38).toFixed(1)}px`);
    b.classList.add(styles.pulled!);
  };
  const leave = () => {
    const b = btn.current;
    if (!b) return;
    b.style.setProperty('--tx', '0px');
    b.style.setProperty('--ty', '0px');
    b.classList.remove(styles.pulled!);
  };
  return (
    <div ref={ref} className={`${styles.tile} ${styles.magnet}`} onPointerMove={move} onPointerLeave={leave}>
      <Label n="04" name="Magnetyzm" />
      <span ref={btn} className={styles.mbtn} aria-hidden="true">
        <span className={styles.micon}><ArrowUpRight size={30} strokeWidth={1.6} /></span>
      </span>
    </div>
  );
}

/* 05 — motyw: przełącznik z prawdziwym stanem i sprężystym ruchem */
function ThemeTile() {
  const [light, setLight] = useState(false);
  return (
    <div className={`${styles.tile} ${styles.theme}`} data-light={light || undefined}>
      <Label n="05" name="Motyw" />
      <button
        type="button"
        className={styles.switch}
        aria-pressed={light}
        aria-label="Jasny motyw kafelka"
        onClick={() => setLight((v) => !v)}
      >
        <span className={styles.knob} />
      </button>
      <span className={styles.swatches} aria-hidden="true"><i /><i /><i /></span>
    </div>
  );
}

function Label({ n, name }: { n: string; name: string }) {
  return <p className={styles.label}><span>{n}</span>{name}</p>;
}

export function Details() {
  return (
    <section className={styles.section} aria-labelledby="details-title">
      <h2 id="details-title" className={styles.head}><span>03</span> Detale</h2>
      <div className={styles.bento}>
        <TypeTile />
        <SpeedTile />
        <LightTile />
        <MagnetTile />
        <ThemeTile />
      </div>
    </section>
  );
}
