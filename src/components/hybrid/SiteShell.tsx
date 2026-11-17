import type { ReactNode } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { Field } from '@/components/concept/Field';
import styles from '@/components/concept/Concept.module.scss';

/** Wspólna obudowa wszystkich stron: jedno ciemne tło (shader), nawigacja i stopka z naklejką na szkle. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root} data-concept data-hybrid>
      <Field />
      <Nav sticker />
      <div className={styles.main}>{children}</div>
      <div className={styles.main}>
        <Footer sticker />
      </div>
    </div>
  );
}
