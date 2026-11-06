'use server';

import { randomUUID } from 'node:crypto';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';
import { ATTACHMENT_MAX_MB } from '@/data/config';
import { contactSchema, fieldErrors, type ContactField } from '@/lib/contactSchema';
import { verifyFile } from '@/lib/server/fileSignature';
import { checkContactLimit } from '@/lib/server/rateLimit';
import { mailEnv } from '@/lib/server/env';
import { logEvent } from '@/lib/server/log';

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string; field?: ContactField | 'attachment'; ref?: string };

const MAX_BYTES = ATTACHMENT_MAX_MB * 1024 * 1024;
const SMTP_TIMEOUT_MS = 10_000;

function text(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v : '';
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel nadpisuje x-forwarded-for adresem klienta; pierwszy wpis to klient.
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

export async function sendEmail(fd: FormData): Promise<SendEmailResult> {
  const ref = randomUUID().slice(0, 8);

  // Honeypot: udajemy sukces, nic nie wysyłamy.
  if (text(fd, 'website')) {
    logEvent('contact_rejected', { ref, reason: 'honeypot' });
    return { ok: true };
  }

  const limit = checkContactLimit(await clientIp());
  if (!limit.ok) {
    logEvent('contact_rejected', { ref, reason: `rate_${limit.reason}` });
    return { ok: false, ref, error: 'Wysłano już kilka wiadomości. Spróbuj ponownie później albo napisz bezpośrednio na e-mail.' };
  }

  const parsed = contactSchema.safeParse({
    name: text(fd, 'name'),
    email: text(fd, 'email'),
    goal: text(fd, 'goal'),
    budget: text(fd, 'budget'),
    siteUrl: text(fd, 'siteUrl'),
    message: text(fd, 'message'),
    consent: fd.get('consent') === 'on',
  });
  if (!parsed.success) {
    const errs = fieldErrors(parsed.error);
    const field = (Object.keys(errs)[0] ?? undefined) as ContactField | undefined;
    logEvent('contact_rejected', { ref, reason: 'validation', field: field ?? null });
    return { ok: false, ref, field, error: (field && errs[field]) || 'Sprawdź pola formularza.' };
  }
  const data = parsed.data;

  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  const file = fd.get('attachment');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) {
      logEvent('contact_rejected', { ref, reason: 'attachment_size' });
      return { ok: false, ref, field: 'attachment', error: `Załącznik może mieć maksymalnie ${ATTACHMENT_MAX_MB} MB.` };
    }
    const content = Buffer.from(await file.arrayBuffer());
    const mime = verifyFile(content, file.name);
    if (!mime) {
      logEvent('contact_rejected', { ref, reason: 'attachment_type' });
      return { ok: false, ref, field: 'attachment', error: 'Dozwolone pliki: PDF, PNG, JPG, WEBP, DOCX.' };
    }
    attachments.push({
      filename: file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 100),
      content,
      contentType: mime,
    });
  }

  const env = mailEnv();
  if (!env) {
    logEvent('contact_error', { ref, reason: 'missing_smtp_env' });
    return { ok: false, ref, error: 'Formularz jest chwilowo niedostępny. Napisz bezpośrednio na e-mail.' };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true, // STARTTLS obowiązkowy — bez szyfrowania połączenie jest przerywane
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    auth: { user: env.user, pass: env.pass },
  });

  const rows: [string, string][] = [
    ['Od', `${data.name} <${data.email}>`],
    ['Cel', data.goal || '-'],
    ['Obecna strona', data.siteUrl || '-'],
    ['Budżet', data.budget || '-'],
    ['Zgoda RODO', 'tak'],
    ['Nr zgłoszenia', ref],
  ];

  try {
    await transporter.sendMail({
      from: `"Formularz SimoArt" <${env.user}>`,
      to: env.user,
      replyTo: { name: data.name, address: data.email },
      subject: `Nowe zapytanie: ${data.goal || 'kontakt'} (${data.name})`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), '', data.message].join('\n'),
      html: `
        <table>${rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('')}</table>
        <hr/>
        <p>${esc(data.message).replace(/\n/g, '<br/>')}</p>
      `,
      attachments,
    });
  } catch (e) {
    const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: unknown }).code) : 'unknown';
    logEvent('contact_error', { ref, reason: 'smtp', code });
    return { ok: false, ref, error: `Nie udało się wysłać (kod ${ref}). Spróbuj ponownie albo napisz bezpośrednio.` };
  }

  logEvent('contact_sent', { ref, attachment: attachments.length > 0 });
  return { ok: true };
}
