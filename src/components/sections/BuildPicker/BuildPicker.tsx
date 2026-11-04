import Image from 'next/image';
import Link from 'next/link';
import { Check, Globe, ShoppingBag, LayoutDashboard, Smartphone, FlaskConical, type LucideIcon } from 'lucide-react';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import { projects } from '@/lib/projects';
import type { Project } from '@/types/project';
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

const ICONS: Record<string, LucideIcon> = {
  strona: Globe, sklep: ShoppingBag, webapp: LayoutDashboard, mobile: Smartphone, mvp: FlaskConical,
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
          <h2 id="build-title" className={styles.headline}>
            Co chcesz <span className="hl">zbudować?</span>
          </h2>
        </header>

        <div className={styles.card} data-reveal>
          <fieldset className={styles.tabs}>
            <legend className="sr-only">Rodzaj projektu</legend>
            {OPTIONS.map((o, i) => {
              const Icon = ICONS[o.id]!;
              return (
                <span key={o.id} className={styles.tabWrap}>
                  <input
                    type="radio"
                    name="build"
                    id={`build-${o.id}`}
                    value={o.id}
                    defaultChecked={i === 0}
                    className={styles.radio}
                  />
                  <label htmlFor={`build-${o.id}`} className={styles.tab}>
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    {o.title}
                  </label>
                </span>
              );
            })}
          </fieldset>

          <div className={styles.panels}>
            {OPTIONS.map((o) => {
              const related = o.related.map((slug) => bySlug.get(slug)).filter((p): p is Project => !!p);
              return (
                <div key={o.id} id={`build-panel-${o.id}`} className={styles.panel} data-for={o.id}>
                  <div className={styles.panelText}>
                    <p className={styles.problem}>„{o.problem}”</p>
                    <p className={styles.offer}>{o.offer}</p>
                    <ul className={styles.gets}>
                      {o.gets.map((g) => (
                        <li key={g}>
                          <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                          {g}
                        </li>
                      ))}
                    </ul>
                    <ContactTrigger className="btn" preset={{ goal: o.goal }}>
                      Porozmawiajmy
                      <BtnIcon />
                    </ContactTrigger>
                  </div>

                  <div className={styles.panelVisual}>
                    {related[0]?.thumbnail ? (
                      <Link href={`/works/${related[0].slug}`} className={styles.related}>
                        <Image
                          src={related[0].thumbnail.src}
                          alt=""
                          width={related[0].thumbnail.width}
                          height={related[0].thumbnail.height}
                          sizes="(max-width: 1023px) 90vw, 460px"
                          className={styles.relatedImg}
                        />
                        <span className={styles.relatedLabel}>
                          Podobny projekt: <strong>{related[0].name}</strong>
                          <span aria-hidden="true"> ↗</span>
                        </span>
                      </Link>
                    ) : (
                      <div className={styles.placeholder} aria-hidden="true">
                        {(() => { const Icon = ICONS[o.id]!; return <Icon size={56} strokeWidth={1.2} />; })()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
