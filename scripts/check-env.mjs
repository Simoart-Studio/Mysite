/**
 * Walidacja konfiguracji przed buildem (fail-fast).
 * Build produkcyjny na Vercelu (VERCEL_ENV=production) kończy się błędem,
 * gdy brakuje zmiennych potrzebnych formularzowi kontaktowemu.
 * Lokalnie i w preview tylko ostrzega. Lista zmiennych: .env.example.
 *
 * Wyjątek tymczasowy: ALLOW_MISSING_MAIL=1 pozwala zbudować produkcję bez skrzynki (np. gdy konto Google
 * czeka na weryfikację). Formularz pokazuje wtedy „chwilowo niedostępny” i odsyła do e-maila/telefonu.
 * Usuń tę zmienną od razu po dodaniu GMAIL_USER i GMAIL_APP_PASSWORD.
 */
const REQUIRED = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'];

const missing = REQUIRED.filter((k) => !process.env[k]?.trim());
const isProd = process.env.VERCEL_ENV === 'production';
const allowMissing = process.env.ALLOW_MISSING_MAIL === '1';

if (process.env.GMAIL_USER && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.GMAIL_USER.trim())) {
  console.error('[check-env] GMAIL_USER nie wygląda na adres e-mail.');
  process.exit(1);
}

if (missing.length) {
  const msg = `[check-env] Brak zmiennych: ${missing.join(', ')} — formularz kontaktowy nie wyśle wiadomości.`;
  if (isProd && allowMissing) {
    console.warn(`${msg}
[check-env] UWAGA: build produkcyjny dopuszczony wyjątkiem ALLOW_MISSING_MAIL=1 — formularz pokaże „chwilowo niedostępny”. Usuń wyjątek po dodaniu zmiennych.`);
  } else if (isProd) {
    console.error(`${msg}\nUstaw je w Vercel → Settings → Environment Variables (Production) i wdróż ponownie.`);
    process.exit(1);
  } else {
    console.warn(`${msg} (ostrzeżenie: środowisko ${process.env.VERCEL_ENV ?? 'lokalne'})`);
  }
} else {
  console.log('[check-env] OK');
}
