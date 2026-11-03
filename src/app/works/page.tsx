import type { Metadata } from 'next';
import Link from 'next/link';
import { projects, formatMonth } from '@/lib/projects';
import { pageMetadata } from '@/lib/metadata';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import styles from './page.module.scss';

export const metadata: Metadata = pageMetadata({
  title: 'Wszystkie projekty',
  description: 'Lista projektów: sklepy internetowe, landing page, aplikacje webowe i PWA. Status, technologie i studia przypadków.',
  path: '/works',
});

export default function WorksPage() {
  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main id="main-content" className={styles.page}>

        <header className={styles.hero} aria-labelledby="works-title">
          <div className={styles.heroInner}>
            <Link href="/#works" className={styles.back}>
              ← Talia projektów
            </Link>
            <p className={styles.label}>Realizacje</p>
            <h1 id="works-title" className={styles.h1}>Wszystkie projekty</h1>
          </div>
        </header>

        <div className={styles.listWrap}>
          <ul className={styles.list} role="list">
            {projects.map((p, i) => (
              <li key={p.slug} className={styles.item}>
                <Link href={`/works/${p.slug}`} className={styles.link}>
                  <div className={styles.left}>
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <h2 className={styles.title}>{p.name}</h2>
                    <p className={styles.meta}>
                      {p.status}&ensp;·&ensp;{p.labels.join(', ')}
                      {p.lastCommitAt && <>&ensp;·&ensp;{formatMonth(p.lastCommitAt)}</>}
                    </p>
                    <p className={styles.desc}>{p.tagline ?? 'Opis w przygotowaniu.'}</p>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </main>
      <Footer />
    </>
  );
}
