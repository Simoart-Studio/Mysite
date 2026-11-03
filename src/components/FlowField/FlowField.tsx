'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion, useScroll, useVelocity, useMotionValueEvent } from 'framer-motion';

/* ─── Tuning ─── */
const STAR_COUNT       = 200;
const MOUSE_RADIUS     = 100;
const MOUSE_STRENGTH   = 0.22;
const CLICK_RADIUS     = 180;
const CLICK_STRENGTH   = 2.2;
const SPRING_K         = 0.016;
const DAMPING          = 0.93;
const PROX_GLOW_RADIUS = 110;
const MAX_ALPHA        = 0.78;

interface Star {
  nx: number; ny: number; // normalized home position 0..1 in virtual space
  ox: number; oy: number; // physics offset — springs back to 0
  vx: number; vy: number;
  depth: number;          // 0.12..0.96 — drives parallax, size, brightness
  r: number;
  alpha: number;
  phase: number;
  driftPhase: number;
  driftAmt: number;       // orbital drift amplitude px
}

interface Ring { x: number; y: number; r: number; a: number; }

export function FlowField() {
  const reduced    = useReducedMotion();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);
  const velRef     = useRef(0);
  const mouseXRef  = useRef(-999);
  const mouseYRef  = useRef(-999);
  const burstRef   = useRef<{ x: number; y: number } | null>(null);

  const { scrollY } = useScroll();
  const velocity    = useVelocity(scrollY);

  useMotionValueEvent(scrollY,  'change', (v) => { scrollYRef.current = v; });
  useMotionValueEvent(velocity, 'change', (v) => { velRef.current     = v; });

  useEffect(() => {
    if (reduced !== false) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    let W = 0, H = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width  = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    // Zmiana rozmiaru czyści płótno — przerysuj klatkę
    const onResize = () => { resize(); wake(); };
    window.addEventListener('resize', onResize);

    function onMove(e: MouseEvent) {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      wake();
    }
    function onClick(e: MouseEvent) {
      burstRef.current = { x: e.clientX, y: e.clientY };
      wake();
    }
    function onLeave() {
      mouseXRef.current = -999;
      mouseYRef.current = -999;
      wake();
    }
    // Palec działa jak kursor: odpycha i rozświetla gwiazdki pod sobą
    function onTouch(e: TouchEvent) {
      const t0 = e.touches[0];
      if (!t0) return;
      mouseXRef.current = t0.clientX;
      mouseYRef.current = t0.clientY;
      wake();
    }
    function onTouchEnd() {
      mouseXRef.current = -999;
      mouseYRef.current = -999;
      wake();
    }
    function onScroll() { wake(); }
    window.addEventListener('mousemove',   onMove);
    window.addEventListener('click',       onClick);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchstart',  onTouch,    { passive: true });
    window.addEventListener('touchmove',   onTouch,    { passive: true });
    window.addEventListener('touchend',    onTouchEnd, { passive: true });
    window.addEventListener('scroll',      onScroll,   { passive: true });

    const count = W < 768 ? 90 : STAR_COUNT;

    function makeStars(): Star[] {
      return Array.from({ length: count }, () => {
        const depth = Math.pow(Math.random(), 1.6) * 0.84 + 0.12;
        return {
          nx: Math.random(),
          ny: Math.random(),
          ox: 0, oy: 0,
          vx: 0, vy: 0,
          depth,
          r:          0.3 + depth * 1.6,
          alpha:      0.12 + depth * 0.63,
          phase:      Math.random() * Math.PI * 2,
          driftPhase: Math.random() * Math.PI * 2,
          driftAmt:   6 + Math.random() * 10 * depth,
        };
      });
    }

    const stars = makeStars();
    const rings: Ring[] = [];
    // Czas zamrożony: bez dryfu i migotania w spoczynku. Ruch tylko w reakcji na kursor, palec i przewijanie.
    const t = 0;
    let raf = 0;

    let running = false;
    let ready = false;
    let lastInput = 0;

    /** Uruchamia pętlę animacji; sama się zatrzyma, gdy gwiazdki się uspokoją. */
    function wake() {
      lastInput = performance.now();
      if (!ready || running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }

    function draw() {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      let energy = 0;

      ctx!.clearRect(0, 0, W, H);

      /* camera: scrollY expressed in "screens" — drives parallax */
      const cam    = scrollYRef.current / H;
      const vel    = velRef.current;
      const absVel = Math.abs(vel);
      const sDir   = vel > 0 ? -1 : 1;
      const mx     = mouseXRef.current;
      const my     = mouseYRef.current;

      /* burst impulse */
      if (burstRef.current) {
        const { x: bx, y: by } = burstRef.current;
        burstRef.current = null;
        rings.push({ x: bx, y: by, r: 0, a: 0.45 });

        for (const s of stars) {
          const driftX = Math.sin(t * 0.18 + s.driftPhase) * s.driftAmt;
          const driftY = Math.cos(t * 0.13 + s.driftPhase * 1.4) * s.driftAmt * 0.6;
          const rawNY  = s.ny - cam * s.depth;
          const sx     = s.nx * W + driftX + s.ox;
          const sy     = ((rawNY % 1 + 1) % 1) * H + driftY + s.oy;
          const dx     = sx - bx;
          const dy     = sy - by;
          const dist   = Math.hypot(dx, dy);
          if (dist < CLICK_RADIUS && dist > 0) {
            const f = (1 - dist / CLICK_RADIUS) * CLICK_STRENGTH * (0.4 + s.depth * 0.6);
            s.vx += (dx / dist) * f;
            s.vy += (dy / dist) * f;
          }
        }
      }

      /* rings */
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i]!;
        ring.r += 3.5;
        ring.a -= 0.013;
        if (ring.a <= 0) { rings.splice(i, 1); continue; }
        ctx!.beginPath();
        ctx!.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(181,101,74,${(ring.a * 0.9).toFixed(3)})`;
        ctx!.lineWidth   = 0.7;
        ctx!.stroke();
      }

      /* stars */
      for (const s of stars) {
        /* slow autonomous orbital drift */
        const driftX = Math.sin(t * 0.18 + s.driftPhase) * s.driftAmt;
        const driftY = Math.cos(t * 0.13 + s.driftPhase * 1.4) * s.driftAmt * 0.6;

        /* parallax: camera scrolls through virtual field, each depth layer moves at own rate */
        const rawNY    = s.ny - cam * s.depth;
        const wrappedY = ((rawNY % 1) + 1) % 1;
        const bx = s.nx * W + driftX;
        const by = wrappedY * H + driftY;

        /* mouse repulsion on physics offset */
        const sx0 = bx + s.ox;
        const sy0 = by + s.oy;
        const dxm = sx0 - mx;
        const dym = sy0 - my;
        const dm  = Math.hypot(dxm, dym);
        if (dm < MOUSE_RADIUS && dm > 0) {
          const f = (1 - dm / MOUSE_RADIUS) * MOUSE_STRENGTH * (0.3 + s.depth * 0.7);
          s.vx += (dxm / dm) * f;
          s.vy += (dym / dm) * f;
        }

        /* spring offset back to zero */
        s.vx += -s.ox * SPRING_K;
        s.vy += -s.oy * SPRING_K;
        s.vx *= DAMPING;
        s.vy *= DAMPING;
        s.ox += s.vx;
        s.oy += s.vy;
        energy += Math.abs(s.vx) + Math.abs(s.vy);

        const sx = bx + s.ox;
        const sy = by + s.oy;

        /* twinkle */
        const twinkle = 0.82 + 0.18 * Math.sin(t * 1.2 + s.phase);

        /* cursor glow */
        const dxp   = sx - mx;
        const dyp   = sy - my;
        const dp    = Math.hypot(dxp, dyp);
        const boost = dp < PROX_GLOW_RADIUS ? (1 - dp / PROX_GLOW_RADIUS) * 0.48 : 0;

        const alpha = Math.min(MAX_ALPHA, s.alpha * twinkle + boost);

        /* scroll streak — only at high velocities */
        const streakLen = Math.max(0, (absVel - 90) * 0.015 * s.depth);
        if (streakLen > 1) {
          const y1   = sy + sDir * streakLen;
          const grad = ctx!.createLinearGradient(sx, sy, sx, y1);
          grad.addColorStop(0, `rgba(142,74,51,${(alpha * 0.6).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(142,74,51,0)');
          ctx!.beginPath();
          ctx!.moveTo(sx, sy);
          ctx!.lineTo(sx, y1);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth   = s.r * 1.4;
          ctx!.stroke();
        }

        /* core */
        ctx!.beginPath();
        ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(142,74,51,${(alpha * 0.55).toFixed(3)})`;
        ctx!.fill();

        /* halo */
        if (s.depth > 0.52 || boost > 0.1) {
          const haloA = alpha * 0.10 + boost * 0.06;
          ctx!.beginPath();
          ctx!.arc(sx, sy, s.r * (2.4 + boost * 2.2), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(194,145,79,${(haloA * 0.9).toFixed(3)})`;
          ctx!.fill();
        }
      }

      // Spokój: brak fal, ruchu gwiazdek i świeżego wejścia → zatrzymaj pętlę (ostatnia klatka zostaje)
      const idleFor = performance.now() - lastInput;
      // średnia prędkość < 0.01 px/klatkę — ruch niezauważalny
      if (!rings.length && energy < stars.length * 0.01 && absVel < 1 && idleFor > 400) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    // Start dopiero, gdy przeglądarka jest bezczynna — nie konkuruje z pierwszym renderem (LCP/TBT)
    // Pierwsza klatka (statyczne gwiazdki), potem animacja tylko na żądanie
    const start = () => { ready = true; wake(); };
    const stop  = () => { running = false; cancelAnimationFrame(raf); };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : globalThis.setTimeout(start, 1200);

    return () => {
      stop();
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else globalThis.clearTimeout(idle);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize',    onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click',     onClick);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove',  onTouch);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('scroll',     onScroll);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100vw',
        height:        '100vh',
        pointerEvents: 'none',
        zIndex:        1,
        mixBlendMode:  'multiply',
      }}
      aria-hidden="true"
    />
  );
}
