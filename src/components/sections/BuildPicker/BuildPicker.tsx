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
    offer: 'Projektuję stronę, która w kilka sekund mówi, co robisz i dla kogo. Każda sekcja prowadzi do jednego działania: telefonu, formularza albo rezerwacji.',
    gets: ['Projekt dopasowany do Twojej marki', 'Szybkie ładowanie i SEO techniczne', 'Formularz kontaktu lub rezerwacji'],
    related: ['barberspace'],
    goal: 'Strona firmowa',
  },
  {
    id: 'sklep',
    title: 'Sklep internetowy',
    problem: 'Chcę sprzedawać online, a nie tylko przez telefon i wiadomości.',
    offer: 'Buduję sklep z prostą ścieżką zakupu: katalog, karta produktu, koszyk i zamówienie. Wygodny na telefonie, bo tam robi się większość zakupów.',
    gets: ['Katalog z filtrami i wyszukiwarką', 'Koszyk i proces zamówienia', 'Wersja mobilna od pierwszego dnia'],
    related: ['fancyshop'],
    goal: 'Sklep internetowy',
  },
  {
    id: 'webapp',
    title: 'Aplikacja webowa',
    problem: 'Mój zespół albo moi klienci tracą czas na ręczną robotę.',
    offer: 'Zamieniam powtarzalny proces w aplikację w przeglądarce. Zaczynamy od jednego najważniejszego zadania, które ma działać bez zarzutu.',
    gets: ['Analiza procesu przed kodowaniem', 'Czytelny interfejs dla użytkowników', 'Rozwój etapami, bez przepisywania'],
    related: ['lingua'],
    goal: 'Aplikacja webowa',
  },
  {
    id: 'mobile',
    title: 'Aplikacja na telefon',
    problem: 'Klienci mają mieć moją usługę pod ręką, w telefonie.',
    offer: 'Buduję aplikacje PWA: instaluje się je prosto z przeglądarki, działają offline i wysyłają powiadomienia. Jeden kod działa na Androidzie, iPhonie i komputerze.',
    gets: ['Instalacja z przeglądarki, bez sklepu z aplikacjami', 'Tryb offline', 'Powiadomienia'],
    related: ['taskiner', 'lingua'],
    goal: 'Aplikacja mobilna (PWA)',
  },
  {
    id: 'mvp',
    title: 'MVP lub prototyp',
    problem: 'Mam pomysł i chcę go sprawdzić, zanim wydam więcej.',
    offer: 'Wybieramy najmniejszy zakres, który da się pokazać prawdziwym użytkownikom. Działający prototyp mówi więcej niż prezentacja.',
    gets: ['Lista funkcji na start i na później', 'Klikalny prototyp lub działająca wersja', 'Plan dalszego rozwoju'],
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
          <p className={styles.intro}>
            Wybierz problem, który najbardziej przypomina Twój. Pokażę, co proponuję i jak zacząć.
          </p>
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
                  aria-controls={`build-panel-${o.id}`}
                />
                <label htmlFor={`build-${o.id}`} className={styles.tile}>
                  <span className={styles.tileProblem}>„{o.problem}”</span>
                  <span className={styles.tileTitle}>{o.title}</span>
                </label>
              </div>
            ))}
          </fieldset>

          <div className={styles.panels} aria-live="polite">
            {OPTIONS.map((o) => {
              const related = o.related.map((s) => bySlug.get(s)).filter(Boolean);
              return (
                <div
                  key={o.id}
                  id={`build-panel-${o.id}`}
                  className={styles.panel}
                  data-for={o.id}
                >
                  <p className={styles.panelEyebrow}>{o.title}</p>
                  <p className={styles.panelOffer}>{o.offer}</p>
                  <ul className={styles.gets}>
                    {o.gets.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                  {related.length > 0 && (
                    <p className={styles.related}>
                      Zobacz podobny projekt:{' '}
                      {related.map((p, i) => (
                        <span key={p!.slug}>
                          {i > 0 && ', '}
                          <Link href={`/works/${p!.slug}`} className={styles.relatedLink}>{p!.name}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                  <ContactTrigger className={styles.cta} preset={{ goal: o.goal }}>
                    Opisz swój problem →
                  </ContactTrigger>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
