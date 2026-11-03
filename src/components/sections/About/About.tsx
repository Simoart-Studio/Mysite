import Image from 'next/image';
import { BRAND, OWNER, EMAIL, PHONE, CALENDLY_URL, phoneHref } from '@/data/config';
import styles from './About.module.scss';

/** Portret: ustaw np. { src: '/portrait.webp', width: 800, height: 1000 }. Null = karta z monogramem. */
const PORTRAIT: { src: string; width: number; height: number } | null = null;

const FACTS = [
  { k: 'Robię',     v: 'Strony, sklepy, aplikacje webowe' },
  { k: 'Dla',       v: 'Małych firm, startupów, marek osobistych' },
  { k: 'Pracuję',   v: 'Zdalnie, bezpośrednio z Tobą' },
] as const;

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div className={styles.portrait} data-reveal>
          {PORTRAIT ? (
            <Image
              src={PORTRAIT.src}
              alt={`${OWNER}, ${BRAND}`}
              width={PORTRAIT.width}
              height={PORTRAIT.height}
              sizes="(max-width: 767px) 160px, 260px"
              className={styles.portraitImg}
            />
          ) : (
            <div className={styles.monogram} role="img" aria-label={`${OWNER} — ${BRAND}`}>
              <span className={styles.monoLetters} aria-hidden="true">SP</span>
              <span className={styles.monoName}>{OWNER}</span>
            </div>
          )}
        </div>

        <div className={styles.text} data-reveal>
          <p className={styles.label}>O mnie</p>
          <h2 id="about-title" className={styles.headline}>
            Buduję to, czego używają prawdziwi ludzie.
          </h2>
          <p className={styles.body}>
            Od kilku lat tworzę strony i aplikacje. Zaczynałem od własnych projektów, dziś pomagam firmom
            zdobywać klientów przez internet.
          </p>

          <dl className={styles.facts}>
            {FACTS.map(({ k, v }) => (
              <div key={k} className={styles.fact}>
                <dt className={styles.factKey}>{k}</dt>
                <dd className={styles.factVal}>{v}</dd>
              </div>
            ))}
          </dl>

          <ul className={styles.direct} aria-label="Kontakt bezpośredni">
            <li><a href={`mailto:${EMAIL}`} className={styles.directLink}>{EMAIL}</a></li>
            {PHONE && <li><a href={phoneHref(PHONE)} className={styles.directLink}>{PHONE}</a></li>}
            <li>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.directLink}>
                Calendly ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
