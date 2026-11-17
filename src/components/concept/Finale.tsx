'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { BRAND, CALENDLY_URL, EMAIL, GITHUB_URL, PHONE, phoneHref } from '@/data/config';
import { dice } from './palette';
import { useScrollProgress } from './useScrollProgress';
import styles from './Finale.module.scss';

const WORD = 'Zaczynamy?';

/** Litery, które przy najechaniu przewijają się w górę jak bęben. */
function Roll({ text }: { text: string }) {
  return (
    <span className={styles.roll} aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span key={i} className={styles.rc} style={{ '--i': i } as React.CSSProperties} data-ch={ch}>{ch}</span>
      ))}
    </span>
  );
}

export function Finale() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, 'pass');

  return (
    <section ref={ref} id="kontakt" className={styles.section} aria-labelledby="finale-title">
      <p className={styles.label}><span>04</span> Kontakt</p>

      {/* Litery wypełniają się kolorem kostek wraz z przewijaniem */}
      <h2 id="finale-title" className={styles.big} aria-label={WORD}>
        {WORD.split('').map((ch, i) => (
          <span
            key={i}
            className={styles.ch}
            aria-hidden="true"
            style={{ '--i': i, '--n': WORD.length, '--c': dice(i) } as React.CSSProperties}
          >
            {ch}
          </span>
        ))}
      </h2>

      <a className={styles.mail} href={`mailto:${EMAIL}`} aria-label={`Napisz: ${EMAIL}`}>
        <Roll text={EMAIL} />
      </a>

      <ul className={styles.links}>
        {PHONE && <li><a href={phoneHref(PHONE)}>{PHONE}</a></li>}
        <li><a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Rozmowa 30 min ↗</a></li>
        <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
      </ul>

      <footer className={styles.foot}>
        <span>© {new Date().getFullYear()} {BRAND}</span>
        <Link href="/polityka-prywatnosci">Prywatność</Link>
      </footer>
    </section>
  );
}
