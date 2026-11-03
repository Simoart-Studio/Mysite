'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, fromBottomProps, fromRightProps, revealProps } from '@/lib/motion';
import { Carousel } from '@/components/Carousel/Carousel';
import styles from './WhatIDo.module.scss';

const PRINCIPLES = [
  {
    n: '1.',
    title: 'Cel ponad narzędzie.',
    body: 'Zanim napiszę linię kodu, rozumiem po co produkt powstaje. Konwersja, retencja, brand — każda decyzja ma uzasadnienie biznesowe.',
  },
  {
    n: '2.',
    title: 'Jakość, nie prędkość.',
    body: 'Czysty kod, PageSpeed 95+, TypeScript strict, pełna dostępność. Nie buduję rzeczy, które trzeba przepisywać za rok.',
  },
  {
    n: '3.',
    title: 'Partnerstwo, nie zlecenie.',
    body: 'Deploy to nie koniec. Zostaję w kontakcie, iteruję, dbam o to żeby produkt pracował miesiącami po premierze.',
  },
] as const;

/* card 0 → from left, card 1 → from bottom, card 2 → from right */
const cardProps = [fromLeftProps, fromBottomProps, fromRightProps] as const;

export function WhatIDo() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

  return (
    <section
      id="zasady"
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

        {/* Mobile carousel */}
        <div className={styles.carouselWrap}>
          <Carousel label="Jak pracuję">
            {PRINCIPLES.map(({ n, title, body }) => (
              <div key={n} className={styles.slideCard}>
                <span className={styles.num} aria-hidden="true">{n}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop grid */}
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
