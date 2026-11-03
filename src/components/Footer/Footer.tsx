import { EMAIL, PHONE, CALENDLY_URL, GITHUB_URL, LINKEDIN_URL, BRAND, OWNER, phoneHref } from '@/data/config';
import styles from './Footer.module.scss';

const NAV = [
  { href: '/#works',   text: 'Projekty'   },
  { href: '/#uslugi',  text: 'Usługi'     },
  { href: '/#process', text: 'Współpraca' },
  { href: '/#about',   text: 'O mnie'     },
  { href: '/#contact', text: 'Kontakt'    },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>SimoArt<span aria-hidden="true" /></a>
            <p className={styles.tagline}>Strony i aplikacje, które zarabiają.</p>
          </div>

          <nav className={styles.col} aria-label="Stopka — nawigacja">
            <p className={styles.colLabel}>Nawigacja</p>
            <ul>{NAV.map((l) => <li key={l.href}><a href={l.href}>{l.text}</a></li>)}</ul>
          </nav>

          <div className={styles.col}>
            <p className={styles.colLabel}>Kontakt</p>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              {PHONE && <li><a href={phoneHref(PHONE)}>{PHONE}</a></li>}
              <li><a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Calendly ↗</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colLabel}>Online</p>
            <ul>
              <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
              <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {BRAND} · {OWNER}</p>
          <a href="/polityka-prywatnosci">Polityka prywatności</a>
        </div>
      </div>
    </footer>
  );
}
