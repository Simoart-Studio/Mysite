import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects, formatMonth } from '@/lib/projects';
import { pageMetadata } from '@/lib/metadata';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { Thumb } from '@/components/ProjectDeck/CardFaces';
import styles from './page.module.scss';

export const metadata: Metadata = pageMetadata({
  title: 'Wszystkie projekty',
  description: 'Sklepy internetowe, strony firmowe, aplikacje webowe i PWA. Status, technologie i studia przypadków.',
  path: '/works',
});

export default function WorksPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className={styles.page}>
        <header className={styles.hero}>
          <Link href="/#works" className={styles.back}>← Strona główna</Link>
          <h1 className={styles.h1}>Wszystkie <span className="hl">projekty.</span></h1>
        </header>

        <ul className={styles.grid} role="list">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/works/${p.slug}`} className={styles.card}>
                <Thumb project={p} sizes="(max-width: 767px) 92vw, (max-width: 1100px) 46vw, 360px" />
                <span className={styles.meta}>
                  <span className={styles.status}>{p.status}</span>
                  {p.lastCommitAt && <span className={styles.date}>{formatMonth(p.lastCommitAt)}</span>}
                </span>
                <span className={styles.titleRow}>
                  <span className={styles.title}>{p.name}</span>
                  <span className={styles.arrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
                </span>
                <span className={styles.desc}>{p.tagline ?? 'Opis w przygotowaniu.'}</span>
                <span className={styles.chips}>
                  {p.stack.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
