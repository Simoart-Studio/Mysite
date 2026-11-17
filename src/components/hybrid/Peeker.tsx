'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './Peeker.module.scss';

const SAY = 'Cześć, zbudujesz coś ze mną?';

/**
 * Maskotka-budowlaniec w klimacie logo, wychylająca się zza uchwytu pracowni (desktop): głowa to kostka jak
 * litery z logo (front, bok z oczkami, połysk) w żółtym kasku, z kostki spływa czarna farba na pomarańczową
 * kamizelkę odblaskową, robocze rękawice; całość z białą obwódką naklejki (filtr SVG).
 * Renderowana obok przycisku-uchwytu, w jego opakowaniu (to samo pudełko): SVG stoi na górnej krawędzi, a wszystko poniżej y = 120
 * przycina viewport — postać „stoi za pudełkiem”.
 *
 * Geometria (jednostki SVG = px): biodro (106, 150) ukryte za pudełkiem; pochylenie −14° wokół biodra.
 * Pozy rąk wyznaczone w układzie ŚWIATA (po pochyleniu) i przeliczone obrotem odwrotnym do układu tułowia:
 *   ręka dalsza: bark (100.2, 85.5) → łokieć (110, 101) → dłoń płasko na krawędzi pudełka (116, 117)
 *   ręka bliższa (rozwiązana numerycznie, nadgarstek 8°): bark (81.18, 91.78) → łokieć pod kątem 117°
 *     (naturalne zgięcie przy wskazywaniu czegoś tuż przed sobą) → palec w osi dłoni, opuszek 0.6 px nad
 *     krawędzią pudełka. Stuknięcie: bark +6.7° i łokieć −13° unoszą opuszek o 2.2 px PIONOWO.
 *
 * Oczy śledzą kursor (zmienne --px/--py, maks. 1.4 jedn.); po 2.5 s bez ruchu wracają na pudełko.
 */
export function Peeker({ away }: { away: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const fid = `sticker${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const el = root.current, eg = eyes.current;
    if (!el || !eg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, idle = 0, x = 0, y = 0;
    const rest = () => { el.style.setProperty('--px', '0.6'); el.style.setProperty('--py', '1.1'); };
    const apply = () => {
      raf = 0;
      const r = eg.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 240) * 1.4; // nasycenie przy ~240 px
      el.style.setProperty('--px', ((dx / d) * k).toFixed(2));
      el.style.setProperty('--py', ((dy / d) * k).toFixed(2));
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
      clearTimeout(idle);
      idle = window.setTimeout(rest, 2500);
    };
    rest();
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); clearTimeout(idle); };
  }, []);

  return (
    <span ref={root} className={`${styles.root} ${away ? styles.away : ''}`} aria-hidden="true">
      {/* dymek-naklejka: wyskakuje przy machnięciu ręką i „pisze” tekst litera po literze */}
      <span className={styles.bubble}>
        {Array.from(SAY).map((ch, i) => (
          <span key={i} className={styles.ch} style={{ '--i': i } as React.CSSProperties}>{ch === ' ' ? ' ' : ch}</span>
        ))}
        <i className={styles.caret} />
      </span>

      <svg className={styles.svg} viewBox="0 0 132 120" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          {/* biała obwódka naklejki wokół całej sylwetki (jak wycięcie logo) */}
          <filter id={fid} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="cut" />
            <feFlood floodColor="#FFFDF6" />
            <feComposite in2="cut" operator="in" result="edge" />
            <feMerge><feMergeNode in="edge" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className={styles.rise}>
          <g className={styles.lean} filter={`url(#${fid})`}>
            {/* ── ręka dalsza: wzdłuż boku, dłoń płasko na krawędzi pudełka ── */}
            <path d="M116.4 88L121.7 103.4L123.4 117.8" className={styles.sleeveLine} />
            <path d="M116.4 88L121.7 103.4L123.4 117.8" className={styles.sleeve} />
            <path d="M120.4 114.6h6.2" className={styles.cuffLine} />
            <path d="M120.4 114.6h6.2" className={styles.cuff} />
            <path d="M119.6 117.2c0-1.6 1.4-2.6 3.6-2.6h1.4c2.4 0 3.8 1.4 3.6 3.4l-.2 2H119.8z" className={styles.glove} />
            <path d="M122.2 117.6v2.6M124.8 117.6v2.6" className={styles.gloveLine} />

            {/* ── tułów: koszula robocza + pomarańczowa kamizelka odblaskowa (oddycha) ── */}
            <g className={styles.breathe}>
              <path d="M90 89c0-5.4 4.6-9.4 10.4-9.4h11.2c5.8 0 10.4 4 10.4 9.4l1.2 61H88.8z" className={styles.shirt} />
              <path d="M99.4 74.4h13.2l-.2 6.8-6.4 5.4-6.4-5.4z" className={styles.neck} />
              <path d="M99.6 80.4l6.4 6.2 6.4-6.2" className={styles.collar} />
              {/* kamizelka rozpięta: dwa poły, między nimi koszula */}
              <path d="M91.4 90c.2-5 2.8-8.2 7.6-8.8h4.4l.4 68.8H90.2z" className={styles.vest} />
              <path d="M108.6 81.2h4.4c4.8.6 7.4 3.8 7.6 8.8l1.2 60H108.2z" className={styles.vest} />
              {/* pasy odblaskowe */}
              <path d="M90.9 101.6h12.9v3.4H90.8zM108.4 101.6h12.6l.1 3.4h-12.7z" className={styles.reflect} />
              <path d="M90.7 111.6h13.2v3.4H90.6zM108.3 111.6h12.9l.1 3.4h-13z" className={styles.reflect} />
              {/* kieszeń z ołówkiem stolarskim */}
              <path d="M110.2 92.4h7.4v5.6h-7.4z" className={styles.pocket} />
              <path d="M114.6 92.6l1.6-6.4" className={styles.pencilLine} />
              <path d="M114.6 92.6l1.6-6.4" className={styles.pencil} />
              <path d="M116.2 86.2l.4-1.6" className={styles.pencilTip} />

              {/* ── głowa-kostka w kasku: rozgląda się przy wejściu, unosi przy najechaniu ── */}
              <g className={styles.head}>
                {/* farba spływająca z kostki na kamizelkę */}
                <path d="M96.2 73.6c-.2 2.8-.6 4.6.3 5.9.9 1.3 2.8.7 2.5-1.2-.2-1.5-.1-3 .2-4.7z" className={styles.drip} />
                <path d="M104.6 74c0 3.8-.6 6.6.5 8.4 1 1.6 3.2.9 2.9-1.3-.3-2-.3-4.6.1-7.1z" className={styles.drip} />
                <path d="M106.3 84.6c-.8 1-1.2 1.9-1.2 2.5 0 .9.6 1.4 1.3 1.4s1.3-.5 1.3-1.4c0-.6-.5-1.5-1.4-2.5z" className={styles.drip} />
                <path d="M114 73.6c0 2.6-.4 4.2.4 5.2.8 1 2.4.5 2.1-.9-.2-1.2-.1-2.5.2-4z" className={styles.drip} />
                <path d="M97.3 76.2v1.6M105.6 77v2.6" className={styles.dripShine} />

                {/* bok kostki z oczkami i front */}
                <path d="M118.8 50.6l4.1-3.5c1.1-.9 2.7-.1 2.7 1.3v19.4c0 .9-.4 1.7-1.1 2.3l-4.1 3.5z" className={styles.dieSide} />
                <ellipse cx="122.1" cy="57.4" rx="1" ry="1.5" transform="rotate(-18 122.1 57.4)" className={styles.pip} />
                <ellipse cx="122.1" cy="65.6" rx="1" ry="1.5" transform="rotate(-18 122.1 65.6)" className={styles.pip} />
                <rect x="92.6" y="48.6" width="27.6" height="26" rx="5.2" className={styles.dieFront} />
                <path d="M95.8 56.2c.2-1.6 1.2-2.4 2.8-2.6h4.4" className={styles.gloss} />

                {/* twarz: oczy (źrenice śledzą kursor, mrugają), brwi, uśmiech, rumieńce */}
                <ellipse cx="100.6" cy="70.6" rx="2.1" ry="1.1" className={styles.blush} />
                <ellipse cx="114.2" cy="70.6" rx="2.1" ry="1.1" className={styles.blush} />
                <g className={styles.blink}>
                  <ellipse cx="101.6" cy="62.4" rx="3.5" ry="3.9" className={styles.white} />
                  <ellipse cx="111.6" cy="62.4" rx="3.5" ry="3.9" className={styles.white} />
                  <g ref={eyes} className={styles.eyes}>
                    <circle cx="101.6" cy="62.6" r="1.95" className={styles.pupil} />
                    <circle cx="111.6" cy="62.6" r="1.95" className={styles.pupil} />
                    <circle cx="102.3" cy="61.8" r="0.65" className={styles.spark} />
                    <circle cx="112.3" cy="61.8" r="0.65" className={styles.spark} />
                  </g>
                </g>
                <g className={styles.brows}>
                  <path d="M98.4 57.4c1.4-1 3.4-1.3 5.1-.6M109.6 56.8c1.7-.7 3.7-.4 5.1.6" className={styles.brow} />
                </g>
                <path d="M103.2 68.2c1.9 2.1 5 2.1 6.8 0" className={styles.mouth} />
                <g className={styles.grin}>
                  <path d="M102.6 67.8c.6 4.2 7.4 4.2 8 0z" className={styles.grinIn} />
                  <path d="M104.8 70.5c.9-.9 2.7-.9 3.6 0-.9.7-2.7.7-3.6 0z" className={styles.tongue} />
                </g>

                {/* kask: kopuła z grzbietem i połyskiem, daszek, mała naklejka-kostka */}
                <path d="M92.6 50.2c0-10.6 6.4-15.8 15.2-15.8s15.6 5.2 15.6 14.6v1.2z" className={styles.helmet} />
                <path d="M107.6 34.8c-.6 4.8-.6 10 0 15" className={styles.ridge} />
                <path d="M96.4 44.2c.8-3.6 3.4-6.2 7-7" className={styles.helmetShine} />
                <rect x="113.6" y="40.4" width="4" height="4" rx="1" className={styles.badge} />
                <circle cx="115.6" cy="42.4" r="0.55" className={styles.badgePip} />
                <path d="M89.4 49.2h36.4c1.6 0 1.8 3 0 3H89.4c-1.6 0-1.6-3 0-3z" className={styles.brim} />
              </g>
            </g>

            {/*
              ── ręka bliższa: szkielet bark → łokieć → nadgarstek (kinematyka odwrotna, patrz komentarz na górze) ──
              Kontur ramienia pod spodem, przedramię z dłonią, na wierzchu wypełnienie ramienia (zakrywa obrys
              w łokciu — staw się nie „łamie”). Osie: bark (96, 87.5), łokieć (89.74, 99.57),
              nadgarstek (95.91, 108.19). Dwie dłonie: otwarta (machanie) i wskazująca (palec na osi dłoni).
            */}
            <g className={styles.armU}>
              <g className={styles.tapU}>
                <path d="M96.00 87.50L89.74 99.57" className={styles.sleeveLine} />
                <g className={styles.armF}>
                  <g className={styles.tapF}>
                    <path d="M89.74 99.57L95.91 108.19" className={styles.sleeveLine} />
                    <path d="M89.74 99.57L95.91 108.19" className={styles.sleeve} />
                    <g className={styles.armH}>
                      <path d="M91.62 108.40L98.36 104.88" className={styles.cuffLine} />
                      <path d="M91.62 108.40L98.36 104.88" className={styles.cuff} />
                      {/* dłoń wskazująca: pięść, palec wskazujący w osi, podwinięty kciuk */}
                      <g className={styles.pointer}>
                        <path d="M97.22 111.35L99.76 115.55" className={styles.fingerLine} />
                        <path d="M97.22 111.35L99.76 115.55" className={styles.finger} />
                        <path d="M93.17 110.08C92.66 109.10 93.18 108.15 94.25 107.60C95.49 106.95 96.55 106.39 96.73 106.30C97.79 105.74 98.78 106.13 99.34 107.19C99.75 107.99 100.17 108.79 100.50 109.41C101.01 110.38 100.49 111.33 99.60 111.79C98.54 112.35 97.83 112.72 96.94 113.18C95.88 113.74 94.89 113.36 94.42 112.47Z" className={styles.glove} />
                        <path d="M98.08 109.09L99.58 108.31M98.77 110.42L100.28 109.64" className={styles.gloveLine} />
                        <path d="M93.82 111.32C94.78 110.14 96.13 110.11 96.86 111.08" className={styles.thumb} />
                      </g>
                      {/* dłoń otwarta do machania: rozczapierzone palce, odstający kciuk */}
                      <g className={styles.palm}>
                        <path d="M95.91 113.16L96.69 116.81M97.24 112.46L99.06 116.59M98.66 111.72L100.79 115.57M99.99 111.03L102.27 113.67M93.90 110.60L92.17 113.99" className={styles.fingerLine} />
                        <path d="M95.91 113.16L96.69 116.81M97.24 112.46L99.06 116.59M98.66 111.72L100.79 115.57M99.99 111.03L102.27 113.67M93.90 110.60L92.17 113.99" className={styles.finger} />
                        <path d="M93.17 109.85C92.66 108.88 93.22 108.02 94.20 107.51C95.44 106.86 96.50 106.30 96.50 106.30C97.57 105.75 98.56 106.13 99.07 107.11C99.67 108.26 100.23 109.55 100.52 110.53C100.63 111.60 99.83 112.24 98.41 112.98C97.00 113.72 95.88 113.96 95.15 113.22C94.51 112.42 93.82 111.09 93.17 109.85Z" className={styles.glove} />
                      </g>
                    </g>
                  </g>
                </g>
                <path d="M96.00 87.50L89.74 99.57" className={styles.sleeve} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
