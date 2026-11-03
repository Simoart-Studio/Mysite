'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { fromLeftProps, revealProps, EASE_WAVE } from '@/lib/motion';
import Image from 'next/image';
import { AVAILABILITY, BRAND, OWNER, EMAIL, PHONE, CALENDLY_URL, phoneHref } from '@/data/config';
import styles from './About.module.scss';

const FACTS = [
  { k: 'Specjalizacja', v: 'Strony sprzedażowe · Sklepy internetowe · Aplikacje webowe' },
  { k: 'Dla kogo',      v: 'Małe firmy · Startupy · Personal brand'                     },
  { k: 'Tryb pracy',    v: 'Zdalnie · Bezpośredni kontakt, bez pośredników'              },
  { k: 'Dostępność',    v: AVAILABILITY                                                   },
] as const;

/** Portret: ustaw np. { src: '/portrait.webp', width: 800, height: 1000 }. Null = karta z monogramem. */
const PORTRAIT: { src: string; width: number; height: number } | null = null;

const P1 = 'Tworzę strony i aplikacje od kilku lat. Zaczynałem od własnych projektów — dziś pomagam firmom zdobywać klientów przez internet, bo wiem że dobra strona to narzędzie sprzedaży, nie tylko wizytówka.';
const P2 = 'Interesują mnie strony, które muszą pracować — zbierać rezerwacje, generować zapytania, budować markę. Nie takie, które się tylko ogląda.';

export function About() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();
  const reducedDom = useReducedMotionSafe();

  const tw1 = useTypewriter(P1, !reduced && isInView, 22);
  const tw2 = useTypewriter(P2, !reduced && tw1.length === P1.length && isInView, 22);

  return (
    <section
      id="about"
      className={styles.section}
      ref={ref}
      aria-labelledby="about-title"
    >
      <div className={styles.inner}>

        {/* label col: sweeps from left */}
        <motion.div
          className={styles.col1}
          {...fromLeftProps(isInView, reduced, 0)}
        >
          <p className={styles.label}>O mnie</p>
          <div className={styles.portrait}>
            {PORTRAIT ? (
              <Image
                src={PORTRAIT.src}
                alt={`${OWNER}, ${BRAND}`}
                width={PORTRAIT.width}
                height={PORTRAIT.height}
                sizes="(max-width: 1023px) 200px, 180px"
                className={styles.portraitImg}
              />
            ) : (
              <div className={styles.monogram} role="img" aria-label={`${OWNER} — ${BRAND}`}>
                <span className={styles.monoTop}>{BRAND}</span>
                <span className={styles.monoLetters} aria-hidden="true">SP</span>
                <span className={styles.monoName}>{OWNER}</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className={styles.col2}>

          {/* headline: stage reveal — each line pours in */}
          <h2 id="about-title" className={styles.headline} aria-label="Buduję to, czego używają prawdziwi ludzie.">
            {['Buduję to,', 'czego używają', 'prawdziwi ludzie.'].map((line, i) => (
              <span key={i} className={styles.lineWrap} aria-hidden="true">
                <motion.span
                  className={styles.lineInner}
                  initial={reduced ? false : { y: '106%', skewY: 3 }}
                  animate={
                    reduced ? {} : isInView
                      ? { y: '0%', skewY: 0 }
                      : { y: '106%', skewY: 3 }
                  }
                  transition={reduced ? {} : { duration: 0.8, ease: EASE_WAVE, delay: 0.08 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* body: typewriter */}
          <div className={styles.body}>
            {[{ full: P1, typed: tw1 }, { full: P2, typed: tw2 }].map(({ full, typed }) => (
              <p key={full.slice(0, 12)} className={styles.typePara}>
                {/* Pełny tekst dla czytników i wyszukiwarek; widoczny bez JS */}
                <span className="sr-only">{full}</span>
                {/* Rezerwuje miejsce — brak skoku układu podczas pisania */}
                <span className={styles.ghost} aria-hidden="true">{full}</span>
                <span className={styles.typed} aria-hidden="true">
                  {reducedDom ? full : typed}
                  {!reducedDom && typed.length > 0 && typed.length < full.length && (
                    <span className={styles.cursor} />
                  )}
                </span>
              </p>
            ))}
          </div>

          {/* facts: each row staggers in from bottom */}
          <dl className={styles.facts}>
            {FACTS.map(({ k, v }, i) => (
              <motion.div
                key={k}
                className={styles.fact}
                {...revealProps(isInView, reduced, 0.52 + i * 0.07)}
              >
                <dt className={styles.factKey}>{k}</dt>
                <dd className={styles.factVal}>{v}</dd>
              </motion.div>
            ))}
          </dl>

          <motion.div className={styles.direct} {...revealProps(isInView, reduced, 0.8)}>
            <p className={styles.directLabel}>Bezpośredni kontakt</p>
            <ul className={styles.directList}>
              <li><a href={`mailto:${EMAIL}`} className={styles.directLink}>{EMAIL}</a></li>
              {PHONE && <li><a href={phoneHref(PHONE)} className={styles.directLink}>{PHONE}</a></li>}
              <li>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.directLink}>
                  Umów 30 minut rozmowy ↗
                </a>
              </li>
              <li><a href="#process" className={styles.directLink}>Jak wygląda współpraca →</a></li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
