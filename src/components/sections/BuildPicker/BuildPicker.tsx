import Link from 'next/link';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { projects } from '@/lib/projects';
import styles from './BuildPicker.module.scss';

type Option = {
  id:       string;
  title:    string;
  problem:  string;
  offer:    string;
  gets:     string[];
  related:  string[];
  goal:     string;
};

/* Pytamy o problem klienta, nie o technologię */
const OPTIONS: Option[] = [
  {
    id: 'strona',
    title: 'Strona firmowa',
    problem: 'Klienci mnie nie znajdują albo nie wiedzą, czym się zajmuję.',
    offer: 'Strona, która w kilka sekund mówi, co robisz, i prowadzi do kontaktu.',
    gets: ['Projekt pod Twoją markę', 'Szybkość i SEO', 'Formularz lub rezerwacje'],
    related: ['barberspace'],
    goal: 'Strona firmowa',
  },
  {
    id: 'sklep',
    title: 'Sklep internetowy',
    problem: 'Chcę sprzedawać online, a nie tylko przez telefon i wiadomości.',
    offer: 'Sklep z prostą ścieżką zakupu, wygodny na telefonie.',
    gets: ['Katalog i wyszukiwarka', 'Koszyk i zamówienie', 'Wersja mobilna od startu'],
    related: ['fancyshop'],
    goal: 'Sklep internetowy',
  },
  {
    id: 'webapp',
    title: 'Aplikacja webowa',
    problem: 'Mój zespół albo moi klienci tracą czas na ręczną robotę.',
    offer: 'Powtarzalny proces zamieniony w prostą aplikację w przeglądarce.',
    gets: ['Analiza procesu', 'Czytelny interfejs', 'Rozwój etapami'],
    related: ['lingua'],
    goal: 'Aplikacja webowa',
  },
  {
    id: 'mobile',
    title: 'Aplikacja na telefon',
    problem: 'Klienci mają mieć moją usługę pod ręką, w telefonie.',
    offer: 'Aplikacja PWA: instalowana z przeglądarki, działa offline.',
    gets: ['Android, iPhone, komputer', 'Tryb offline', 'Powiadomienia'],
    related: ['taskiner', 'lingua'],
    goal: 'Aplikacja mobilna (PWA)',
  },
  {
    id: 'mvp',
    title: 'MVP lub prototyp',
    problem: 'Mam pomysł i chcę go sprawdzić, zanim wydam więcej.',
    offer: 'Najmniejsza wersja, którą sprawdzisz na prawdziwych ludziach.',
    gets: ['Lista funkcji na start', 'Działający prototyp', 'Plan rozwoju'],
    related: [],
    goal: 'MVP / prototyp',
  },
];

export function BuildPicker() {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <section id="uslugi" className={styles.section} aria-labelledby="build-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <p className={styles.label}>Usługi</p>
          <h2 id="build-title" className={styles.headline}>Co chcesz zbudować?</h2>
        </header>

        <div className={styles.picker} data-reveal>
          <fieldset className={styles.options}>
            <legend className="sr-only">Jaki problem chcesz rozwiązać?</legend>
            {OPTIONS.map((o, i) => (
              <div key={o.id} className={styles.option}>
                <input
                  type="radio"
                  name="build"
                  id={`build-${o.id}`}
                  value={o.id}
                  defaultChecked={i === 0}
                  className={styles.radio}
                />
                <label htmlFor={`build-${o.id}`} className={styles.tile}>
                  <span className={styles.tileProblem}>„{o.problem}”</span>
                  <span className={styles.tileTitle}>{o.title}</span>
                </label>
                {/* Telefon/tablet: odpowiedź tuż pod wybranym kafelkiem */}
                <div className={`${styles.panel} ${styles.panelInline}`}>
                  <Panel o={o} related={o.related.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => !!p)} />
                </div>
              </div>
            ))}
          </fieldset>

          <div className={styles.panels} aria-live="polite">
            {OPTIONS.map((o) => (
              <div key={o.id} id={`build-panel-${o.id}`} className={styles.panel} data-for={o.id}>
                <Panel o={o} related={o.related.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => !!p)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ o, related }: { o: Option; related: { slug: string; name: string }[] }) {
  return (
    <>
      <p className={styles.panelEyebrow}>{o.title}</p>
      <p className={styles.panelOffer}>{o.offer}</p>
      <ul className={styles.gets}>
        {o.gets.map((g) => <li key={g}>{g}</li>)}
      </ul>
      {related.length > 0 && (
        <p className={styles.related}>
          Podobny projekt:{' '}
          {related.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && ', '}
              <Link href={`/works/${p.slug}`} className={styles.relatedLink}>{p.name}</Link>
            </span>
          ))}
        </p>
      )}
      <ContactTrigger className={styles.cta} preset={{ goal: o.goal }}>
        Porozmawiajmy →
      </ContactTrigger>
    </>
  );
}
