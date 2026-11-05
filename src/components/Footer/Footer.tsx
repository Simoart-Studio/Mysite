import { EMAIL, BRAND, OWNER, GITHUB_URL } from '@/data/config';
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
    <footer className={`${styles.footer} bg-white`} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.row}>
          <a href="/" className={styles.logo}>SimoArt<span aria-hidden="true" /></a>
          <nav aria-label="Stopka">
            <ul className={styles.nav}>
              {NAV.map((l) => <li key={l.href}><a href={l.href}>{l.text}</a></li>)}
            </ul>
          </nav>
          <a href={`mailto:${EMAIL}`} className={styles.mail}>{EMAIL}</a>
        </div>
        <div className={styles.bottom}>
          <p>© {year} {BRAND} · {OWNER}</p>
          <p className={styles.links}>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/polityka-prywatnosci">Polityka prywatności</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
