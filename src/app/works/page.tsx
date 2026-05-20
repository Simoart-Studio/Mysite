import type { Metadata } from 'next';
import Link from 'next/link';
import { works } from '@/data/works';
import type { WorkType } from '@/types';
import { Nav } from '@/components/Nav/Nav';
import { Footer } from '@/components/Footer/Footer';
import { NoiseOverlay } from '@/components/NoiseOverlay/NoiseOverlay';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Realizacje',
  description: 'Wybrane projekty — strony sprzedażowe, sklepy internetowe i aplikacje webowe.',
};

const TYPE_LABEL: Record<WorkType, string> = {
  landing:   'Landing page',
  ecommerce: 'Sklep internetowy',
  app:       'Aplikacja webowa',
  other:     'Projekt',
};

export default function WorksPage() {
  return (
    <>
      <NoiseOverlay />
      <Nav />
      <main id="main-content" className={styles.page}>

        <header className={styles.hero} aria-labelledby="works-title">
          <div className={styles.heroInner}>
            <Link href="/" className={styles.back}>
              ← Portfolio
            </Link>
            <p className={styles.label}>Realizacje</p>
            <h1 id="works-title" className={styles.h1}>Wszystkie projekty</h1>
          </div>
        </header>

        <div className={styles.listWrap}>
          <ul className={styles.list} role="list">
            {works.map((work, i) => {
              const href  = work.caseStudy ? `/works/${work.slug}` : (work.liveUrl ?? '#');
              const isExt = !work.caseStudy && !!work.liveUrl;
              return (
                <li key={work.slug} className={styles.item}>
                  <Link
                    href={href}
                    className={styles.link}
                    target={isExt ? '_blank' : undefined}
                    rel={isExt ? 'noopener noreferrer' : undefined}
                    aria-label={`${work.title} — ${work.role}, ${work.year}`}
                  >
                    <div className={styles.left}>
                      <span className={styles.num}>0{i + 1}</span>
                      <h2 className={styles.title}>{work.title}</h2>
                      <p className={styles.meta}>
                        {TYPE_LABEL[work.type]}&ensp;·&ensp;{work.role}&ensp;·&ensp;{work.year}
                      </p>
                      <p className={styles.desc}>{work.description}</p>
                    </div>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </main>
      <Footer />
    </>
  );
}
