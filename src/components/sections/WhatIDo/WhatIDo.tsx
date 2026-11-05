import { SplashCarousel } from '@/components/SplashCarousel/SplashCarousel';
import styles from './WhatIDo.module.scss';

const PRINCIPLES = [
  { title: 'Cel przed narzędziem.', body: 'Najpierw rozumiem, po co produkt powstaje. Technologię dobieram potem.' },
  { title: 'Jakość, nie pośpiech.', body: 'Szybkie, dostępne strony, których nie trzeba przepisywać za rok.' },
  { title: 'Partnerstwo.',          body: 'Po starcie zostaję w kontakcie i rozwijam projekt dalej.' },
];

export function WhatIDo() {
  return (
    <section id="zasady" className={`${styles.section} bg-white`} aria-labelledby="principles-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <h2 id="principles-title" className={styles.headline}>
            Trzy <span className="hl">zasady.</span>
          </h2>
        </header>
        <SplashCarousel slides={PRINCIPLES} label="Trzy zasady pracy" />
      </div>
    </section>
  );
}
