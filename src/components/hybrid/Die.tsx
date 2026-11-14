'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Die.module.scss';

export type Material = 'mat' | 'glass' | 'neon' | 'chrome';
export type DieLook = { color: string; material: Material; radius: number; letter: string };

type Angles = { rx: number; ry: number };

/* Spoczynek: lekko z góry i z prawej — widać literę, wierzch i bok */
const TILT: Angles = { rx: -22, ry: -32 };

/* Ścianki: litera z przodu, oczka jak na prawdziwej kostce (przeciwne ścianki sumują się do 7) */
const FACES = [
  { id: 'front',  n: [0, 0, 1],  t: 'translateZ(var(--half))', pips: 0 },
  { id: 'back',   n: [0, 0, -1], t: 'rotateY(180deg) translateZ(var(--half))', pips: 6 },
  { id: 'right',  n: [1, 0, 0],  t: 'rotateY(90deg) translateZ(var(--half))', pips: 2 },
  { id: 'left',   n: [-1, 0, 0], t: 'rotateY(-90deg) translateZ(var(--half))', pips: 5 },
  { id: 'top',    n: [0, -1, 0], t: 'rotateX(90deg) translateZ(var(--half))', pips: 3 },
  { id: 'bottom', n: [0, 1, 0],  t: 'rotateX(-90deg) translateZ(var(--half))', pips: 4 },
] as const;

/* Gdzie trzeba obrócić kostkę, żeby dana ścianka patrzyła na widza */
const FACE_AT: Record<string, Angles> = {
  front: { rx: 0, ry: 0 }, back: { rx: 0, ry: 180 }, right: { rx: 0, ry: -90 },
  left: { rx: 0, ry: 90 }, top: { rx: -90, ry: 0 }, bottom: { rx: 90, ry: 0 },
};

/* Układ oczek w siatce 3×3 */
const PIPS: Record<number, number[]> = {
  2: [2, 6], 3: [2, 4, 6], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

const L = (() => { const v = [-0.45, -0.75, 0.55]; const m = Math.hypot(...v); return v.map((x) => x / m); })();
const rad = (d: number) => (d * Math.PI) / 180;

/** Oświetlenie ścianki liczone z jej normalnej po obrocie (najpierw rotateY, potem rotateX — jak w CSS). */
function light(n: readonly number[], a: Angles) {
  const [x0, y0, z0] = n as [number, number, number];
  const b = rad(a.ry), c = rad(a.rx);
  const x1 = x0 * Math.cos(b) + z0 * Math.sin(b);
  const z1 = -x0 * Math.sin(b) + z0 * Math.cos(b);
  const y2 = y0 * Math.cos(c) - z1 * Math.sin(c);
  const z2 = y0 * Math.sin(c) + z1 * Math.cos(c);
  const d = x1 * L[0]! + y2 * L[1]! + z2 * L[2]!;
  return { shade: Math.min(0.62, Math.max(0, 0.42 - d * 0.6)), hl: Math.max(0, d - 0.55) * 0.55 };
}

function Face({ face, look, a }: { face: (typeof FACES)[number]; look: DieLook; a: Angles }) {
  const l = light(face.n, a);
  return (
    <span
      className={styles.face}
      style={{ transform: face.t, '--shade': l.shade.toFixed(3), '--hl': l.hl.toFixed(3) } as React.CSSProperties}
    >
      {face.pips === 0 ? (
        <span className={styles.letter}>{look.letter}</span>
      ) : (
        <span className={styles.pips}>
          {Array.from({ length: 9 }, (_, i) => <i key={i} className={PIPS[face.pips]!.includes(i) ? styles.pip : undefined} />)}
        </span>
      )}
    </span>
  );
}

/** Sama bryła — bez interakcji (np. podgląd wzoru). */
export function DieBody({ look, a = TILT, size }: { look: DieLook; a?: Angles; size: string }) {
  return (
    <span
      className={styles.cube}
      data-material={look.material}
      style={{
        '--s': size, '--c': look.color, '--r': `${look.radius}%`,
        transform: `rotateX(${a.rx}deg) rotateY(${a.ry}deg)`,
      } as React.CSSProperties}
    >
      <span className={styles.core} /><span className={`${styles.core} ${styles.coreY}`} /><span className={`${styles.core} ${styles.coreX}`} />
      {FACES.map((f) => <Face key={f.id} face={f} look={look} a={a} />)}
    </span>
  );
}

const easeOutBack = (t: number) => { const c = 1.35; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Kostka do zabawy: przeciąganie obraca (z bezwładnością), `roll` rzuca nią na losową ściankę,
 * zmiana litery obraca ją literą do widza.
 */
export function Die({ look, roll, size, onLand }: { look: DieLook; roll: number; size: string; onLand?: () => void }) {
  const [a, setA] = useState<Angles>(TILT);
  const cur = useRef(a);
  const anim = useRef(0);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; t: number } | null>(null);

  const apply = useCallback((n: Angles) => { cur.current = n; setA(n); }, []);
  const landRef = useRef(onLand);
  useEffect(() => { landRef.current = onLand; });

  const animateTo = useCallback((to: Angles, ms: number, ease: (t: number) => number, done?: () => void) => {
    cancelAnimationFrame(anim.current);
    const from = { ...cur.current };
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = ease(k);
      apply({ rx: from.rx + (to.rx - from.rx) * e, ry: from.ry + (to.ry - from.ry) * e });
      if (k < 1) anim.current = requestAnimationFrame(step);
      else done?.();
    };
    anim.current = requestAnimationFrame(step);
  }, [apply]);

  // Litera zmieniona → kostka obraca się literą do widza (najkrótszą drogą)
  const firstLetter = useRef(true);
  useEffect(() => {
    if (firstLetter.current) { firstLetter.current = false; return; }
    const near = (v: number, t: number) => t + Math.round((v - t) / 360) * 360;
    animateTo({ rx: near(cur.current.rx, TILT.rx), ry: near(cur.current.ry, TILT.ry) }, 700, easeOutBack);
  }, [look.letter, animateTo]);

  // Rzut: podskok, kilka obrotów i lądowanie na losowej ściance
  useEffect(() => {
    if (!roll) return;
    const keys = Object.keys(FACE_AT);
    const target = FACE_AT[keys[Math.floor(Math.random() * keys.length)]!]!;
    const spinsX = 360 * (1 + Math.floor(Math.random() * 2));
    const spinsY = 360 * (2 + Math.floor(Math.random() * 2));
    const base = cur.current;
    const to = {
      rx: Math.round((base.rx - TILT.rx) / 360) * 360 + target.rx + TILT.rx - spinsX,
      ry: Math.round((base.ry - TILT.ry) / 360) * 360 + target.ry + TILT.ry + spinsY,
    };
    animateTo(to, 1250, easeOut, () => landRef.current?.());
  }, [roll, animateTo]);

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const down = (e: React.PointerEvent) => {
    cancelAnimationFrame(anim.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: performance.now() };
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    const now = performance.now(), dt = Math.max(1, now - d.t);
    d.vx = (dx * 0.55) / dt * 16; d.vy = (dy * 0.55) / dt * 16;
    d.x = e.clientX; d.y = e.clientY; d.t = now;
    apply({ rx: cur.current.rx - dy * 0.55, ry: cur.current.ry + dx * 0.55 });
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    let vx = d.vx, vy = d.vy;
    const glide = () => {
      vx *= 0.94; vy *= 0.94;
      apply({ rx: cur.current.rx - vy, ry: cur.current.ry + vx });
      if (Math.abs(vx) + Math.abs(vy) > 0.05) anim.current = requestAnimationFrame(glide);
    };
    anim.current = requestAnimationFrame(glide);
  };

  return (
    <span className={styles.stage} style={{ '--s': size } as React.CSSProperties}>
      <span key={roll} className={`${styles.lift} ${roll ? styles.jump : ''}`}>
        <span
          className={styles.grab}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          role="img"
          aria-label={`Kostka z literą ${look.letter}`}
        >
          <DieBody look={look} a={a} size={size} />
        </span>
      </span>
      <span key={`s${roll}`} className={`${styles.shadow} ${roll ? styles.shadowJump : ''}`} aria-hidden="true" />
    </span>
  );
}
