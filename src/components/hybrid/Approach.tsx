'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/components/concept/useScrollProgress';
import { registerAnchor } from '@/lib/scrollLock';
import styles from './Approach.module.scss';

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, v: number) => { const x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };

/* Perspektywa i głębokość startu: skala = P / (P − z); na starcie 1/12, na telefonie 1/5 (lepiej widać) */
const P = 1200;
const Z0 = P * 11;
const Z0_NARROW = P * 4;
/* Próg „wskoczenia”: po jego przekroczeniu sekcja dolatuje sama (z lekkim przestrzeleniem) */
const SNAP_IN = 0.8;
const SNAP_OUT = 0.68;

/* Tor lotu w ekranie (ułamki vw/vh, 0 = środek): z prawej-góry, łuk w lewo, na środek */
const pathX = (e: number) => {
  const q = Math.max(0, 1 - e);
  return 0.32 * q ** 1.6 - 0.2 * Math.sin(Math.PI * clamp(e, 0, 1)) * q ** 0.7;
};
const pathY = (e: number) => {
  const q = Math.max(0, 1 - e);
  return -0.3 * q ** 1.4 + 0.05 * Math.sin(Math.PI * clamp(e, 0, 1)) * q;
};

/**
 * Sekcja nadlatująca jak samolot: przypięta na ekranie, z dalekiej, małej sylwetki zbliża się po łuku
 * (przechył, myszkowanie, lekka turbulencja), a na końcu wskakuje na środek w naturalnym rozmiarze.
 * Postęp przewijania jest wygładzany sprężyną — ruch pozostaje płynny przy skokowym kółku myszy.
 */
export function Approach({ children, target }: { children: ReactNode; target?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current, box = plane.current;
    if (!el || !box) return;
    if (prefersReducedMotion()) { el.classList.add(styles.off!); return; }
    el.classList.add(styles.armed!);

    const distance = () => window.innerHeight * (window.innerWidth < 700 ? 1 : 1.3);
    const progress = () => clamp(-el.getBoundingClientRect().top / distance(), 0, 1);

    let e = progress(), v = 0, snapped = e >= SNAP_IN, landed = false;
    if (snapped) e = 1;
    let raf = 0, visible = false, last = 0;
    const t0 = performance.now();

    const render = (time: number) => {
      if (e >= 1 - 1e-4 && Math.abs(v) < 1e-3 && snapped) {
        // dokładnie w miejscu: bez transformacji — ostry tekst, zero kosztu kompozycji
        if (!landed) { box.style.transform = ''; box.style.opacity = ''; el.classList.add(styles.landed!); landed = true; }
        return;
      }
      if (landed) { el.classList.remove(styles.landed!); landed = false; }
      const vw = window.innerWidth, vh = window.innerHeight;
      // telefon: płytszy lot i mniejszy łuk — sylwetka od początku czytelna i nie wychodzi poza ekran
      const narrow = vw < 700;
      const q = Math.max(0, 1 - e);
      const z = e <= 1 ? -(narrow ? Z0_NARROW : Z0) * q ** 1.25 : (e - 1) * P * 2;
      const reach = narrow ? 0.55 : 1;
      const s = P / (P - z);
      // kierunek lotu → przechył i myszkowanie
      const d = (pathX(Math.min(e, 1) + 0.01) - pathX(Math.min(e, 1))) / 0.01;
      const amp = q ** 1.5;
      const tt = time / 1000;
      const sx = pathX(e) * vw * reach + Math.sin(tt * 1.3) * 10 * amp;
      const sy = pathY(e) * vh * reach + Math.sin(tt * 1.9 + 1) * 7 * amp;
      const roll = clamp(d * 14, -20, 20) * smooth(0, 0.25, e) + Math.sin(tt * 1.1) * 1.6 * amp;
      const yaw = d * 12 * q;
      const pitch = 14 * q;
      box.style.transform =
        `perspective(${P}px) translate3d(${(sx / s).toFixed(2)}px, ${(sy / s).toFixed(2)}px, ${z.toFixed(2)}px) ` +
        `rotateZ(${roll.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg) rotateX(${pitch.toFixed(3)}deg)`;
      box.style.opacity = String(smooth(0, 0.05, e));
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(1 / 30, (now - (last || now)) / 1000);
      last = now;
      const raw = progress();
      // za sekcją (skok przewijania, przywrócenie pozycji po „wstecz”): od razu stan wylądowany, bez lotu
      if (raw >= 1) { e = 1; v = 0; snapped = true; }
      if (!snapped && raw >= SNAP_IN) snapped = true;
      else if (snapped && raw < SNAP_OUT) snapped = false;
      const goal = snapped ? 1 : raw;
      // sprężyna: śledzenie krytycznie tłumione, wskoczenie z przestrzeleniem
      const w = snapped ? 11 : 14, z = snapped ? 0.52 : 1;
      const steps = Math.max(1, Math.ceil(dt * 240)), h = dt / steps;
      for (let i = 0; i < steps; i++) {
        v += (w * w * (goal - e) - 2 * z * w * v) * h;
        e += v * h;
      }
      if (Math.abs(goal - e) < 1e-4 && Math.abs(v) < 1e-3) { e = goal; v = 0; }
      render(now - t0);
      if (visible && !landed) raf = requestAnimationFrame(frame);
    };
    // Każde przewinięcie liczy co najmniej jedną klatkę (także zanim IntersectionObserver zgłosi widoczność —
    // np. przy przywróceniu pozycji po „wstecz”), a pętla trwa dalej tylko, gdy sekcja jest w pobliżu ekranu.
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

    // Kotwica sekcji: menu, nawigacja i linki „#…” (wspólne scrollToTarget) prowadzą do wylądowanej sekcji.
    // Wrapper nie jest przekształcany, więc jego pozycja jest wiarygodna w każdej fazie lotu.
    const landedTop = () => el.getBoundingClientRect().top + window.scrollY + distance() * 0.9;
    const unregister = target ? registerAnchor(target, landedTop) : undefined;
    // Wejście z adresem #target (link z innej podstrony, odświeżenie): przeglądarka/router przewija do
    // przekształconego elementu, czyli w złe miejsce — poprawiamy na wylądowaną sekcję
    if (target && location.hash === `#${target}`) {
      e = 1; v = 0; snapped = true;
      requestAnimationFrame(() => window.scrollTo({ top: landedTop(), behavior: 'instant' }));
    }

    const io = new IntersectionObserver(([en]) => { visible = !!en?.isIntersecting; kick(); }, { rootMargin: '20% 0px' });
    io.observe(el);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    render(0);

    return () => {
      unregister?.();
      io.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      box.style.transform = ''; box.style.opacity = '';
      el.classList.remove(styles.armed!, styles.landed!);
    };
  }, [target]);

  return (
    <div ref={ref} className={styles.approach}>
      <div className={styles.pin}>
        <div ref={plane} className={styles.plane}>{children}</div>
      </div>
      <div className={styles.spacer} aria-hidden="true" />
    </div>
  );
}
