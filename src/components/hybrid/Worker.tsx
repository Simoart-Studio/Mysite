'use client';

import { useState } from 'react';
import styles from './Worker.module.scss';

const DUST = [-15, -8, -2, 5, 12] as const;
const CHIPS = [
  { dx: -22, dy: -20, r: -160 }, { dx: -9, dy: -28, r: 120 }, { dx: 10, dy: -26, r: -90 }, { dx: 21, dy: -17, r: 200 },
] as const;

/**
 * Robotnik z młotem udarowym (tylko telefon): wchodzi na środek nad nagłówek, wierci 2 s (drgania, pył,
 * odpryski, pęknięcie), z dziury wyskakuje pudełko z mini zabawą (ikona pracowni), a on odskakuje i idzie dalej.
 *
 * Ruch: jedna oś czasu (`trip`) animuje kilka zarejestrowanych właściwości (--walk, --amp, --lean, --tilt,
 * --crouch, --look); stawy postaci mają zwykłe, zapętlone cykle (krok, zgięcie kolana, kołysanie, drgania)
 * skalowane tymi wartościami — dzięki temu przejścia między chodem, wierceniem i odskokiem są płynne.
 * Oś czasu jest wspólna z ikoną (zmienne na .copy w HeroStudio) — bez timerów JS. Po zejściu znika z DOM.
 */
export function Worker() {
  const [on, setOn] = useState(true);
  if (!on) return null;

  return (
    <span className={styles.lane} aria-hidden="true">
      {/* pęknięcie w miejscu wiercenia i podmuch przy wyskoku pudełka */}
      <svg className={styles.crack} viewBox="0 0 120 12" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 1L54 5L57 7L47 10M60 1L66 4L63 7L74 9M60 1L60 6M47 10L40 11M74 9L82 11" />
      </svg>
      <span className={styles.burst} />

      <span className={styles.worker} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setOn(false); }}>
        <span className={styles.shadow} />
        <span className={styles.bob}>
          <svg className={styles.svg} viewBox="0 0 110 120" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* ── noga dalsza (ciemniejsza), potem bliższa: udo → kolano → podudzie → but ── */}
            {(['back', 'front'] as const).map((side) => (
              <g key={side} className={side === 'back' ? `${styles.thigh} ${styles.legBack}` : styles.thigh}>
                <path d="M44 66V89" className={styles.pants} />
                <g className={styles.shin}>
                  <path d="M44 89V110" className={styles.pants} />
                  <path d="M40 110.5h13.5a3.5 3.5 0 0 1 3.5 3.5v1.5H40z" className={styles.boot} />
                  <path d="M39.5 117.2H57.4" className={styles.sole} />
                </g>
              </g>
            ))}

            {/* ── górna część ciała: przechył wokół biodra, przysiad ── */}
            <g className={styles.upper}>
              <g className={styles.torso}>
                {/* ręka dalsza (za tułowiem) */}
                <path d="M47 40L55 51L61 46.5" className={styles.sleeveBack} />

                {/* tułów: koszula, kamizelka odblaskowa z pasami, pas z klamrą */}
                <path d="M37 41c0-5 3-7.5 8-7.5h3c5 0 8 2.5 8 7.5l-.6 24.5H37.6z" className={styles.shirt} />
                <path d="M37.3 42c0-4.5 2.7-7 7.2-7.4V65.5H37.6zM48.2 34.6c4.6.4 7.5 2.9 7.5 7.4l-.5 23.5h-7z" className={styles.vest} />
                <path d="M37.4 50.5h7.1M48.2 50.5h7.3M37.5 57.5h7M48.2 57.5h7.1" className={styles.reflect} />
                <rect x="36.6" y="63.5" width="19.6" height="5" rx="1.6" className={styles.belt} />
                <rect x="44.6" y="63.9" width="4" height="4.2" rx="0.8" className={styles.buckle} />

                {/* głowa: szyja, twarz, ucho, nos, wąs, oko z brwią, kask */}
                <g className={styles.head}>
                  <rect x="44.5" y="29" width="6" height="6" rx="2" className={styles.skin} />
                  <circle cx="48.5" cy="23.5" r="8.6" className={styles.skin} />
                  <circle cx="44.3" cy="24.5" r="1.9" className={styles.ear} />
                  <path d="M56.6 23.2c1.6.4 1.9 2.2.2 2.8" className={styles.nose} />
                  <path d="M51.8 28.3c1.6.9 3.4.9 4.8-.2" className={styles.stache} />
                  <circle cx="53.3" cy="22.6" r="1.15" className={styles.eye} />
                  <path d="M51.6 19.9l3.4-.4" className={styles.brow} />
                  <path d="M39 21.5C39 12 58.5 11.5 58.5 21.5Z" className={styles.helmet} />
                  <path d="M42 17c1.8-3.4 5.6-4.6 9.4-3.6" className={styles.shineHelmet} />
                  <path d="M48.7 12.8v8.4" className={styles.ridge} />
                  <path d="M37.2 21.6h25.3c1.3 0 1.3 2.1-.3 2.1H37.2c-1.2 0-1.2-2.1 0-2.1z" className={styles.brim} />
                </g>

                {/* ── młot: obrót wokół chwytu (ręce zostają na rękojeści); kołysanie w marszu, drgania przy pracy ── */}
                <g className={styles.hammer}>
                  <g className={styles.sway}>
                    <g className={styles.buzz}>
                      <path d="M57.5 45h17" className={styles.handle} />
                      <path d="M66 47v2" className={styles.handle} />
                      <rect x="60.4" y="48.5" width="11.2" height="24" rx="3.2" className={styles.casing} />
                      <path d="M61.2 54h9.6M61.2 58h9.6M61.2 62h9.6" className={styles.ribs} />
                      <rect x="61.6" y="50" width="2.2" height="20" rx="1.1" className={styles.gleam} />
                      <rect x="61.8" y="72.2" width="8.4" height="6" rx="1.6" className={styles.collar} />
                      <path d="M66 78v33" className={styles.chisel} />
                      <path d="M64.3 110.6L66 117.6l1.7-7z" className={styles.chiselTip} />
                      {/* rękawice na rękojeści */}
                      <circle cx="60.6" cy="45.4" r="3.3" className={styles.glove} />
                      <circle cx="71.2" cy="45.4" r="3.3" className={styles.glove} />
                    </g>
                  </g>
                </g>

                {/* ręka bliższa (przed tułowiem), kończy się przy rękawicy */}
                <path d="M48.5 40.5L59 53L69.5 47" className={styles.sleeve} />
              </g>
            </g>
          </svg>
        </span>

        {/* pył i odpryski spod grotu */}
        <span className={styles.debris}>
          {DUST.map((dx, i) => <i key={dx} className={styles.dust} style={{ '--dx': `${dx}px`, '--i': i } as React.CSSProperties} />)}
          {CHIPS.map((c, i) => (
            <i key={i} className={styles.chip} style={{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, '--r': `${c.r}deg`, '--i': i } as React.CSSProperties} />
          ))}
        </span>
      </span>
    </span>
  );
}
