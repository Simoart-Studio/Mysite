'use client';

// Zastępuje root layout przy błędzie w nim samym — musi mieć własne <html> i <body>.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error && 'digest' in error ? (error as Error & { digest?: string }).digest : undefined;
  return (
    <html lang="pl">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif', background: '#F6F4EC', color: '#0E1D15' }}>
        <title>Błąd | SimoArt studio</title>
        <main style={{ maxWidth: 480, padding: 24, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Coś poszło nie tak.</h1>
          <p style={{ margin: '0 0 20px', lineHeight: 1.5 }}>
            Spróbuj ponownie za chwilę.{digest ? ` Kod błędu: ${digest}.` : ''}
          </p>
          <button type="button" onClick={() => retry()} style={{ padding: '12px 22px', borderRadius: 999, border: 0, background: '#0E1D15', color: '#fff', font: 'inherit', cursor: 'pointer' }}>
            Spróbuj ponownie
          </button>
        </main>
      </body>
    </html>
  );
}
