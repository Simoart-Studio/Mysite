
/**
 * Prosty limiter w pamięci funkcji (okno przesuwne). Na Vercelu każda instancja
 * ma własną pamięć, więc to ochrona „best effort” — docelowo uzupełniona regułą
 * Vercel Firewall (zob. docs/RUNBOOK.md, sekcja „Rate limiting”).
 */
type Rule = { limit: number; windowMs: number };

const hits = new Map<string, number[]>();

function take(key: string, { limit, windowMs }: Rule, now: number): boolean {
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  return true;
}

export const CONTACT_RULES = {
  perIpBurst: { limit: 3, windowMs: 10 * 60_000 },
  perIpDay: { limit: 10, windowMs: 24 * 60 * 60_000 },
  globalDay: { limit: 100, windowMs: 24 * 60 * 60_000 },
} as const;

export type LimitResult = { ok: true } | { ok: false; reason: 'ip_burst' | 'ip_day' | 'global_day' };

export function checkContactLimit(ip: string, now = Date.now()): LimitResult {
  if (hits.size > 5000) hits.clear(); // ochrona pamięci przy zalewie unikalnych IP
  if (!take(`ip10m:${ip}`, CONTACT_RULES.perIpBurst, now)) return { ok: false, reason: 'ip_burst' };
  if (!take(`ipday:${ip}`, CONTACT_RULES.perIpDay, now)) return { ok: false, reason: 'ip_day' };
  if (!take('global', CONTACT_RULES.globalDay, now)) return { ok: false, reason: 'global_day' };
  return { ok: true };
}

/** Tylko do testów. */
export function resetRateLimit() {
  hits.clear();
}
