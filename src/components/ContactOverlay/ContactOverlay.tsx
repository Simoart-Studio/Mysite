'use client';

import { useRef, useEffect, useState } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { EASE_WAVE } from '@/lib/motion';
import Link from 'next/link';
import {
  AVAILABILITY, BRAND, EMAIL, PHONE, ATTACHMENT_MAX_MB, ATTACHMENT_ACCEPT, phoneHref,
} from '@/data/config';
import { CustomSelect } from './CustomSelect';
import styles from './ContactOverlay.module.scss';

type Status = 'idle' | 'sending' | 'sent';
type Field   = 'name' | 'email' | 'message' | 'consent' | 'attachment' | 'form';
type Errors  = Partial<Record<Field, string>>;

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
  if (!name.trim())    e.name    = 'Podaj imię.';
  if (!email.trim())   e.email   = 'Podaj adres e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Ten adres e-mail wygląda na niepoprawny.';
  if (!message.trim()) e.message = 'Napisz kilka słów o projekcie.';
  if (!consent)        e.consent = 'Zaznacz zgodę, żebym mógł odpowiedzieć.';
  if (file && file.size > MAX_BYTES) e.attachment = `Plik ma ${(file.size / 1024 / 1024).toFixed(1)} MB. Limit to ${ATTACHMENT_MAX_MB} MB.`;
  return e;
}

export function ContactOverlay() {
  const { overlay, close, contactPreset } = useOverlay();
  const prefersReduced      = useReducedMotion();
  const closeRef            = useRef<HTMLButtonElement>(null);
  const firstFieldRef       = useRef<HTMLInputElement>(null);
  const fileRef             = useRef<HTMLInputElement>(null);

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

  const isOpen = overlay === 'contact';

  useEffect(() => {
    if (isOpen) {
      if (contactPreset.goal) setGoal(contactPreset.goal);
      const id = setTimeout(() => firstFieldRef.current?.focus(), 350);
      return () => clearTimeout(id);
    }
  }, [isOpen, contactPreset]);

  useEffect(() => {
    if (!isOpen) {
      const id = setTimeout(() => {
        setName(''); setEmail(''); setGoal(''); setSiteUrl(''); setBudget('');
        setMessage(''); setFile(null); setConsent(false); setHoneypot('');
        setErrors({}); setStatus('idle');
      }, 500);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

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

  const dur = prefersReduced ? 0 : 0.6;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className={styles.backdrop}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.35 }}
          onClick={close}
        />
      )}
      {isOpen && (
        <motion.div
          key="overlay"
          id="contact-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Formularz kontaktowy"
          className={styles.overlay}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: dur, ease: EASE_WAVE }}
        >
          {/* Top bar */}
          <div className={styles.topBar}>
            <span className={styles.logoMark} aria-hidden="true">{BRAND}</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Zamknij formularz"
            >
              <span className={styles.closeLabel}>Zamknij</span>
              <span className={styles.closeX} aria-hidden="true">
                <span /><span />
              </span>
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>

            {/* Left — info */}
            <motion.aside
              className={styles.info}
              initial={{ opacity: 0, x: prefersReduced ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.55, delay: prefersReduced ? 0 : 0.25, ease: EASE_WAVE }}
              aria-label="Dane kontaktowe"
            >
              <div className={styles.infoHeading}>
                <p className={styles.infoEyebrow}>Kontakt</p>
                <p className={styles.infoTagline}>
                  Dobry projekt<br />zaczyna się<br />od rozmowy.
                </p>
              </div>

              <div className={styles.infoGroups}>
                <div className={styles.infoGroup}>
                  <p className={styles.infoLabel}>Email</p>
                  <a href={`mailto:${EMAIL}`} className={styles.infoLink}>
                    {EMAIL.split('@')[0]}<br />@{EMAIL.split('@')[1]}
                  </a>
                </div>
                {PHONE && (
                  <div className={styles.infoGroup}>
                    <p className={styles.infoLabel}>Telefon</p>
                    <a href={phoneHref(PHONE)} className={styles.infoLink}>{PHONE}</a>
                  </div>
                )}
                <div className={styles.infoGroup}>
                  <p className={styles.infoLabel}>Dostępność</p>
                  <p className={styles.infoValue}>
                    <span className={styles.dot} aria-hidden="true" />
                    Dostępny {AVAILABILITY}
                  </p>
                </div>
                <div className={styles.infoGroup}>
                  <p className={styles.infoLabel}>Odpowiedź</p>
                  <p className={styles.infoValue}>do 24 godzin</p>
                </div>
              </div>
            </motion.aside>

            {/* Right — form */}
            <div className={styles.formWrap}>
              <AnimatePresence mode="wait" initial={false}>
                {status === 'sent' ? (
                  <motion.div
                    key="success"
                    className={styles.success}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_WAVE }}
                    role="status"
                    aria-live="polite"
                  >
                    <p className={styles.successNum} aria-hidden="true">✓</p>
                    <p className={styles.successTitle}>Wiadomość wysłana.</p>
                    <p className={styles.successBody}>
                      Wiadomość dotarła. Odezwę się najszybciej jak to możliwe —
                      zazwyczaj tego samego dnia.
                    </p>
                    <button type="button" className={styles.successBtn} onClick={close}>
                      Zamknij okno
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : 0.2, ease: EASE_WAVE }}
                  >
                    <p className={styles.formHeading}>Opowiedz o swoim problemie.</p>

                    {/* Honeypot — ukryte przed ludźmi, wypełniane przez boty */}
                    <div className={styles.honeypot} aria-hidden="true">
                      <label htmlFor="cf-website">Website</label>
                      <input
                        id="cf-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="cf-name" className={styles.fieldLabel}>Imię</label>
                        <input
                          ref={firstFieldRef}
                          id="cf-name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'cf-name-err' : undefined}
                          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                          placeholder="Jan"
                          value={name}
                          onChange={(e) => { setName(e.target.value); clearErr('name'); }}
                        />
                        {errors.name && <span id="cf-name-err" className={styles.error} role="alert">{errors.name}</span>}
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="cf-email" className={styles.fieldLabel}>E-mail</label>
                        <input
                          id="cf-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'cf-email-err' : undefined}
                          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                          placeholder="jan@firma.pl"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
                        />
                        {errors.email && <span id="cf-email-err" className={styles.error} role="alert">{errors.email}</span>}
                      </div>
                    </div>

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="cf-goal" className={styles.fieldLabel}>
                          Cel <span className={styles.optional}>(opcjonalnie)</span>
                        </label>
                        <CustomSelect
                          id="cf-goal"
                          value={goal}
                          onChange={setGoal}
                          options={GOALS}
                          placeholder="Co chcesz zbudować?"
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="cf-budget" className={styles.fieldLabel}>
                          Budżet <span className={styles.optional}>(opcjonalnie)</span>
                        </label>
                        <CustomSelect
                          id="cf-budget"
                          value={budget}
                          onChange={setBudget}
                          options={BUDGETS}
                          placeholder="Orientacyjnie"
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cf-site" className={styles.fieldLabel}>
                        Adres obecnej strony <span className={styles.optional}>(jeśli masz)</span>
                      </label>
                      <input
                        id="cf-site"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        className={styles.input}
                        placeholder="https://twoja-firma.pl"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cf-message" className={styles.fieldLabel}>
                        Jaki problem chcesz rozwiązać?
                      </label>
                      <textarea
                        id="cf-message"
                        rows={4}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'cf-message-err' : undefined}
                        className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                        placeholder="Np. klienci dzwonią z pytaniami, które powinna wyjaśniać strona. Chcę zbierać rezerwacje online."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); clearErr('message'); }}
                      />
                      {errors.message && <span id="cf-message-err" className={styles.error} role="alert">{errors.message}</span>}
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cf-attachment" className={styles.fieldLabel}>
                        Załącznik <span className={styles.optional}>(opcjonalnie, PDF/PNG/JPG/DOCX, max {ATTACHMENT_MAX_MB} MB)</span>
                      </label>
                      <input
                        ref={fileRef}
                        id="cf-attachment"
                        type="file"
                        accept={ATTACHMENT_ACCEPT}
                        aria-invalid={!!errors.attachment}
                        aria-describedby={errors.attachment ? 'cf-attachment-err' : undefined}
                        className={styles.file}
                        onChange={(e) => { setFile(e.target.files?.[0] ?? null); clearErr('attachment'); }}
                      />
                      {file && !errors.attachment && (
                        <span className={styles.fileInfo}>
                          {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB{' '}
                          <button
                            type="button"
                            className={styles.fileRemove}
                            onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                          >
                            Usuń<span className="sr-only"> załącznik</span>
                          </button>
                        </span>
                      )}
                      {errors.attachment && <span id="cf-attachment-err" className={styles.error} role="alert">{errors.attachment}</span>}
                    </div>

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
                          Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na zapytanie.
                          Szczegóły w{' '}
                          <Link href="/polityka-prywatnosci" target="_blank" className={styles.consentLink}>
                            polityce prywatności
                          </Link>.
                        </span>
                      </label>
                      {errors.consent && <span id="cf-consent-err" className={styles.error} role="alert">{errors.consent}</span>}
                    </div>

                    {errors.form && <p className={styles.error} role="alert">{errors.form}</p>}

                    <button
                      type="submit"
                      className={styles.submit}
                      disabled={status === 'sending'}
                      aria-busy={status === 'sending'}
                    >
                      <span className={styles.submitInner}>
                        {status === 'sending' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                      </span>
                      <span className={styles.submitBg} aria-hidden="true" />
                    </button>

                    <div className={styles.after}>
                      <div className={styles.afterBlock}>
                        <p className={styles.afterTitle}>Co wydarzy się dalej?</p>
                        <ol className={styles.afterSteps}>
                          <li>Czytam wiadomość i odpowiadam do 24 godzin.</li>
                          <li>Jeśli trzeba, umawiamy krótką rozmowę.</li>
                          <li>Dostajesz propozycję zakresu i wycenę. Akceptujesz ją przed startem prac.</li>
                        </ol>
                      </div>
                      <div className={styles.afterBlock}>
                        <p className={styles.afterTitle}>Wolisz bezpośrednio?</p>
                        <p className={styles.afterDirect}>
                          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                          {PHONE && <> · <a href={phoneHref(PHONE)}>{PHONE}</a></>}
                        </p>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.footerText}>
              © {new Date().getFullYear()} {BRAND}
            </span>
            <span className={styles.footerText}>Z Polski dla świata.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
