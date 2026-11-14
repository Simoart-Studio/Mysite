import 'server-only';

/** Logi strukturalne (JSON, UTC) bez danych osobowych i treści wiadomości. */
export function logEvent(event: string, data: Record<string, string | number | boolean | null> = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), event, release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local', ...data });
  if (event.endsWith('_error')) console.error(line);
  else console.info(line);
}
