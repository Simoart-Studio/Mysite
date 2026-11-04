'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Paperclip, Check } from 'lucide-react';
import { sendEmail } from '@/app/actions/sendEmail';
import { useOverlay } from '@/context/OverlayContext';
import { ATTACHMENT_MAX_MB, ATTACHMENT_ACCEPT } from '@/data/config';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './ContactForm.module.scss';

type Status = 'idle' | 'sending' | 'sent';
type Field  = 'name' | 'email' | 'message' | 'consent' | 'attachment' | 'form';
type Errors = Partial<Record<Field, string>>;

const GOALS = [
  'Strona firmowa',
  'Sklep internetowy',
  'Aplikacja webowa',
  'Aplikacja mobilna (PWA)',
  'MVP / prototyp',
  'Redesign obecnej strony',
  'Inne',
] as const;

const BUDGETS = [
  'Do 5 000 zł',
  '5 000 – 10 000 zł',
  '10 000 – 20 000 zł',
  'Powyżej 20 000 zł',
  'Nie wiem jeszcze',
] as const;

const MAX_BYTES = ATTACHMENT_MAX_MB * 1024 * 1024;

function validate(name: string, email: string, message: string, consent: boolean, file: File | null): Errors {
  const e: Errors = {};
  if (!message.trim()) e.message = 'Napisz kilka słów o projekcie.';
  if (!name.trim())    e.name    = 'Podaj imię.';
  if (!email.trim())   e.email   = 'Podaj adres e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Ten adres e-mail wygląda na niepoprawny.';
  if (!consent)        e.consent = 'Zaznacz zgodę, żebym mógł odpowiedzieć.';
  if (file && file.size > MAX_BYTES) e.attachment = `Plik ma ${(file.size / 1024 / 1024).toFixed(1)} MB. Limit to ${ATTACHMENT_MAX_MB} MB.`;
  return e;
}

/** Formularz kontaktowy osadzony w sekcji „Kontakt”. */
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

  // Przycisk „Porozmawiajmy” gdziekolwiek na stronie: ustaw cel i przejdź do wiadomości
  useEffect(() => {
    if (!contactPreset.nonce) return;
    if (contactPreset.goal) setGoal(contactPreset.goal);
    const id = setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 700);
    return () => clearTimeout(id);
  }, [contactPreset]);

  const clearErr = (f: Field) => setErrors((p) => ({ ...p, [f]: undefined, form: undefined }));

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs = validate(name, email, message, consent, file);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`cf-${first}`)?.focus();
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

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const done = [message.trim().length > 0, name.trim().length > 0, emailOk, consent];
  const progress = Math.round((done.filter(Boolean).length / done.length) * 100);
  const groupDone = {
    project: message.trim().length > 0,
    contact: name.trim().length > 0 && emailOk,
    details: !!(siteUrl || budget || file),
  };

  return (
    <form id="contact-form" className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Formularz kontaktowy">
      <div className={styles.head}>
        <div>
          <p className={styles.title}>Krótki brief</p>
          <p className={styles.subtitle}>Około 2 minut. Pola bez dopisku są wymagane.</p>
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressValue}>{progress}%</span>
          <span className={styles.progressTrack}><span style={{ transform: `scaleX(${progress / 100})` }} /></span>
        </div>
      </div>

      {/* Honeypot — ukryte przed ludźmi, wypełniane przez boty */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <Group n={1} title="Projekt" done={groupDone.project}>
        <ChipGroup name="goal" legend="Co chcesz zbudować?" optional options={GOALS} value={goal} onChange={setGoal} />

        <div className={styles.field}>
          <label htmlFor="cf-message" className={styles.label}>Wiadomość</label>
          <textarea
            ref={messageRef}
            id="cf-message"
            rows={4}
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'cf-message-err' : undefined}
            className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Co dziś nie działa tak, jak powinno? Jaki efekt chcesz osiągnąć?"
            value={message}
            onChange={(e) => { setMessage(e.target.value); clearErr('message'); }}
          />
          {errors.message && <span id="cf-message-err" className={styles.error} role="alert">{errors.message}</span>}
        </div>
      </Group>

      <Group n={2} title="Kontakt" done={groupDone.contact}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cf-name" className={styles.label}>Imię</label>
            <input
              id="cf-name" type="text" autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'cf-name-err' : undefined}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Twoje imię"
              value={name}
              onChange={(e) => { setName(e.target.value); clearErr('name'); }}
            />
            {errors.name && <span id="cf-name-err" className={styles.error} role="alert">{errors.name}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="cf-email" className={styles.label}>E-mail</label>
            <input
              id="cf-email" type="email" autoComplete="email" inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'cf-email-err' : undefined}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Na ten adres odpiszę"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
            />
            {errors.email && <span id="cf-email-err" className={styles.error} role="alert">{errors.email}</span>}
          </div>
        </div>
      </Group>

      <Group n={3} title="Szczegóły" optional done={groupDone.details}>
        <div className={styles.field}>
          <label htmlFor="cf-site" className={styles.label}>
            Obecna strona <span className={styles.optional}>jeśli masz</span>
          </label>
          <input
            id="cf-site" type="url" inputMode="url" autoComplete="url"
            className={styles.input}
            placeholder="twojafirma.pl"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
          />
        </div>

        <ChipGroup name="budget" legend="Budżet" optional options={BUDGETS} value={budget} onChange={setBudget} />

        <div className={styles.field}>
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
              <Paperclip size={16} aria-hidden="true" />
              <span className={styles.fileName}>{file ? file.name : 'Dodaj załącznik'}</span>
              {!file && <span className={styles.optional}>opcjonalnie</span>}
            </label>
            {file && (
              <button
                type="button"
                className={styles.fileRemove}
                onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
              >
                Usuń<span className="sr-only"> załącznik</span>
              </button>
            )}
          </div>
          <span id="cf-attachment-hint" className={styles.hint}>PDF, JPG, PNG, WEBP lub DOCX · do {ATTACHMENT_MAX_MB} MB</span>
          {errors.attachment && <span id="cf-attachment-err" className={styles.error} role="alert">{errors.attachment}</span>}
        </div>
      </Group>

      <div className={styles.foot}>
        <div className={styles.field}>
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
              Zgadzam się na przetwarzanie danych w celu odpowiedzi na zapytanie.{' '}
              <Link href="/polityka-prywatnosci" target="_blank" className={styles.consentLink}>
                Polityka prywatności
              </Link>
            </span>
          </label>
          {errors.consent && <span id="cf-consent-err" className={styles.error} role="alert">{errors.consent}</span>}
        </div>

        {errors.form && <p className={styles.error} role="alert">{errors.form}</p>}

        <button type="submit" className={`btn ${styles.submit}`} disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
          <BtnIcon />
        </button>
      </div>
    </form>
  );
}

/** Numerowana grupa pól z oznaczeniem ukończenia. */
function Group({
  n, title, optional = false, done, children,
}: {
  n: number;
  title: string;
  optional?: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`${styles.group} ${done ? styles.groupDone : ''}`} aria-label={`${n}. ${title}`}>
      <p className={styles.groupHead} aria-hidden="true">
        <span className={styles.groupNum}>{done ? <Check size={14} strokeWidth={3} /> : n}</span>
        {title}
        {optional && <span className={styles.optional}>opcjonalnie</span>}
      </p>
      <div className={styles.groupBody}>{children}</div>
    </section>
  );
}

/** Wybór jednej opcji jako „chipy” (natywne radio — działa klawiaturą, nic się nie rozwija). */
function ChipGroup({
  name, legend, options, value, onChange, optional = false,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <fieldset className={styles.chipGroup}>
      <legend className={styles.label}>
        {legend} {optional && <span className={styles.optional}>opcjonalnie</span>}
      </legend>
      <div className={styles.chips}>
        {options.map((o) => (
          <label key={o} className={styles.chip}>
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              onClick={() => { if (value === o) onChange(''); }}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
