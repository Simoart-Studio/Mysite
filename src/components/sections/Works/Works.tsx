import { projects } from '@/lib/projects';
import { ProjectDeck } from '@/components/ProjectDeck/ProjectDeck';
import { ProjectGrid } from '@/components/ProjectDeck/ProjectGrid';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import styles from './Works.module.scss';

export function Works() {
  return (
    <section
      id="works"
      className={styles.section}
      aria-labelledby="works-title"
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <h2 id="works-title" className={styles.headline}>
            Wybrane <span className="hl">projekty.</span>
          </h2>
          <a href="/works" className="btn btn--green">
            Wszystkie projekty
            <BtnIcon />
          </a>
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

      </div>
    </section>
  );
}
