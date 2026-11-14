/*
 * Choreografia otwarcia pracowni, liczona z prawdziwej geometrii strony:
 *  1. kostka spada z góry na pierwszą linię nagłówka (grawitacja),
 *  2. uderza — spłaszczenie, fala w punkcie styku; nagłówek ugina się i maleje (FLIP na transform),
 *  3. odbija się po paraboli balistycznej na swoje miejsce z lewej i ląduje z dwoma podskokami.
 * Wszystko to klatki kluczowe Web Animations (transform/opacity) — animuje kompozytor, bez reflow.
 */

export type Box = { left: number; top: number; width: number; height: number };
export const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });

/** Tłumiona sprężyna 0 → 1 (lekkie przestrzelenie). */
export function spring(t: number, w = 13, z = 0.6) {
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

const fmt = (n: number) => n.toFixed(3);

/** Kostka: czasy poszczególnych faz (s). */
export const FALL = 0.44;
const ARC = 0.62;
const SETTLE = 0.5;
export const LAND = FALL + ARC;
const TOTAL = LAND + SETTLE;

/**
 * Klatki lotu kostki we współrzędnych jej docelowego miejsca (0,0 = środek kostki po wylądowaniu).
 * hit — środek kostki w chwili styku z nagłówkiem; half — połowa boku kostki; vh — wysokość ekranu.
 */
export function dieFlight(hit: { x: number; y: number }, half: number, vh: number, startY: number): Keyframe[] {
  // parabola od punktu styku do miejsca docelowego, ze szczytem `rise` nad wyższym z nich
  const rise = Math.max(44, vh * 0.08);
  const apex = Math.min(hit.y, 0) - rise;
  const A = hit.y - apex;
  const g = (2 * (Math.sqrt(A) + Math.sqrt(-apex)) ** 2) / (ARC * ARC);
  const vy = -Math.sqrt(2 * g * A);
  const vLand = vy + g * ARC; // prędkość w dół przy lądowaniu

  const bump = (t: number, at: number, w: number) => Math.exp(-(((t - at) / w) ** 2));
  const b1 = Math.min(half * 0.5, vLand * 0.035), b2 = b1 * 0.25;
  const t1 = 0.26, t2 = 0.14;

  const N = 96;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * TOTAL;
    let x: number, y: number, r: number;
    if (t <= FALL) {
      const k = t / FALL;
      x = hit.x;
      y = startY + (hit.y - startY) * k * k;
      r = -120 * (1 - k);
    } else if (t <= LAND) {
      const u = t - FALL, k = u / ARC;
      x = hit.x * (1 - k);
      y = hit.y + vy * u + 0.5 * g * u * u;
      r = -360 * (1 - (1 - k) ** 1.4); // jeden obrót w lewo, ląduje płasko (‑360° ≡ 0°)
    } else {
      const u = t - LAND;
      x = 0;
      if (u < t1) y = -4 * b1 * (u / t1) * (1 - u / t1);
      else if (u < t1 + t2) { const k = (u - t1) / t2; y = -4 * b2 * k * (1 - k); }
      else y = 0;
      r = -360;
    }
    // spłaszczenie przy każdym styku (względem spodu kostki)
    const q = 0.2 * bump(t, FALL, 0.045) + 0.16 * bump(t, LAND, 0.04) + 0.06 * bump(t, LAND + t1, 0.03);
    const sx = 1 + q, sy = 1 - q;
    const opacity = Math.min(1, t / 0.08);
    frames.push({
      offset: i / N,
      opacity,
      transform:
        `translate(${fmt(x)}px, ${fmt(y)}px) translateY(${fmt(half)}px) scale(${fmt(sx)}, ${fmt(sy)}) ` +
        `translateY(${fmt(-half)}px) rotate(${fmt(r)}deg)`,
    });
  }
  return frames;
}

export const DIE_MS = TOTAL * 1000;

/**
 * FLIP: element od starego prostokąta do nowego, sprężyście. `dent` — wgniecenie od uderzenia z góry.
 * Origin 0 0; skala jednorodna (nagłówek zmienia tylko rozmiar czcionki, łamanie wierszy zostaje).
 */
export function flipFrames(from: Box, to: Box, opts: { k?: number; dent?: number } = {}): { frames: Keyframe[]; ms: number } {
  // k — stosunek rozmiarów czcionki (szerokość pudełka zależy też od max-width w ch, więc się nie nadaje);
  // tekst jest wyśrodkowany, więc dopasowujemy środki w poziomie i górne krawędzie
  const k = opts.k ?? 1;
  const dx = from.left + from.width / 2 - (to.left + (to.width * k) / 2), dy = from.top - to.top;
  const dur = 1.0, N = 60;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * dur;
    const s = i === N ? 1 : spring(t);
    // wgniecenie: szybkie ugięcie w dół zaraz po uderzeniu
    const d = opts.dent ? Math.sin(Math.PI * Math.min(1, t / 0.16)) * (t < 0.16 ? 1 : 0) : 0;
    const sc = k + (1 - k) * s;
    frames.push({
      offset: i / N,
      transform:
        `translate(${fmt(dx * (1 - s))}px, ${fmt(dy * (1 - s) + d * (opts.dent ?? 0))}px) ` +
        `scale(${fmt(sc * (1 + d * 0.03))}, ${fmt(sc * (1 - d * 0.07))})`,
    });
  }
  return { frames, ms: dur * 1000 };
}
