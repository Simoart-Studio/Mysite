'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { BRAND } from '@/data/config';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import { Dust } from '@/components/Dust/Dust';
import { prefersReducedMotion } from '@/components/concept/useScrollProgress';
import styles from './GlassAbout.module.scss';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/**
 * Miło Cię poznać: naklejka z logo na macie pod szklaną pokrywą. Przewijanie wsuwa tekst z poślizgiem
 * (sprężyna z lekkim przechyłem od prędkości), a szkło matowieje i przygasza logo.
 *
 * Płynność: z przewijaniem zmieniają się wyłącznie transform/opacity sześciu elementów (kompozytor GPU),
 * rozmycie to raz wymalowana kopia naklejki przenikana kryciem; obsługa przewijania działa tylko, gdy sekcja
 * jest w pobliżu ekranu, i nie zapisuje stylów, jeśli postęp się nie zmienił.
 *
 * Odsłonięcie bez przewijania: kliknięcie/dotknięcie szkła (prawdziwy przycisk — działa też z klawiatury)
 * przeprowadza to samo przejście krótką animacją. Po opuszczeniu sekcji stan wraca do sterowania przewijaniem.
 */
export function GlassAbout() {
  const ref = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const sticker = useRef<HTMLDivElement>(null);
  const sharp = useRef<HTMLDivElement>(null);
  const soft = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLElement>(null);
  const frost = useRef<HTMLSpanElement>(null);
  const streak = useRef<HTMLElement>(null);
  const reveal = useRef<() => void>(() => {});

  useEffect(() => {
    const sec = ref.current, el = text.current;
    const st = sticker.current, sh = sharp.current, so = soft.current, sn = sheen.current, fr = frost.current, sk = streak.current;
    if (!sec || !el || !st || !sh || !so || !sn || !fr || !sk) return;

    /* stan szkła dla postępu f ∈ [0, 1]: same transform/opacity */
    let lastF = -1;
    const glass = (f: number) => {
      if (Math.abs(f - lastF) < 0.0005) return;
      lastF = f;
      st.style.transform = `translateY(-2%) scale(${(1.04 - f * 0.08).toFixed(4)}) rotate(${(-2 + f * 2).toFixed(3)}deg)`;
      // min. 0.001 (niewidoczne): warstwa z rozmyciem jest rasteryzowana z wyprzedzeniem, gdy sekcja się zbliża —
      // przy opacity 0 Chrome pomija malowanie i liczyłby rozmycie dopiero w trakcie przewijania (jedna długa klatka)
      so.style.opacity = Math.max(0.001, f).toFixed(4);
      sh.style.opacity = (1 - smooth(0.6, 1, f)).toFixed(4); // ostre krawędzie gasną dopiero na końcu
      fr.style.opacity = Math.max(0.001, f).toFixed(4);
      sn.style.transform = `translateX(${(-70.8 + f * 86.2).toFixed(2)}%)`;
      sk.style.transform = `translateX(${(-30 + f * 60).toFixed(2)}%)`;
      // treść odsłonięta → przycisk-szkło znika (klikalny staje się przycisk „Porozmawiajmy”); klasa zmienia się
      // tylko przy przekroczeniu progu, więc nie przelicza stylów co klatkę
      const open = f > 0.5;
      if (open !== isOpen) { isOpen = open; sec.classList.toggle(styles.open!, open); }
    };
    let isOpen = false;

    if (prefersReducedMotion()) {
      glass(1);
      el.style.transform = 'none';
      el.style.opacity = '1';
      return;
    }
    let raf = 0, target = 1, x = 1, v = 0;
    // odsłonięcie kliknięciem: forced = stan końcowy niezależnie od przewijania; tween = płynne dojście do f = 1
    let forced = false, tweenRaf = 0;
    const read = () => {
      const r = sec.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
      if (!forced) {
        glass(smooth(0.22, 0.62, p));           // zmatowienie szkła
        target = 1 - smooth(0.18, 0.55, p);     // 1 = tekst poza sceną, 0 = na miejscu
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    reveal.current = () => {
      if (forced) return;
      forced = true;
      const from = Math.max(0, lastF), t0 = performance.now(), dur = 750;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        glass(from + (1 - from) * ease(k));
        tweenRaf = k < 1 ? requestAnimationFrame(step) : 0;
      };
      cancelAnimationFrame(tweenRaf);
      tweenRaf = requestAnimationFrame(step);
      target = 0;                               // tekst wjeżdża tą samą sprężyną co przy przewijaniu
      if (!raf) raf = requestAnimationFrame(tick);
      // fokus na nagłówek odsłoniętej treści (przycisk znika — fokus nie może zostać na nim)
      el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    };
    const tick = () => {
      // sprężyna: tekst dojeżdża z poślizgiem i lekko przestrzeliwuje
      v = (v + (target - x) * 0.07) * 0.8;
      x += v;
      const skew = Math.max(-10, Math.min(10, v * -140));
      el.style.transform = `translate3d(${(x * 62).toFixed(2)}vw,0,0) skewX(${skew.toFixed(2)}deg)`;
      el.style.opacity = String(clamp01(1.25 - x * 1.6));
      raf = Math.abs(target - x) + Math.abs(v) > 0.0004 ? requestAnimationFrame(tick) : 0;
    };

    // nasłuch przewijania tylko, gdy sekcja jest w pobliżu ekranu
    let listening = false;
    const io = new IntersectionObserver(([e]) => {
      const near = !!e?.isIntersecting;
      if (near && !listening) window.addEventListener('scroll', read, { passive: true });
      if (!near && listening) window.removeEventListener('scroll', read);
      listening = near;
      // sekcja daleko poza ekranem: odsłonięcie kliknięciem wygasa — następnym razem znów steruje przewijanie
      if (!near && forced) { forced = false; cancelAnimationFrame(tweenRaf); }
      read();
    }, { rootMargin: '25% 0px' });
    io.observe(sec);
    window.addEventListener('resize', read);
    read();
    return () => {
      reveal.current = () => {};
      io.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(tweenRaf);
      window.removeEventListener('scroll', read); window.removeEventListener('resize', read);
    };
  }, []);

  return (
    <section ref={ref} id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.sticky}>
        <div className={styles.stage}>
          {/*
            Naklejka z logo na macie pod szkłem:
            1. winyl — wektorowy kontur die-cut (ostra krawędź w każdej skali), połysk krawędzi, grubość, laminat;
            2. grafika logo nałożona dokładnie w miejscu, z którego wygenerowano kontur;
            3. refleks laminatu przesuwający się z przewijaniem, przycięty maską do kształtu naklejki.
          */}
          <div ref={sticker} className={styles.sticker}>
            <div ref={sharp} className={styles.sharp}>
              <Image src="/logo-diecut.svg" alt="" width={908} height={499} unoptimized className={styles.vinyl} />
              <Image src="/logo.png" alt={`Logo ${BRAND}`} width={828} height={419} sizes="(max-width: 899px) 82vw, 660px" className={styles.art} />
              <span className={styles.sheen} aria-hidden="true"><i ref={sheen} /></span>
            </div>
            {/* kopia „pod zmatowiałym szkłem”: rozmyta raz (filtr statyczny), przewijanie zmienia tylko jej krycie */}
            <div ref={soft} className={styles.soft} aria-hidden="true">
              <Image src="/logo-diecut.svg" alt="" width={908} height={499} unoptimized className={styles.vinyl} />
              <Image src="/logo.png" alt="" width={828} height={419} sizes="(max-width: 899px) 82vw, 660px" className={styles.art} />
            </div>
          </div>
          <span ref={frost} className={styles.frost} aria-hidden="true" />
          <span className={styles.glass} aria-hidden="true"><i ref={streak} /></span>

          {/* szkło jako przycisk: kliknięcie/dotknięcie odsłania treść bez przewijania */}
          <button type="button" className={styles.reveal} onClick={() => reveal.current()} aria-controls="about-content" aria-label="Odsłoń: Miło Cię poznać" />

          <div ref={text} id="about-content" className={styles.text}>
            <h2 id="about-title" className={styles.title} tabIndex={-1}>Miło Cię <Dust>poznać.</Dust></h2>
            <p className={styles.hello}>Cześć, jestem Szymon.</p>
            <p className={styles.body}>
              Prowadzę {BRAND}. Sam projektuję i koduję strony, sklepy i aplikacje dla firm.
              Rozmawiasz z osobą, która zna Twój projekt od pierwszego szkicu po wdrożenie.
            </p>
            <ContactTrigger className="btn btn--green">
              Porozmawiajmy o Twoim projekcie
              <BtnIcon />
            </ContactTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
