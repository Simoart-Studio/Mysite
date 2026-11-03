import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import styles from './Process.module.scss';

const STEPS = [
  {
    title: 'Ustalamy kierunek',
    mine:  'Zakres, termin i wycena.',
    yours: 'Cel, klienci, budżet.',
  },
  {
    title: 'Projektuję',
    mine:  'Układ i wygląd do komentarzy.',
    yours: 'Treści, zdjęcia, uwagi.',
  },
  {
    title: 'Wdrażam',
    mine:  'Kod, testy, SEO, publikacja.',
    yours: 'Akceptacja wersji testowej.',
  },
  {
    title: 'Dbam o rozwój',
    mine:  'Poprawki, aktualizacje, nowe funkcje.',
    yours: 'Decyzje o kolejnych krokach.',
  },
] as const;

export function Process() {
  return (
    <section id="process" className={`${styles.section} section-light`} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <p className={styles.label}>Proces współpracy</p>
          <h2 id="process-title" className={styles.headline}>Cztery kroki</h2>
          <p className={styles.intro}>Zakres akceptujesz przed startem prac.</p>
        </header>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={styles.step}
              data-reveal
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <div className={styles.stepHead}>
                <span className={styles.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.title}>{s.title}</h3>
              </div>
              <dl className={styles.split}>
                <div className={styles.side}>
                  <dt>Ja</dt>
                  <dd>{s.mine}</dd>
                </div>
                <div className={styles.side}>
                  <dt>Ty</dt>
                  <dd>{s.yours}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        <div className={styles.footer} data-reveal>
          <ContactTrigger className={styles.cta}>Porozmawiajmy →</ContactTrigger>
        </div>
      </div>
    </section>
  );
}
