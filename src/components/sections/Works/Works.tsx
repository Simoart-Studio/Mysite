import Link from 'next/link';
import { projects } from '@/lib/projects';
import { ProjectList } from '@/components/ProjectList/ProjectList';
import { ProjectGrid } from '@/components/ProjectDeck/ProjectGrid';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { BtnIcon } from '@/components/BtnIcon/BtnIcon';
import { Dust } from '@/components/Dust/Dust';
import styles from './Works.module.scss';

/** `devices` — przy kaflach mini telefon z widokiem mobilnym (hybryda). */
export function Works({ devices = false }: { devices?: boolean } = {}) {
  return (
    <section
      id="works"
      className={`${styles.section} bg-white`}
      aria-labelledby="works-title"
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal>
          <h2 id="works-title" className={styles.headline}>
            Wybrane <Dust>projekty.</Dust>
          </h2>
          <Link href="/works" className="btn btn--green">
            Wszystkie projekty
            <BtnIcon />
          </Link>
        </header>

        <ErrorBoundary fallback={<ProjectGrid projects={projects} />}>
          {/* Na stronie głównej pełne rzędy siatki (6 = 2×3); wszystkie projekty są na /works */}
          <ProjectList projects={projects.slice(0, 6)} devices={devices} />
        </ErrorBoundary>

      </div>
    </section>
  );
}
