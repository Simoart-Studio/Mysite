import Image from 'next/image';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './Hero.module.scss';

type Shot = { src: string; width: number; height: number; name: string };

function Pill({ shot, delay, tilt }: { shot?: Shot; delay: string; tilt: string }) {
  if (!shot) return null;
  return (
    <span className={styles.pill} style={{ animationDelay: delay, ['--tilt' as string]: tilt }} aria-hidden="true">
      <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="200px" priority className={styles.pillImg} />
    </span>
  );
}

export function Hero({ shots = [] }: { shots?: Shot[] }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-h1">
      <div className={styles.inner}>
        <h1 id="hero-h1" className={styles.h1}>
          <span className={styles.line}>
            Strony <Pill shot={shots[0]} delay="0.35s" tilt="-4deg" />
          </span>
          <span className={styles.line}>i aplikacje,</span>
          <span className={styles.line}>
            które <Pill shot={shots[1]} delay="0.5s" tilt="3deg" /> <span className={`hl ${styles.hlIn}`}>zarabiają.</span>
          </span>
        </h1>

        <div className={styles.row}>
          <p className={styles.lead}>
            Projektuję i koduję strony, sklepy i aplikacje dla firm. Od pierwszej rozmowy po wdrożenie, bez pośredników.
          </p>
          <div className={styles.actions}>
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
      </div>
    </section>
  );
}
