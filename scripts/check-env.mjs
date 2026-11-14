/**
 * Walidacja konfiguracji przed buildem (fail-fast).
 * Build produkcyjny na Vercelu (VERCEL_ENV=production) kończy się błędem,
 * gdy brakuje zmiennych potrzebnych formularzowi kontaktowemu.
 * Lokalnie i w preview tylko ostrzega. Lista zmiennych: .env.example.
 */
const REQUIRED = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'];

const missing = REQUIRED.filter((k) => !process.env[k]?.trim());
const isProd = process.env.VERCEL_ENV === 'production';

if (process.env.GMAIL_USER && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.GMAIL_USER.trim())) {
  console.error('[check-env] GMAIL_USER nie wygląda na adres e-mail.');
  process.exit(1);
}

if (missing.length) {
  const msg = `[check-env] Brak zmiennych: ${missing.join(', ')} — formularz kontaktowy nie wyśle wiadomości.`;
  if (isProd) {
    console.error(`${msg}\nUstaw je w Vercel → Settings → Environment Variables (Production) i wdróż ponownie.`);
    process.exit(1);
  }
  console.warn(`${msg} (ostrzeżenie: środowisko ${process.env.VERCEL_ENV ?? 'lokalne'})`);
} else {
  console.log('[check-env] OK');
}
