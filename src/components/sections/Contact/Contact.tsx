import { Mail, Phone, CalendarDays } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { EMAIL, PHONE, CALENDLY_URL, phoneHref } from '@/data/config';
import styles from './Contact.module.scss';

const NEXT = [
  'Czytam wiadomość i odpowiadam do 24 godzin.',
  'Jeśli trzeba, umawiamy krótką rozmowę.',
  'Dostajesz zakres i wycenę do akceptacji.',
];

export function Contact() {
  return (
    <section id="contact" className={`${styles.section} section-dark`} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.aside} data-reveal>
          <h2 id="contact-title" className={styles.headline}>
            Porozmawiajmy o <span className="hl">projekcie.</span>
          </h2>
          <p className={styles.lead}>
            Nie potrzebujesz gotowego briefu. Wystarczy kilka zdań.
          </p>

          <div className={styles.block}>
            <p className={styles.blockTitle}>Co wydarzy się dalej?</p>
            <ol className={styles.steps}>
              {NEXT.map((t) => <li key={t}>{t}</li>)}
            </ol>
          </div>

          <div className={styles.block}>
            <p className={styles.blockTitle}>Wolisz bezpośrednio?</p>
            <ul className={styles.direct}>
              <li><Mail size={16} aria-hidden="true" /><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              {PHONE && <li><Phone size={16} aria-hidden="true" /><a href={phoneHref(PHONE)}>{PHONE}</a></li>}
              <li>
                <CalendarDays size={16} aria-hidden="true" />
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Umów 30 minut rozmowy ↗</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.formCard} data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
