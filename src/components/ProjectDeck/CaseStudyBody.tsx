import type { ReactNode } from 'react';
import type { Project } from '@/types/project';
import { Check } from 'lucide-react';
import { TODO } from '@/lib/projects';
import styles from './CaseStudyBody.module.scss';

type Heading = 'h2' | 'h3' | 'h4';

function Todo() {
  return <span className={styles.todo}>{TODO}</span>;
}

function Text({ value }: { value: string | null }) {
  return value ? <>{value}</> : <Todo />;
}

/**
 * Opis projektu językiem korzyści: dla kogo, z czym przyszedł klient, co powstało i co zyskuje.
 * Bez technologii i szczegółów wykonania — to ma przekonywać przyszłego klienta, nie programistę.
 */
export function CaseStudyBody({
  project,
  heading: H = 'h3',
  showLinks = true,
}: {
  project: Project;
  heading?: Heading;
  showLinks?: boolean;
}) {
  const isClient = project.labels.includes('klient');

  return (
    <div className={styles.body}>
      <div className={styles.block}>
        <H className={styles.label}>Dla kogo</H>
        <p className={styles.lead}>
          <Text value={project.forWho} />
        </p>
      </div>

      <div className={styles.steps}>
        <section className={styles.step}>
          <H className={styles.stepLabel}>Wyzwanie</H>
          <p className={styles.stepText}><Text value={project.problem} /></p>
        </section>
        <section className={styles.step}>
          <H className={styles.stepLabel}>Co powstało</H>
          <p className={styles.stepText}><Text value={project.solution} /></p>
        </section>
        {project.benefits.length > 0 && (
          <section className={`${styles.step} ${styles.gain}`}>
            <H className={styles.stepLabel}>Co zyskujesz</H>
            <ul className={styles.benefits}>
              {project.benefits.map((b) => (
                <li key={b}>
                  <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {!isClient && (
        <p className={styles.note}>
          Projekt własny: pokazuje, jak podobne rozwiązanie może działać w Twojej firmie.
        </p>
      )}

      {showLinks && <ProjectLinks project={project} />}
    </div>
  );
}

export function ProjectLinks({ project, extra }: { project: Project; extra?: ReactNode }) {
  const isClient = project.labels.includes('klient');
  return (
    <div className={styles.links}>
      {project.demoUrl && (
        <a
          className={styles.linkPrimary}
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isClient ? 'Zobacz stronę' : 'Zobacz demo'}
          <span className="sr-only"> projektu {project.name} (nowa karta)</span> ↗
        </a>
      )}
      {extra}
    </div>
  );
}
