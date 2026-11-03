import { projects } from '@/lib/projects';
import { GITHUB_URL } from '@/data/config';
import { ProjectDeck } from '@/components/ProjectDeck/ProjectDeck';
import { ProjectGrid } from '@/components/ProjectDeck/ProjectGrid';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import styles from './Works.module.scss';

export function Works() {
  return (
    <section
      id="works"
      className={`${styles.section} section-light`}
      aria-labelledby="works-title"
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <div className={styles.headerRow}>
            <p className={styles.label}>Realizacje</p>
            <span className={styles.count} aria-hidden="true">
              {projects.length.toString().padStart(2, '0')}
            </span>
          </div>
          <h2 id="works-title" className={styles.headline}>Projekty</h2>
        </header>

        <div className={styles.deckArea}>
          <ErrorBoundary fallback={<ProjectGrid projects={projects} />}>
            <ProjectDeck projects={projects} grid={<ProjectGrid projects={projects} />} />
          </ErrorBoundary>
          {/* Bez JS: statyczna siatka z tymi samymi treściami */}
          <div className={styles.noJs}>
            <ProjectGrid projects={projects} />
          </div>
        </div>

        <div className={styles.footer}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
