'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, fromBottomProps, fromRightProps, revealProps } from '@/lib/motion';
import styles from './WhatIDo.module.scss';

const PRINCIPLES = [
  {
    n: '1.',
    title: 'Najpierw cel.',
    body: 'Zanim napiszę linię kodu, rozumiem po co strona powstaje. Konwersja, rezerwacja, brand — każda decyzja projektowa ma uzasadnienie.',
  },
  {
    n: '2.',
    title: 'Jakość, nie prędkość.',
    body: 'Czysty kod, PageSpeed 95+, pełna dostępność. Nie buduję stron, które trzeba będzie przepisać za rok.',
  },
  {
    n: '3.',
    title: 'Długoterminowe relacje.',
    body: 'Deploy to nie koniec. Zostaję w kontakcie, reaguję na zmiany, dbam o to żeby strona pracowała miesiącami po oddaniu.',
  },
] as const;

/* card 0 → from left, card 1 → from bottom, card 2 → from right */
const cardProps = [fromLeftProps, fromBottomProps, fromRightProps] as const;

export function WhatIDo() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

  return (
    <section
      className={styles.section}
      ref={ref}
      aria-labelledby="principles-title"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          {...revealProps(isInView, reduced, 0)}
        >
          <p className={styles.label}>Jak pracuję</p>
          <h2 id="principles-title" className={styles.headline}>Trzy zasady.</h2>
        </motion.header>

        <div className={styles.grid}>
          {PRINCIPLES.map(({ n, title, body }, i) => (
            <motion.div
              key={n}
              className={styles.card}
              {...cardProps[i]!(isInView, reduced, i * 0.1)}
            >
              <span className={styles.num} aria-hidden="true">{n}</span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardBody}>{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
