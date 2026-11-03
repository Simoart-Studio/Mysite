import { GITHUB_URL, EMAIL, CALENDLY_URL, BRAND, OWNER, PHONE, phoneHref } from '@/data/config';
import styles from './Footer.module.scss';

const NAV_COL = [
  { label: 'Nawigacja', links: [
    { href: '/#works',   text: 'Projekty'      },
    { href: '/#uslugi',  text: 'Usługi'        },
    { href: '/#process', text: 'Współpraca'    },
    { href: '/#about',   text: 'O mnie'        },
    { href: '/#contact', text: 'Kontakt'       },
  ]},
  { label: 'Kontakt', links: [
    { href: `mailto:${EMAIL}`, text: 'Email'    },
    { href: CALENDLY_URL,      text: 'Calendly' },
    ...(PHONE ? [{ href: phoneHref(PHONE), text: 'Telefon' }] : []),
    { href: '/polityka-prywatnosci', text: 'Polityka prywatności' },
  ]},
  { label: 'Social', links: [
    { href: GITHUB_URL,   text: 'GitHub'   },
  ]},
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} section-dark`} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.sig}>{BRAND}</p>
            <p className={styles.tagline}>
              Strony i aplikacje, które zarabiają.
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
            © {year} {BRAND} · {OWNER}
          </p>
          <p className={styles.copy}>
            Next.js&nbsp;·&nbsp;Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
