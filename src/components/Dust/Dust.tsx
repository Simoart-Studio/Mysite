'use client';

import { useEffect, useRef } from 'react';

type P = { x: number; y: number; sx: number; sy: number; cx: number; cy: number; d: number; r: number; a: number; loose: boolean };

const DURATION = 1700; // ms: cały proces, od pierwszej drobinki do gotowego słowa
const FLIGHT   = 0.5;  // część czasu, jaką leci jedna drobinka
const SPREAD   = 0.3;  // rozłożenie startów od lewej do prawej krawędzi słowa
const EDGE     = 0.22; // miękkość czoła, za którym pył zamienia się w litery

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * Słowo-klucz, które osiada z pyłu: drobinki w kolorze słowa nadlatują z prawej i z góry
 * (nigdy nad poprzedzające słowo), wpadają w kształt liter, a litery „zastygają” z pyłu od lewej do prawej.
 * Na końcu płótno w tej samej klatce zamienia się w zwykły tekst (identyczny w położeniu) — bez przenikania.
 * Bez JS i przy ograniczonym ruchu słowo jest po prostu widoczne.
 */
export function Dust({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const done = () => root.classList.add('is-done');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      done();
      return;
    }

    let raf = 0;
    let timer = 0;
    let idleId = 0;
    let canvas: HTMLCanvasElement | null = null;

    function run() {
      const text = root!.querySelector<HTMLElement>('.dust__text');
      if (!text) return done();

      // Położenie z układu (offset*), nie z getBoundingClientRect — animacje rodzica (translate/scale)
      // nie mogą przesunąć kształtu liter względem tekstu.
      const cs = getComputedStyle(text);
      const fs = parseFloat(cs.fontSize);
      const tw = text.offsetWidth, th = text.offsetHeight;
      if (!tw || !th) return done();

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const padL = Math.round(fs * 0.15);  // z lewej prawie nic — tam stoi poprzednie słowo
      const padR = Math.round(fs * 1.4);   // z prawej i z góry nadlatuje pył
      const padY = Math.round(fs * 0.9);
      const W = Math.ceil(root!.offsetWidth + padL + padR);
      const H = Math.ceil(root!.offsetHeight + padY * 2);
      const ox = text.offsetLeft + padL;   // początek tekstu na płótnie
      const oy = text.offsetTop + padY;

      // 1. Tekst offscreen w kolorze słowa, dokładnie w miejscu tekstu z DOM (w rozdzielczości ekranu —
      //    z tej warstwy odsłaniają się ostre litery).
      const textLayer = document.createElement('canvas');
      textLayer.width = W * dpr;
      textLayer.height = H * dpr;
      const tl = textLayer.getContext('2d');
      if (!tl) return done();
      tl.scale(dpr, dpr);
      tl.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('letterSpacing' in tl) (tl as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
      tl.textBaseline = 'alphabetic';
      tl.fillStyle = cs.color;
      const m = tl.measureText(children);
      const asc = m.fontBoundingBoxAscent || fs * 0.97;
      const desc = m.fontBoundingBoxDescent || fs * 0.24;
      // Linia bazowa jak w CSS: obszar treści wyśrodkowany w wysokości linii.
      const baseline = oy + (th - (asc + desc)) / 2 + asc;
      tl.fillText(children, ox, baseline);

      // 2. Drobinki z pikseli liter — maska próbkowana w 1× (pozycje drobinek są w px CSS):
      //    4× mniej pikseli do odczytu niż w rozdzielczości ekranu, ta sama gęstość drobinek.
      const mask = document.createElement('canvas');
      mask.width = W;
      mask.height = H;
      const mk = mask.getContext('2d', { willReadFrequently: true });
      if (!mk) return done();
      mk.font = tl.font;
      if ('letterSpacing' in mk) (mk as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
      mk.textBaseline = 'alphabetic';
      mk.fillText(children, ox, baseline);
      const img = mk.getImageData(0, 0, W, H).data;
      const step = Math.max(1, Math.round((fs / 24) * 1.5));
      const parts: P[] = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (img[(y * W + x) * 4 + 3]! < 150) continue;
          const tx = x, ty = y;
          const xf = (tx - ox) / tw; // 0 = lewa krawędź słowa, 1 = prawa
          parts.push({
            x: tx, y: ty,
            sx: tx + padR * (0.25 + Math.random() * 0.75),       // zawsze z prawej strony celu
            sy: ty - padY * (Math.random() * 0.9) + padY * 0.25 * (Math.random() - 0.5),
            cx: padR * 0.12 * Math.random(),                     // łuk wygina się w prawo, nie w lewo
            cy: -padY * 0.35 * Math.random(),
            d: xf * SPREAD + Math.random() * 0.08,
            r: (0.55 + Math.random() * 0.7) * Math.max(1, fs / 42),
            a: 0.6 + Math.random() * 0.4,
            loose: false,
          });
        }
      }
      // Odrobina luźnego pyłu za czołem — unosi się w prawo i gaśnie.
      const loose = Math.round(parts.length * 0.08);
      for (let i = 0; i < loose; i++) {
        const tx = ox + Math.random() * tw;
        const ty = oy + Math.random() * th;
        parts.push({
          x: tx + padR * (0.2 + Math.random() * 0.5), y: ty - padY * Math.random() * 0.6,
          sx: tx + padR * (0.4 + Math.random() * 0.6), sy: ty - padY * Math.random() * 0.5,
          cx: 0, cy: 0, d: ((tx - ox) / tw) * SPREAD, r: 0.5 + Math.random() * 0.6, a: 0.45, loose: true,
        });
      }

      // 3. Płótno nad słowem (lewa krawędź tuż przed tekstem — nie nachodzi na poprzednie słowo).
      canvas = document.createElement('canvas');
      canvas.className = 'dust__canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      Object.assign(canvas.style, { width: `${W}px`, height: `${H}px`, left: `${-padL}px`, top: `${-padY}px` });
      root!.appendChild(canvas);
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Warstwa pomocnicza: tekst odsłaniany od lewej, za czołem osiadającego pyłu.
      const reveal = document.createElement('canvas');
      reveal.width = canvas.width;
      reveal.height = canvas.height;
      const rv = reveal.getContext('2d')!;

      const color = cs.color;
      const minX = ox - 1;
      // Czoło przemiany pył → litera nadąża za momentem, w którym pył w danej kolumnie już osiadł.
      const front = (T: number) => (T - FLIGHT - 0.04) / SPREAD;
      const textAlphaAt = (xf: number, T: number) => smooth((front(T) - xf) / EDGE + 0.5);

      const t0 = performance.now();
      const frame = (now: number) => {
        const T = Math.min(1, (now - t0) / DURATION);

        ctx.clearRect(0, 0, W, H);

        // Litery: tekst z maską gradientu przesuwaną w prawo.
        const fx = ox + front(T) * tw;
        if (fx + EDGE * tw > ox) {
          rv.setTransform(1, 0, 0, 1, 0, 0);
          rv.globalCompositeOperation = 'source-over';
          rv.clearRect(0, 0, reveal.width, reveal.height);
          rv.drawImage(textLayer, 0, 0);
          rv.globalCompositeOperation = 'destination-in';
          const half = (EDGE * tw * dpr) / 2;
          const g = rv.createLinearGradient(fx * dpr - half, 0, fx * dpr + half, 0);
          g.addColorStop(0, 'rgba(0,0,0,1)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          rv.fillStyle = g;
          rv.fillRect(0, 0, reveal.width, reveal.height);
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(reveal, 0, 0);
          ctx.restore();
        }

        // Pył: leci do celu, a gdy litera w jego kolumnie się pojawia — rozpuszcza się w niej.
        ctx.fillStyle = color;
        for (const p of parts) {
          const k = Math.min(1, Math.max(0, (T - p.d) / FLIGHT));
          if (k <= 0) continue;
          const e = easeOut(k);
          const arc = Math.sin(e * Math.PI);
          const x = Math.max(minX, p.sx + (p.x - p.sx) * e + p.cx * arc);
          const y = p.sy + (p.y - p.sy) * e + p.cy * arc;
          let alpha = p.a * Math.min(1, k * 4);
          if (p.loose) alpha *= 1 - e;
          else alpha *= 1 - textAlphaAt((p.x - ox) / tw, T);
          if (alpha <= 0.01) continue;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, p.r * (1 - e * 0.3), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        if (T < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          // W tej samej klatce: zwykły tekst w miejsce identycznego obrazu z płótna.
          done();
          canvas?.remove();
          canvas = null;
        }
      };
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      // Font musi być gotowy (kształt liter na płótnie = tekst), a nagłówek po swoim wjeździe.
      // Start w wolnej chwili przeglądarki (nie w trakcie hydratacji), najpóźniej po 600 ms.
      const idle = (cb: () => void) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 600 }) : 0);
      (document.fonts?.ready ?? Promise.resolve()).then(() => {
        timer = window.setTimeout(() => { idleId = idle(run); if (!idleId) run(); }, 280);
      });
    }, { threshold: 0.6, rootMargin: '0px 0px -10% 0px' });
    io.observe(root);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      if (idleId) window.cancelIdleCallback?.(idleId);
      cancelAnimationFrame(raf);
      canvas?.remove();
    };
  }, [children]);

  return (
    <span ref={ref} className="dust">
      <span className="dust__text">{children}</span>
    </span>
  );
}
