import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import styles from './Process.module.scss';

const STEPS = [
  {
    title: 'Ustalamy kierunek',
    mine:  'Pytam o cel, klientów i budżet. Proponuję zakres, termin i wycenę.',
    yours: 'Opowiadasz o firmie i problemie. Akceptujesz zakres albo go zmieniamy.',
  },
  {
    title: 'Projektuję',
    mine:  'Układ strony i wygląd kluczowych widoków. Pokazuję wersję do komentarzy.',
    yours: 'Przekazujesz treści i zdjęcia. Zgłaszasz uwagi do projektu.',
  },
  {
    title: 'Wdrażam',
    mine:  'Kod, testy na telefonach i komputerach, SEO techniczne, publikacja.',
    yours: 'Sprawdzasz wersję testową i dajesz zielone światło.',
  },
  {
    title: 'Dbam o rozwój',
    mine:  'Poprawki po starcie, aktualizacje i kolejne funkcje według ustaleń.',
    yours: 'Mówisz, co działa, a co nie. Decydujesz o kolejnych krokach.',
  },
] as const;

export function Process() {
  return (
    <section id="process" className={`${styles.section} section-light`} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <p className={styles.label}>Proces współpracy</p>
          <h2 id="process-title" className={styles.headline}>Cztery kroki. Jasny podział.</h2>
          <p className={styles.intro}>
            Zakres akceptujesz przed startem prac. Na każdym etapie wiesz, co robię ja, a czego potrzebuję od Ciebie.
          </p>
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
                  <dt>Po mojej stronie</dt>
                  <dd>{s.mine}</dd>
                </div>
                <div className={styles.side}>
                  <dt>Po Twojej stronie</dt>
                  <dd>{s.yours}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        <div className={styles.footer} data-reveal>
          <p>Nie wiesz, od czego zacząć? Zacznij od rozmowy. Pierwsza jest bez zobowiązań.</p>
          <ContactTrigger className={styles.cta}>Napisz do mnie →</ContactTrigger>
        </div>
      </div>
    </section>
  );
}
