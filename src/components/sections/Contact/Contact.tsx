import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { EMAIL, PHONE, CALENDLY_URL, GITHUB_URL, LINKEDIN_URL, phoneHref } from '@/data/config';
import styles from './Contact.module.scss';

export function Contact() {
  return (
    <section id="contact" className={`${styles.section} section-dark`} aria-labelledby="contact-title">
      <div className={styles.inner} data-reveal>
        <p className={styles.label}>Kontakt</p>
        <h2 id="contact-title" className={styles.headline}>Porozmawiajmy.</h2>
        <p className={styles.sub}>Odpowiadam do 24 godzin.</p>

        <div className={styles.actions}>
          <ContactTrigger className={styles.primary}>Napisz do mnie</ContactTrigger>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            Umów rozmowę ↗
          </a>
        </div>

        <ol className={styles.steps} aria-label="Co dalej">
          <li>Odpowiedź do 24 h</li>
          <li>Krótka rozmowa</li>
          <li>Zakres i wycena do akceptacji</li>
        </ol>

        <p className={styles.direct}>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          {PHONE && <a href={phoneHref(PHONE)}>{PHONE}</a>}
        </p>

        <p className={styles.social}>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </div>
    </section>
  );
}
