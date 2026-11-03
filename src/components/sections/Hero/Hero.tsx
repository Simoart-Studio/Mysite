import { Check } from 'lucide-react';
import { HeroDeck } from '@/components/HeroDeck/HeroDeck';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import type { Project } from '@/types/project';
import styles from './Hero.module.scss';

const TRUST = ['Odpowiedź do 24 godzin', 'Zakres akceptujesz przed startem', 'Opieka po wdrożeniu'];

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
            Strony i aplikacje, które <span className={`hl ${styles.hlIn}`}>zarabiają.</span>
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

          <ul className={`${styles.trust} ${styles.enter}`} style={{ animationDelay: '0.35s' }}>
            {TRUST.map((t) => (
              <li key={t}>
                <span className={styles.trustIcon} aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {deck.length >= 3 && (
          <div className={`${styles.visual} ${styles.enter}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.visualHead}>
              <span>Wybrane projekty</span>
              <span className={styles.count}>{String(total).padStart(2, '0')}</span>
            </div>
            <HeroDeck cards={deck} />
            <ul className={styles.visualTags} aria-hidden="true">
              <li>Strony</li><li>Sklepy</li><li>Aplikacje</li><li>PWA</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
