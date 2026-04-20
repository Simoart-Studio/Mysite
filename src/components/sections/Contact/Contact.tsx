'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fromLeftProps, revealProps, fadeProps, EASE_WAVE } from '@/lib/motion';
import styles from './Contact.module.scss';

function SocialIcon({ type }: { type: 'linkedin' | 'github' }) {
  if (type === 'linkedin') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function Contact() {
  const { ref, isInView } = useScrollReveal<HTMLElement>();
  const reduced = useReducedMotion();

  return (
    <section
      id="contact"
      className={styles.section}
      ref={ref}
      aria-labelledby="contact-title"
    >
      <div className={styles.inner}>

        {/* label: from left */}
        <motion.div
          className={styles.top}
          {...fromLeftProps(isInView, reduced, 0)}
        >
          <p className={styles.label}>Kontakt</p>
        </motion.div>

        {/* headline: stage reveal per line */}
        <h2
          id="contact-title"
          className={styles.headline}
          aria-label="Zbudujmy coś, co ma sens."
        >
          {['Zbudujmy coś,', 'co ma sens.'].map((line, i) => (
            <span key={i} className={styles.lineWrap} aria-hidden="true">
              <motion.span
                className={styles.lineInner}
                initial={reduced ? false : { y: '106%', skewY: 3 }}
                animate={
                  reduced ? {} : isInView
                    ? { y: '0%', skewY: 0 }
                    : { y: '106%', skewY: 3 }
                }
                transition={reduced ? {} : { duration: 0.85, ease: EASE_WAVE, delay: 0.08 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* sub: fade up */}
        <motion.p
          className={styles.sub}
          {...revealProps(isInView, reduced, 0.36)}
        >
          20 minut przez Calendly. Bez zobowiązań.
          Odpowiadam tego samego dnia.
        </motion.p>

        {/* links: stagger up */}
        <motion.div className={styles.links} {...revealProps(isInView, reduced, 0.46)}>
          <a
            href="https://calendly.com/szymon-pochopien01/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaLink}
          >
            Umów rozmowę&nbsp;→
          </a>
          <a
            href="mailto:szymon.pochopien01@gmail.com"
            className={styles.ctaLink}
          >
            szymon.pochopien01@gmail.com&nbsp;→
          </a>
        </motion.div>

        {/* social: fade */}
        <motion.div
          className={styles.social}
          {...fadeProps(isInView, reduced, 0.62)}
        >
          <a
            href="https://linkedin.com/in/szymon-pochopien"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn Szymon Pochopień"
          >
            <SocialIcon type="linkedin" />
            LinkedIn
          </a>
          <a
            href="https://github.com/szymzyd"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub szymzyd"
          >
            <SocialIcon type="github" />
            GitHub
          </a>
        </motion.div>

      </div>
    </section>
  );
}
