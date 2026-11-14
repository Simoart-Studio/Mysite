import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteShell } from '@/components/hybrid/SiteShell';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: '404: strona nie istnieje',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <main id="main-content" className={styles.page} aria-labelledby="notfound-title">
        <div className={styles.card}>
          <p className={styles.code} aria-hidden="true">404</p>
          <h1 id="notfound-title" className={styles.headline}>Tej strony nie ma.</h1>
          <p className={styles.body}>Adres mógł się zmienić. Wróć na start albo zobacz projekty.</p>
          <div className={styles.links}>
            <Link href="/" className="btn">Strona główna<BtnIcon /></Link>
            <Link href="/#works" className="btn btn--ghost">Projekty<BtnIcon /></Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
