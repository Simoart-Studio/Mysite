'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTypewriter } from '@/hooks/useTypewriter';
import { fromLeftProps, revealProps, EASE_WAVE } from '@/lib/motion';
import styles from './About.module.scss';

const FACTS = [
  { k: 'Stack',       v: 'React · TypeScript · Next.js · Framer Motion · SCSS' },
  { k: 'Fokus',       v: 'Premium landing pages · Brand websites'               },
  { k: 'Tryb pracy',  v: 'Remote · Bezpośredni kontakt'                         },
  { k: 'Dostępność',  v: 'Q2 2026'                                              },
] as const;

const P1 = 'Piszę frontend od kilku lat. Zaczynałem od budowania aplikacji dla siebie, dziś buduję je dla firm, które nie chcą kompromisów między estetyką a wydajnością.';
const P2 = 'Najbardziej interesują mnie strony, które muszą pracować — rezerwacje, konwersje, brand. Nie interfejsy do oglądania.';

export function About() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

  const tw1 = useTypewriter(P1, !reduced && isInView, 22);
  const tw2 = useTypewriter(P2, !reduced && tw1.length === P1.length && isInView, 22);

  return (
    <section
      id="about"
      className={`${styles.section} section-offwhite`}
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
