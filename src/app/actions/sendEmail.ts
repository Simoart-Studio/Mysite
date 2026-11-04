'use server';

import nodemailer from 'nodemailer';
import { ATTACHMENT_MAX_MB, ATTACHMENT_TYPES } from '@/data/config';

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const MAX_BYTES = ATTACHMENT_MAX_MB * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(fd: FormData, key: string, max = 2000) {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export async function sendEmail(fd: FormData): Promise<SendEmailResult> {
  if (str(fd, 'website')) return { ok: true };

  const name    = str(fd, 'name', 120);
  const email   = str(fd, 'email', 200);
  const goal    = str(fd, 'goal', 120);
  const siteUrl = str(fd, 'siteUrl', 300);
  const budget  = str(fd, 'budget', 60);
  const message = str(fd, 'message', 5000);
  const consent = fd.get('consent') === 'on';
  const file    = fd.get('attachment');

  if (!name)                  return { ok: false, field: 'name',    error: 'Podaj imię.' };
  if (!EMAIL_RE.test(email))  return { ok: false, field: 'email',   error: 'Podaj poprawny adres e-mail.' };
  if (!message)               return { ok: false, field: 'message', error: 'Napisz kilka słów o projekcie.' };
  if (!consent)               return { ok: false, field: 'consent', error: 'Potrzebuję zgody na przetwarzanie danych, żeby odpowiedzieć.' };

  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) {
      return { ok: false, field: 'attachment', error: `Załącznik może mieć maksymalnie ${ATTACHMENT_MAX_MB} MB.` };
    }
    if (!(ATTACHMENT_TYPES as readonly string[]).includes(file.type)) {
      return { ok: false, field: 'attachment', error: 'Dozwolone pliki: PDF, PNG, JPG, WEBP, DOCX.' };
    }
    attachments.push({
      filename: file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 100),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('[sendEmail] brak GMAIL_USER / GMAIL_APP_PASSWORD');
    return { ok: false, error: 'Formularz jest chwilowo niedostępny. Napisz bezpośrednio na e-mail.' };
  }

  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const rows: [string, string][] = [
    ['Od', `${name} <${email}>`],
    ['Cel', goal || '-'],
    ['Obecna strona', siteUrl || '-'],
    ['Budżet', budget || '-'],
    ['Zgoda RODO', 'tak'],
  ];

  try {
    await transporter.sendMail({
      from:    `"Formularz SimoArt" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER,
      replyTo: { name, address: email },
      subject: `Nowe zapytanie: ${goal || 'kontakt'} (${name})`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), '', message].join('\n'),
      html: `
        <table>${rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('')}</table>
        <hr/>
        <p>${esc(message).replace(/\n/g, '<br/>')}</p>
      `,
      attachments,
    });
  } catch (e) {
    console.error('[sendEmail]', e);
    return { ok: false, error: 'Nie udało się wysłać. Spróbuj ponownie albo napisz bezpośrednio.' };
  }

  return { ok: true };
}
