import Link from 'next/link';
import Image from 'next/image';
import { LogoPill } from '@/components/LogoPill/LogoPill';
import { EMAIL, BRAND, OWNER, GITHUB_URL } from '@/data/config';
import styles from './Footer.module.scss';

const NAV = [
  { href: '/#works',   text: 'Projekty'   },
  { href: '/#uslugi',  text: 'Usługi'     },
  { href: '/#process', text: 'Współpraca' },
  { href: '/#about',   text: 'O mnie'     },
  { href: '/#contact', text: 'Kontakt'    },
];

export function Footer({ sticker = false }: { sticker?: boolean } = {}) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} bg-white`} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.row}>
          <Link href="/" className={styles.logo} aria-label={`${BRAND}, strona główna`}>
            {sticker
              ? <LogoPill height={60} />
              : <Image src="/logo.webp" alt="" width={316} height={160} sizes="130px" className={styles.logoImg} />}
          </Link>
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
