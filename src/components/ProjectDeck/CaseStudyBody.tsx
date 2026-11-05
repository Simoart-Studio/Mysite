import type { ReactNode } from 'react';
import type { Project } from '@/types/project';
import { TODO, formatMonth } from '@/lib/projects';
import styles from './CaseStudyBody.module.scss';

type Heading = 'h2' | 'h3' | 'h4';

function Todo() {
  return <span className={styles.todo}>{TODO}</span>;
}

function Text({ value }: { value: string | null }) {
  return value ? <>{value}</> : <Todo />;
}

export function CaseStudyBody({
  project,
  heading: H = 'h3',
  showLinks = true,
}: {
  project: Project;
  heading?: Heading;
  showLinks?: boolean;
}) {
  const steps: { label: string; value: string | null }[] = [
    { label: 'Problem',     value: project.problem  },
    { label: 'Rozwiązanie', value: project.solution },
    { label: 'Mój zakres',  value: project.scope    },
    { label: 'Efekt',       value: project.effect   },
  ];
  const updated = formatMonth(project.lastCommitAt);

  return (
    <div className={styles.body}>
      <div className={styles.block}>
        <H className={styles.label}>Dla kogo</H>
        <p className={styles.lead}>
          <Text value={project.forWho} />
        </p>
        {!project.problem && project.readmeSummary && (
          <p className={styles.note}>
            Z README: „{project.readmeSummary}”
          </p>
        )}
      </div>

      <ol className={styles.steps} aria-label="Przebieg projektu">
        {steps.map(({ label, value }) => (
          <li key={label} className={styles.step}>
            <H className={styles.stepLabel}>{label}</H>
            <p className={styles.stepText}><Text value={value} /></p>
          </li>
        ))}
      </ol>

      <div className={styles.block}>
        <H className={styles.label}>Wyzwanie</H>
        {project.challenge ? (
          <>
            <p className={styles.challengeTitle}>{project.challenge.title}</p>
            <p className={styles.text}>{project.challenge.body}</p>
          </>
        ) : (
          <p className={styles.text}><Todo /></p>
        )}
      </div>

      <div className={styles.block}>
        <H className={styles.label}>Technologie</H>
        {project.stackFull.length || project.stack.length ? (
          <ul className={styles.chips} aria-label="Użyte technologie">
            {(project.stackFull.length ? project.stackFull : project.stack).map((t) => (
              <li key={t} className={styles.chip}>{t}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.text}><Todo /></p>
        )}
        {project.languages.length > 0 && (
          <div className={styles.langs}>
            <div className={styles.langBar} aria-hidden="true">
              {project.languages.map((l) => (
                <span key={l.name} style={{ flexGrow: l.percent }} title={`${l.name} ${l.percent}%`} />
              ))}
            </div>
            <p className={styles.langText}>
              Języki w repozytorium:{' '}
              {project.languages.map((l) => `${l.name} ${l.percent.toLocaleString('pl-PL')}%`).join(' · ')}
            </p>
          </div>
        )}
      </div>

      {project.limitations.length > 0 && (
        <div className={styles.block}>
          <H className={styles.label}>Ograniczenia</H>
          <ul className={styles.limits}>
            {project.limitations.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      )}

      {showLinks && <ProjectLinks project={project} />}

      {updated && (
        <p className={styles.meta}>Aktualizacja: {updated}</p>
      )}
    </div>
  );
}

export function ProjectLinks({ project, extra }: { project: Project; extra?: ReactNode }) {
  return (
    <div className={styles.links}>
      {project.demoUrl && (
        <a
          className={styles.linkPrimary}
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Zobacz demo<span className="sr-only"> projektu {project.name} (nowa karta)</span> ↗
        </a>
      )}
      {project.repoUrl ? (
        <a
          className={styles.link}
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Repozytorium<span className="sr-only"> {project.name} na GitHubie (nowa karta)</span> ↗
        </a>
      ) : (
        <span className={styles.linkMuted}>Repozytorium prywatne</span>
      )}
      {extra}
    </div>
  );
}
