import { z } from 'zod';

/**
 * Jedno źródło prawdy dla formularza kontaktowego: używane w kliencie (UX)
 * i w Server Action (bezpieczeństwo). Bez sekretów — moduł trafia do bundla.
 */

export const GOALS = [
  'Strona firmowa',
  'Sklep internetowy',
  'Aplikacja webowa',
  'Aplikacja mobilna (PWA)',
  'MVP / prototyp',
  'Redesign obecnej strony',
  'Inne',
] as const;

export const BUDGETS = [
  'Do 5 000 zł',
  '5 000 – 10 000 zł',
  '10 000 – 20 000 zł',
  'Powyżej 20 000 zł',
  'Nie wiem jeszcze',
] as const;

export const LIMITS = { name: 120, email: 200, siteUrl: 300, message: 5000 } as const;

const EMAIL_RE = /^[^\s@<>,;"']+@[^\s@<>,;"']+\.[^\s@<>,;"']+$/;

/** Akceptuje adres z protokołem lub bez (`mojafirma.pl`); zwraca znormalizowany URL http(s). */
export function normalizeSiteUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes('.')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

const trimmed = (max: number) => z.string().trim().max(max);

export const contactSchema = z.object({
  name: trimmed(LIMITS.name).min(1, 'Podaj imię.'),
  email: trimmed(LIMITS.email)
    .min(1, 'Podaj adres e-mail.')
    .regex(EMAIL_RE, 'Ten adres e-mail wygląda na niepoprawny.'),
  goal: z.union([z.enum(GOALS), z.literal('')], { error: 'Wybierz rodzaj projektu z listy.' }),
  budget: z.union([z.enum(BUDGETS), z.literal('')], { error: 'Wybierz budżet z listy.' }),
  siteUrl: z
    .string()
    .max(LIMITS.siteUrl, 'Adres strony jest za długi.')
    .transform((v, ctx) => {
      const n = normalizeSiteUrl(v);
      if (n === null) {
        ctx.addIssue({ code: 'custom', message: 'Podaj adres strony, np. mojafirma.pl.' });
        return z.NEVER;
      }
      return n;
    }),
  message: trimmed(LIMITS.message).min(1, 'Napisz kilka słów o projekcie.'),
  consent: z.literal(true, { error: 'Zaznacz zgodę, żebym mógł odpowiedzieć.' }),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Pierwszy błąd na pole — format wygodny dla UI. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
