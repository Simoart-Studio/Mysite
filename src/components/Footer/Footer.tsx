import { GITHUB_URL, EMAIL, CALENDLY_URL } from '@/data/config';
import styles from './Footer.module.scss';

const NAV_COL = [
  { label: 'Nawigacja', links: [
    { href: '#works',   text: 'Realizacje' },
    { href: '#about',   text: 'O mnie'     },
    { href: '#contact', text: 'Kontakt'    },
  ]},
  { label: 'Kontakt', links: [
    { href: `mailto:${EMAIL}`, text: 'Email'    },
    { href: CALENDLY_URL,      text: 'Calendly' },
  ]},
  { label: 'Social', links: [
    { href: GITHUB_URL,   text: 'GitHub'   },
  ]},
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.sig}>SP</p>
            <p className={styles.tagline}>
              Projektuję i buduję cyfrowe produkty, które zarabiają — nie tylko wyglądają.
            </p>
            <p className={styles.location}>Polska · Remote</p>
          </div>

          <nav className={styles.cols} aria-label="Linki stopki">
            {NAV_COL.map(({ label, links }) => (
              <div key={label} className={styles.col}>
                <p className={styles.colLabel}>{label}</p>
                <ul role="list">
                  {links.map(({ href, text }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className={styles.colLink}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} Szymon Pochopień
          </p>
          <p className={styles.copy}>
            Next.js&nbsp;·&nbsp;Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
