'use client';

import { useCallback, useRef, useState } from 'react';
import { Dust } from '@/components/Dust/Dust';
import { useScrollProgress } from './useScrollProgress';
import styles from './Workshop.module.scss';

const STEPS = ['Siatka', 'Układ', 'Typografia', 'Kolor', 'Interakcja', 'Responsywność'] as const;
const SERVICES = ['Montaż', 'Serwis', 'Doradztwo'] as const;

/**
 * Warsztat: przewijanie buduje stronę na oczach odwiedzającego —
 * siatka → układ → typografia → kolor → interakcja → ekran telefonu.
 * Mini-strona w ramce przestawia się prawdziwymi zapytaniami kontenerowymi (@container).
 */
export function Workshop() {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  const onFrame = useCallback((p: number, r: DOMRect) => {
    const s = r.top > window.innerHeight * 0.45 ? -1 : Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setStep((prev) => (prev === s ? prev : s));
  }, []);
  useScrollProgress(ref, 'pin', onFrame);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + ((i + 0.5) / STEPS.length) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const on = (i: number) => (step >= i ? styles[`s${i}`] : '');

  return (
    <section ref={ref} className={styles.section} aria-labelledby="workshop-title">
      <div className={styles.sticky}>
        <div className={styles.side}>
          <h2 id="workshop-title" className={styles.title}>Tak powstaje <Dust>strona.</Dust></h2>
          <ol className={styles.steps}>
            {STEPS.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  className={styles.step}
                  aria-current={step === i ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className={styles.name}>{name}</span>
                </button>
              </li>
            ))}
          </ol>
          <span className={styles.meter} aria-hidden="true"><i /></span>
        </div>

        <div className={styles.stage} aria-hidden="true">
          <div
            ref={frame}
            className={[styles.frame, step >= 0 && styles.on, on(1), on(2), on(3), on(4), on(5)].filter(Boolean).join(' ')}
          >
            <div className={styles.bar}>
              <i /><i /><i />
              <span className={styles.url} data-url="twojafirma.pl" />
            </div>

            <div className={styles.viewport}>
              <div className={styles.grid}>
                {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}
              </div>

              <div className={styles.page}>
                <header className={styles.pNav}>
                  <span className={`${styles.w} ${styles.brand}`}><b className={styles.t}>Nowak</b></span>
                  <span className={styles.pLinks}>
                    <span className={styles.t}>Oferta</span>
                    <span className={styles.t}>Realizacje</span>
                    <span className={styles.t}>Kontakt</span>
                  </span>
                  <span className={styles.burger}><i /><i /><i /></span>
                </header>

                <div className={styles.pHero}>
                  <div className={styles.pCopy}>
                    <span className={`${styles.t} ${styles.pTitle}`}>Ciepło w domu bez&nbsp;zmartwień.</span>
                    <span className={`${styles.t} ${styles.pLead}`}>Montaż i serwis pomp ciepła. Termin w 48 godzin.</span>
                    <span className={styles.btnWrap}>
                      <span className={`${styles.w} ${styles.btn}`}><span className={styles.t}>Umów wizytę</span></span>
                      <span className={styles.cursor}>
                        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l15 11-6.5 1.2L9.8 21z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                      </span>
                    </span>
                  </div>
                  <span className={`${styles.w} ${styles.pImg}`}><i /></span>
                </div>

                <div className={styles.pCards}>
                  {SERVICES.map((s, i) => (
                    <span key={s} className={`${styles.w} ${styles.card}`} style={{ '--i': i } as React.CSSProperties}>
                      <span className={styles.icon} />
                      <span className={styles.t}>{s}</span>
                      <span className={styles.lines}><i /><i /></span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
