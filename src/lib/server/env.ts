import 'server-only';

/** Wymagane zmienne serwerowe. Ta sama lista jest sprawdzana w `scripts/check-env.mjs` przed buildem produkcyjnym. */
export function mailEnv(): { user: string; pass: string } | null {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  return user && pass ? { user, pass } : null;
}
