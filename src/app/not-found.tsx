import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: '404 — Strona nie istnieje',
};

export default function NotFound() {
  return (
    <main className={styles.page} aria-labelledby="notfound-title">
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden="true">404</p>
        <h1 id="notfound-title" className={styles.headline}>
          Tej strony nie ma.
        </h1>
        <p className={styles.body}>
          Sprawdź adres lub przejdź do jednej z poniższych sekcji.
        </p>
        <nav className={styles.links} aria-label="Pomocne linki">
          <Link href="/" className={styles.cta}>
            ← Strona główna
          </Link>
          <Link href="/#works" className={styles.ctaSecondary}>
            Realizacje
          </Link>
          <Link href="/#contact" className={styles.ctaSecondary}>
            Kontakt
          </Link>
        </nav>
      </div>
    </main>
  );
}
