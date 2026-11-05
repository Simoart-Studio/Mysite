'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, Check, Code2, HeartHandshake, MessagesSquare, PenTool, Rocket, UserRound, type LucideIcon } from 'lucide-react';
import { ContactTrigger } from '@/components/ContactTrigger/ContactTrigger';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './Process.module.scss';

type Step = {
  title: string;
  icon: LucideIcon;
  effect: string;
  chips: string[];
  mine: string;
  yours: string;
};

const STEPS: Step[] = [
  {
    title: 'Ustalamy kierunek',
    icon: MessagesSquare,
    effect: 'Jasny zakres i wycena.',
    chips: ['Cel', 'Zakres', 'Budżet', 'Termin'],
    mine: 'Pytania o cel i klientów, propozycja zakresu i wycena.',
    yours: 'Opis firmy, problemu i budżetu.',
  },
  {
    title: 'Projektuję',
    icon: PenTool,
    effect: 'Widzisz stronę, zanim powstanie kod.',
    chips: ['Układ', 'Wygląd', 'Treści'],
    mine: 'Układ i wygląd kluczowych widoków do komentarzy.',
    yours: 'Treści, zdjęcia i uwagi.',
  },
  {
    title: 'Wdrażam',
    icon: Rocket,
    effect: 'Szybka strona, gotowa do pracy.',
    chips: ['Kod', 'Testy', 'SEO', 'Publikacja'],
    mine: 'Kod, testy na telefonach i komputerach, SEO, publikacja.',
    yours: 'Sprawdzenie wersji testowej i akceptacja.',
  },
  {
    title: 'Dbam o rozwój',
    icon: HeartHandshake,
    effect: 'Strona rośnie razem z firmą.',
    chips: ['Poprawki', 'Aktualizacje', 'Nowe funkcje'],
    mine: 'Poprawki, aktualizacje i nowe funkcje według ustaleń.',
    yours: 'Decyzje o kolejnych krokach.',
  },
];

function Panel({ step, id, labelledBy, hidden }: { step: Step; id: string; labelledBy: string; hidden: boolean }) {
  return (
    <div className={styles.panel} role="region" id={id} aria-labelledby={labelledBy} hidden={hidden}>
      <p className={styles.panelLabel}>Efekt etapu</p>
      <p className={styles.effect}>{step.effect}</p>
      <ul className={styles.chips}>
        {step.chips.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <dl className={styles.split}>
        <div>
          <dt><Code2 size={15} aria-hidden="true" /> Po mojej stronie</dt>
          <dd>{step.mine}</dd>
        </div>
        <div>
          <dt><UserRound size={15} aria-hidden="true" /> Po Twojej stronie</dt>
          <dd>{step.yours}</dd>
        </div>
      </dl>
      <p className={styles.accept}>
        <span aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
        Zakres akceptujesz przed startem prac.
      </p>
    </div>
  );
}

export function Process() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const map: Record<string, number> = {
      ArrowDown: (i + 1) % STEPS.length,
      ArrowRight: (i + 1) % STEPS.length,
      ArrowUp: (i - 1 + STEPS.length) % STEPS.length,
      ArrowLeft: (i - 1 + STEPS.length) % STEPS.length,
      Home: 0,
      End: STEPS.length - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="process" className={`${styles.section} bg-cream`} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <h2 id="process-title" className={styles.headline}>
            Dobry projekt.<br />Jasna <span className="hl">współpraca.</span>
          </h2>
        </header>

        <div className={styles.grid} data-reveal>
          <div className={styles.list}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const on = i === active;
              return (
                <div key={s.title} className={styles.item}>
                  <button
                    ref={(el) => { tabs.current[i] = el; }}
                    type="button"
                    id={`${uid}-tab-${i}`}
                    aria-expanded={on}
                    aria-controls={`${uid}-ipanel-${i} ${uid}-panel-${i}`}
                    className={`${styles.step} ${on ? styles.stepOn : ''}`}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    <Icon size={19} strokeWidth={1.8} aria-hidden="true" className={styles.stepIcon} />
                    <span className={styles.stepTitle}>{s.title}</span>
                    <span className={styles.stepArrow} aria-hidden="true">
                      {on ? <ArrowDown size={16} strokeWidth={2.2} /> : <ArrowRight size={16} strokeWidth={2} />}
                    </span>
                  </button>
                  <div className={styles.inlinePanel} data-on={on}>
                    <Panel step={s} id={`${uid}-ipanel-${i}`} labelledBy={`${uid}-tab-${i}`} hidden={false} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.aside}>
            {STEPS.map((s, i) => (
              <Panel key={s.title} step={s} id={`${uid}-panel-${i}`} labelledBy={`${uid}-tab-${i}`} hidden={i !== active} />
            ))}
          </div>
        </div>

        <div className={styles.footer} data-reveal>
          <ContactTrigger className="btn">
            Zacznijmy od rozmowy
            <BtnIcon />
          </ContactTrigger>
        </div>
      </div>
    </section>
  );
}
