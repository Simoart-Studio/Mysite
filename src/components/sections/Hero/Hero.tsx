import Image from 'next/image';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './Hero.module.scss';

type Shot = { src: string; width: number; height: number; name: string };

export function Hero({ shots = [] }: { shots?: Shot[] }) {
  return (
    <section className={`${styles.hero} bg-cream`} aria-labelledby="hero-h1">
      {shots.slice(0, 2).map((s, i) => (
        <span key={s.src} className={`${styles.float} ${i === 0 ? styles.floatL : styles.floatR}`} aria-hidden="true">
          <Image src={s.src} alt="" width={s.width} height={s.height} sizes="320px" priority={i === 0} className={styles.floatImg} />
        </span>
      ))}

      <div className={styles.inner}>
        <p className={`${styles.eyebrow} ${styles.enter}`}>
          <span className={styles.dot} aria-hidden="true" />
          SimoArt studio
        </p>

        <h1 id="hero-h1" className={`${styles.h1} ${styles.enter}`} style={{ animationDelay: '0.08s' }}>
          Tworzymy spójną wizję,<br />
          wizje tworzą <span className={`hl ${styles.hlIn}`}>dzieło.</span>
        </h1>

        <p className={`${styles.lead} ${styles.enter}`} style={{ animationDelay: '0.18s' }}>
          Strony, sklepy i aplikacje projektowane od pomysłu po wdrożenie.
        </p>

        <div className={`${styles.actions} ${styles.enter}`} style={{ animationDelay: '0.28s' }}>
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
