'use client';

import { useRef } from 'react';
import { dice } from '@/components/concept/palette';
import { useScrollProgress } from '@/components/concept/useScrollProgress';
import styles from './FillWord.module.scss';

/**
 * Słowo, którego litery wypełniają się kolorami kostek w miarę przewijania (od konturu do koloru).
 * Tekst jest w HTML raz (sr-only — dla czytników i wyszukiwarek); kolorowe litery to ozdoba rysowana z CSS
 * (content: attr(data-ch)), więc nagłówek nie zawiera zdublowanego słowa.
 */
export function FillWord({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useScrollProgress(ref, 'pass');
  return (
    <span ref={ref} className={styles.word}>
      <span className="sr-only">{text}</span>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={styles.ch}
          aria-hidden="true"
          data-ch={ch}
          style={{ '--i': i, '--n': text.length, '--c': dice(i) } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
