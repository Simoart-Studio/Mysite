import { HeroDeck } from '@/components/HeroDeck/HeroDeck';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import type { Project } from '@/types/project';
import styles from './Hero.module.scss';

export function Hero({
  deck = [],
  total = 0,
}: {
  deck?: Pick<Project, 'slug' | 'name' | 'thumbnail'>[];
  total?: number;
}) {
  return (
    <section className={styles.hero} aria-labelledby="hero-h1">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.enter}`}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Good Site · Better Life
          </p>

          <h1 id="hero-h1" className={`${styles.h1} ${styles.enter}`} style={{ animationDelay: '0.05s' }}>
            Strony i aplikacje,<br /> które <span className={`hl ${styles.hlIn}`}>zarabiają.</span>
          </h1>

          <p className={`${styles.lead} ${styles.enter}`} style={{ animationDelay: '0.15s' }}>
            Projektuję i koduję strony, sklepy i aplikacje dla firm. Bezpośrednio, od pomysłu po wdrożenie.
          </p>

          <div className={`${styles.actions} ${styles.enter}`} style={{ animationDelay: '0.25s' }}>
            <ContactTrigger className="btn">
              Porozmawiajmy
              <BtnIcon />
            </ContactTrigger>
            <a href="#works" className="btn btn--ghost">
              Zobacz projekty
              <BtnIcon dir="down" />
            </a>
          </div>

        </div>

        {deck.length >= 3 && (
          <div className={`${styles.enter}`} style={{ animationDelay: '0.2s' }}>
          <div className={`${styles.visual} ${styles.float}`}>
            <div className={styles.visualHead}>
              <span>Wybrane projekty</span>
              <span className={styles.count}>{String(total).padStart(2, '0')}</span>
            </div>
            <HeroDeck cards={deck} />
          </div>
          </div>
        )}
      </div>
    </section>
  );
}
