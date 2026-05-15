'use client';

import { useRef, useEffect, useState } from 'react';
import { sendEmail } from '@/app/actions/sendEmail';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOverlay } from '@/context/OverlayContext';
import { EASE_WAVE } from '@/lib/motion';
import { AVAILABILITY } from '@/data/config';
import { CustomSelect } from './CustomSelect';
import styles from './ContactOverlay.module.scss';

type Status = 'idle' | 'sending' | 'sent';
type Errors  = Partial<Record<'name' | 'email' | 'message', string>>;

const PROJECT_TYPES = [
  'Strona internetowa',
  'Aplikacja webowa',
  'Landing page',
  'Redesign',
  'Inne',
] as const;

function validate(name: string, email: string, message: string): Errors {
  const e: Errors = {};
  if (!name.trim())    e.name    = 'Pole wymagane';
  if (!email.trim())   e.email   = 'Pole wymagane';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Nieprawidłowy email';
  if (!message.trim()) e.message = 'Pole wymagane';
  return e;
}

export function ContactOverlay() {
  const { overlay, close }  = useOverlay();
  const prefersReduced      = useReducedMotion();
  const closeRef            = useRef<HTMLButtonElement>(null);
  const firstFieldRef       = useRef<HTMLInputElement>(null);

  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [projectType, setProjectType] = useState('');
  const [message,     setMessage]     = useState('');
  const [honeypot,    setHoneypot]    = useState('');
  const [errors,      setErrors]      = useState<Errors>({});
  const [status,      setStatus]      = useState<Status>('idle');

  const isOpen = overlay === 'contact';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFieldRef.current?.focus(), 350);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const id = setTimeout(() => {
        setName(''); setEmail(''); setProjectType('');
        setMessage(''); setHoneypot(''); setErrors({}); setStatus('idle');
      }, 500);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const errs = validate(name, email, message);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');

    try {
      await sendEmail({ name, email, projectType, message, honeypot });
      setStatus('sent');
    } catch {
      setStatus('idle');
      setErrors({ message: 'Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.' });
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
            <span className={styles.logoMark} aria-hidden="true">SP</span>
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
                  <a href="mailto:szymon.pochopien01@gmail.com" className={styles.infoLink}>
                    szymon.pochopien01<br />@gmail.com
                  </a>
                </div>
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
                    <p className={styles.formHeading}>Napisz do mnie.</p>

                    {/* Honeypot — hidden from humans, filled by bots */}
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
                        <label htmlFor="cf-name" className={styles.fieldLabel}>
                          Imię i nazwisko
                        </label>
                        <input
                          ref={firstFieldRef}
                          id="cf-name"
                          type="text"
                          autoComplete="name"
                          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                          placeholder="Jan Kowalski"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                        />
                        {errors.name && <span className={styles.error} role="alert">{errors.name}</span>}
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="cf-email" className={styles.fieldLabel}>
                          Email
                        </label>
                        <input
                          id="cf-email"
                          type="email"
                          autoComplete="email"
                          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                          placeholder="jan@firma.pl"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                        />
                        {errors.email && <span className={styles.error} role="alert">{errors.email}</span>}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cf-type" className={styles.fieldLabel}>
                        Rodzaj projektu <span className={styles.optional}>(opcjonalnie)</span>
                      </label>
                      <CustomSelect
                        id="cf-type"
                        value={projectType}
                        onChange={setProjectType}
                        options={PROJECT_TYPES}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="cf-message" className={styles.fieldLabel}>
                        Wiadomość
                      </label>
                      <textarea
                        id="cf-message"
                        rows={5}
                        className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                        placeholder="Opowiedz mi o swoim projekcie — cel, zakres, termin..."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); setErrors(p => ({ ...p, message: undefined })); }}
                      />
                      {errors.message && <span className={styles.error} role="alert">{errors.message}</span>}
                    </div>

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
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.footerText}>
              © {new Date().getFullYear()} Szymon Pochopień
            </span>
            <span className={styles.footerText}>Z Polski dla świata.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
