'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './not-found.module.scss';

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    const digest = error instanceof Error && 'digest' in error ? (error as Error & { digest?: string }).digest : undefined;
    console.error(JSON.stringify({ event: 'client_error_boundary', digest: digest ?? null }));
  }, [error]);

  const digest = error instanceof Error && 'digest' in error ? (error as Error & { digest?: string }).digest : undefined;

  return (
    <div data-concept data-hybrid>
    <main id="main-content" className={styles.page} aria-labelledby="error-title">
      <div className={styles.card}>
        <h1 id="error-title" className={styles.headline}>Coś poszło nie tak.</h1>
        <p className={styles.body}>
          Spróbuj ponownie za chwilę. Jeśli problem wraca, napisz do mnie.
          {digest && <> Kod błędu: <code>{digest}</code>.</>}
        </p>
        <div className={styles.links}>
          <button type="button" className="btn" onClick={() => retry()}>Spróbuj ponownie</button>
          <Link href="/" className="btn btn--ghost">Strona główna</Link>
        </div>
      </div>
    </main>
    </div>
  );
}
