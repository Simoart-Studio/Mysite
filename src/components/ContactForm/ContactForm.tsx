'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Paperclip, Check } from 'lucide-react';
import { sendEmail } from '@/app/actions/sendEmail';
import { useOverlay } from '@/context/OverlayContext';
import { ATTACHMENT_MAX_MB, ATTACHMENT_ACCEPT } from '@/data/config';
import { BUDGETS, GOALS } from '@/lib/contactOptions';
import type { ContactField, ContactInput } from '@/lib/contactSchema';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './ContactForm.module.scss';

type Status = 'idle' | 'sending' | 'sent';
type Field  = ContactField | 'attachment' | 'form';
type Errors = Partial<Record<Field, string>>;

const MAX_BYTES = ATTACHMENT_MAX_MB * 1024 * 1024;

async function validate(input: Record<keyof ContactInput, unknown>, file: File | null): Promise<Errors> {
  // Schemat (Zod) ładowany na żądanie — nie obciąża pierwszego wczytania strony.
  const { contactSchema, fieldErrors } = await import('@/lib/contactSchema');
  const r = contactSchema.safeParse(input);
  const e: Errors = r.success ? {} : fieldErrors(r.error);
  if (file && file.size > MAX_BYTES) e.attachment = `Plik ma ${(file.size / 1024 / 1024).toFixed(1)} MB. Limit to ${ATTACHMENT_MAX_MB} MB.`;
  return e;
}

const FIELD_ORDER: Field[] = ['name', 'email', 'goal', 'budget', 'siteUrl', 'message', 'attachment', 'consent'];
const FIELD_ID: Partial<Record<Field, string>> = { siteUrl: 'cf-site' };

export function ContactForm() {
  const { contactPreset } = useOverlay();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [goal,     setGoal]     = useState('');
  const [siteUrl,  setSiteUrl]  = useState('');
  const [budget,   setBudget]   = useState('');
  const [message,  setMessage]  = useState('');
  const [file,     setFile]     = useState<File | null>(null);
  const [consent,  setConsent]  = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors,   setErrors]   = useState<Errors>({});
  const [status,   setStatus]   = useState<Status>('idle');

  useEffect(() => {
    if (!contactPreset.nonce) return;
    if (contactPreset.goal) setGoal(contactPreset.goal);
    const id = setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 700);
    return () => clearTimeout(id);
  }, [contactPreset]);

  const clearErr = (f: Field) => setErrors((p) => ({ ...p, [f]: undefined, form: undefined }));

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs = await validate({ name, email, goal, budget, siteUrl, message, consent }, file);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = FIELD_ORDER.find((f) => errs[f]);
      if (first) document.getElementById(FIELD_ID[first] ?? `cf-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus('sending');

    const fd = new FormData();
    fd.set('name', name); fd.set('email', email); fd.set('goal', goal);
    fd.set('siteUrl', siteUrl); fd.set('budget', budget); fd.set('message', message);
    fd.set('website', honeypot);
    if (consent) fd.set('consent', 'on');
    if (file) fd.set('attachment', file);

    try {
      const res = await sendEmail(fd);
      if (res.ok) { setStatus('sent'); return; }
      setStatus('idle');
      setErrors({ [res.field ?? 'form']: res.error });
      if (res.field) document.getElementById(FIELD_ID[res.field] ?? `cf-${res.field}`)?.focus();
    } catch {
      setStatus('idle');
      setErrors({ form: 'Błąd wysyłki. Spróbuj ponownie albo napisz bezpośrednio.' });
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true"><Check size={26} strokeWidth={2.6} /></span>
        <p className={styles.successTitle}>Wiadomość wysłana.</p>
        <p className={styles.successBody}>Dziękuję! Odpowiem do 24 godzin.</p>
      </div>
    );
  }

  return (
    <form id="contact-form" className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Formularz kontaktowy">
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="cf-name" className={styles.label}>Imię</label>
          <input
            id="cf-name" type="text" autoComplete="name" maxLength={120}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            value={name}
            onChange={(e) => { setName(e.target.value); clearErr('name'); }}
          />
          {errors.name && <span id="cf-name-err" className={styles.error} role="alert">{errors.name}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="cf-email" className={styles.label}>E-mail</label>
          <input
            id="cf-email" type="email" autoComplete="email" inputMode="email" maxLength={200}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
          />
          {errors.email && <span id="cf-email-err" className={styles.error} role="alert">{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="cf-goal" className={styles.label}>Rodzaj projektu</label>
          <select id="cf-goal" className={`${styles.input} ${styles.select}`} value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">Wybierz</option>
            {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="cf-budget" className={styles.label}>
            Budżet <span className={styles.optional}>opcjonalnie</span>
          </label>
          <select id="cf-budget" className={`${styles.input} ${styles.select}`} value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Wybierz</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="cf-site" className={styles.label}>
            Obecna strona <span className={styles.optional}>opcjonalnie</span>
          </label>
          <input
            id="cf-site" type="url" inputMode="url" autoComplete="url"
            className={`${styles.input} ${errors.siteUrl ? styles.inputError : ''}`}
            placeholder="np. mojafirma.pl"
            maxLength={300}
            value={siteUrl}
            aria-invalid={!!errors.siteUrl}
            aria-describedby={errors.siteUrl ? 'cf-site-err' : undefined}
            onChange={(e) => { setSiteUrl(e.target.value); clearErr('siteUrl'); }}
          />
          {errors.siteUrl && <span id="cf-site-err" className={styles.error} role="alert">{errors.siteUrl}</span>}
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="cf-message" className={styles.label}>Wiadomość</label>
          <textarea
            ref={messageRef}
            id="cf-message"
            rows={5}
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'cf-message-err' : undefined}
            className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Kilka zdań o projekcie i celu."
            value={message}
            onChange={(e) => { setMessage(e.target.value); clearErr('message'); }}
          />
          {errors.message && <span id="cf-message-err" className={styles.error} role="alert">{errors.message}</span>}
        </div>
      </div>

      <div className={styles.fileRow}>
        <input
          ref={fileRef}
          id="cf-attachment"
          type="file"
          accept={ATTACHMENT_ACCEPT}
          aria-invalid={!!errors.attachment}
          aria-describedby={`cf-attachment-hint${errors.attachment ? ' cf-attachment-err' : ''}`}
          className={styles.fileInput}
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); clearErr('attachment'); }}
        />
        <label htmlFor="cf-attachment" className={styles.fileBtn}>
          <Paperclip size={15} aria-hidden="true" />
          <span className={styles.fileName}>{file ? file.name : 'Dodaj załącznik'}</span>
        </label>
        {file ? (
          <button
            type="button"
            className={styles.fileRemove}
            onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
          >
            Usuń<span className="sr-only"> załącznik</span>
          </button>
        ) : (
          <span id="cf-attachment-hint" className={styles.hint}>PDF, JPG, PNG, WEBP, DOCX · do {ATTACHMENT_MAX_MB} MB</span>
        )}
      </div>
      {errors.attachment && <span id="cf-attachment-err" className={styles.error} role="alert">{errors.attachment}</span>}

      <div className={styles.foot}>
        <div className={styles.consentWrap}>
          <label className={styles.consent} htmlFor="cf-consent">
            <input
              id="cf-consent"
              type="checkbox"
              checked={consent}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? 'cf-consent-err' : undefined}
              onChange={(e) => { setConsent(e.target.checked); clearErr('consent'); }}
            />
            <span>
              Zgadzam się na przetwarzanie danych w celu odpowiedzi.{' '}
              <Link href="/polityka-prywatnosci" target="_blank" className={styles.consentLink}>Polityka prywatności</Link>
            </span>
          </label>
          {errors.consent && <span id="cf-consent-err" className={styles.error} role="alert">{errors.consent}</span>}
        </div>

        <button type="submit" className={`btn ${styles.submit}`} disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Wysyłanie…' : 'Wyślij'}
          <BtnIcon />
        </button>
      </div>

      {errors.form && <p className={styles.error} role="alert">{errors.form}</p>}
    </form>
  );
}
