import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import { Dust } from '@/components/Dust/Dust';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className={`${styles.hero} bg-cream`} aria-labelledby="hero-h1">
      <div className={styles.inner}>
        <h1 id="hero-h1" className={`${styles.h1} ${styles.enter}`} style={{ animationDelay: '0.08s' }}>
          Tworzymy spójną wizję,<br />
          wizje tworzą <Dust>dzieło.</Dust>
        </h1>

        <p className={`${styles.lead} ${styles.enter}`} style={{ animationDelay: '0.18s' }}>
          Strony, sklepy i aplikacje projektowane od pomysłu po wdrożenie.
        </p>

        <div data-hero-actions className={`${styles.actions} ${styles.enter}`} style={{ animationDelay: '0.28s' }}>
          <ContactTrigger className="btn">
            Porozmawiajmy
            <BtnIcon />
          </ContactTrigger>
          <a href="#works" className="btn btn--ghost">
            Projekty
            <BtnIcon dir="down" />
          </a>
        </div>
      </div>
    </section>
  );
}
