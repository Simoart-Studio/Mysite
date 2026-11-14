import Link from 'next/link';
import type { Project } from '@/types/project';
import { CardFront } from './CardFaces';
import { CaseStudyBody } from './CaseStudyBody';
import styles from './ProjectDeck.module.scss';

export function ProjectGrid({ projects, id }: { projects: Project[]; id?: string }) {
  return (
    <ul className={styles.grid} id={id} aria-label="Lista projektów">
      {projects.map((p) => (
        <li key={p.slug} className={styles.gridItem}>
          <article className={styles.gridCard} aria-labelledby={`grid-${p.slug}`}>
            <h3 id={`grid-${p.slug}`} className="sr-only">{p.name}</h3>
            <CardFront project={p} />
            <details className={styles.gridDetails}>
              <summary>Opis projektu</summary>
              <div className={styles.gridDetailsBody}>
                <CaseStudyBody project={p} heading="h4" />
              </div>
            </details>
            <Link href={`/works/${p.slug}`} className={styles.gridMore}>
              Pełne studium przypadku<span className="sr-only">: {p.name}</span> →
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
