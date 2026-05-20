'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTypewriter } from '@/hooks/useTypewriter';
import { fromLeftProps, revealProps, EASE_WAVE } from '@/lib/motion';
import { AVAILABILITY } from '@/data/config';
import styles from './About.module.scss';

const FACTS = [
  { k: 'Specjalizacja', v: 'Strony sprzedażowe · Sklepy internetowe · Aplikacje webowe' },
  { k: 'Dla kogo',      v: 'Małe firmy · Startupy · Personal brand'                     },
  { k: 'Tryb pracy',    v: 'Zdalnie · Bezpośredni kontakt'                               },
  { k: 'Dostępność',    v: AVAILABILITY                                                   },
] as const;

const P1 = 'Tworzę strony i aplikacje od kilku lat. Zaczynałem od własnych projektów — dziś pomagam firmom zdobywać klientów przez internet, bo wiem że dobra strona to narzędzie sprzedaży, nie tylko wizytówka.';
const P2 = 'Interesują mnie strony, które muszą pracować — zbierać rezerwacje, generować zapytania, budować markę. Nie takie, które się tylko ogląda.';

export function About() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

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
            <p>
              {reduced ? P1 : tw1}
              {!reduced && tw1.length > 0 && tw1.length < P1.length && (
                <span className={styles.cursor} aria-hidden="true" />
              )}
            </p>
            <p>
              {reduced ? P2 : tw2}
              {!reduced && tw2.length > 0 && tw2.length < P2.length && (
                <span className={styles.cursor} aria-hidden="true" />
              )}
            </p>
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

        </div>
      </div>
    </section>
  );
}
