import Image from 'next/image';
import { Code2, PenTool, Rocket, Sparkle } from 'lucide-react';
import { BRAND, OWNER } from '@/data/config';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './About.module.scss';

const PORTRAIT: { src: string; width: number; height: number } | null = null;

const SKILLS = [
  { label: 'Projekt',   icon: PenTool },
  { label: 'Kod',       icon: Code2 },
  { label: 'Wdrożenie', icon: Rocket },
];

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <h2 id="about-title" className={styles.headline} data-reveal>
          Za projektem stoi <span className="hl">konkretna osoba.</span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.portrait} data-reveal>
            <span className={styles.circle} aria-hidden="true" />
            {PORTRAIT ? (
              <Image
                src={PORTRAIT.src}
                alt={`${OWNER}, ${BRAND}`}
                width={PORTRAIT.width}
                height={PORTRAIT.height}
                sizes="(max-width: 1023px) 90vw, 480px"
                className={styles.portraitImg}
              />
            ) : (
              <span className={styles.monogram} role="img" aria-label={`${OWNER}, ${BRAND}`}>SP</span>
            )}
            <span className={styles.badge}>
              <Sparkle size={14} aria-hidden="true" />
              {OWNER} · {BRAND}
            </span>
          </div>

          <div className={styles.text} data-reveal>
            <p className={styles.hello}>Cześć, jestem Szymon.</p>
            <p className={styles.body}>
              Prowadzę {BRAND}. Sam projektuję i koduję strony, sklepy i aplikacje dla firm.
              Rozmawiasz z osobą, która zna Twój projekt od pierwszego szkicu po wdrożenie.
            </p>

            <ul className={styles.skills} aria-label="Zakres pracy">
              {SKILLS.map(({ label, icon: Icon }) => (
                <li key={label}><Icon size={14} aria-hidden="true" />{label}</li>
              ))}
            </ul>

            <ContactTrigger className="btn">
              Porozmawiajmy o Twoim projekcie
              <BtnIcon />
            </ContactTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
