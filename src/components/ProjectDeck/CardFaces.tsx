import Image from 'next/image';
import type { Project } from '@/types/project';
import { TODO } from '@/lib/projects';
import styles from './ProjectDeck.module.scss';

const STATUS_CLASS: Record<Project['status'], string> = {
  'Wdrożony':  styles.statusLive  ?? '',
  'W rozwoju': styles.statusDev   ?? '',
  'Prototyp':  styles.statusProto ?? '',
};

function initials(name: string) {
  return name.replace(/[^A-Za-zÀ-ž0-9 ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

/** `eager` — dla kafli widocznych od razu (pierwszy rząd), żeby nie opóźniać LCP. */
export function Thumb({ project, sizes = '340px', eager = false }: { project: Project; sizes?: string; eager?: boolean }) {
  if (project.thumbnail) {
    return (
      <span className={styles.thumb}>
        <Image
          src={project.thumbnail.src}
          alt=""
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          sizes={sizes}
          className={styles.thumbImg}
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
        />
      </span>
    );
  }
  return (
    <span className={`${styles.thumb} ${styles.thumbEmpty}`}>
      <span className={styles.thumbInitials} aria-hidden="true">{initials(project.name)}</span>
      <span className={styles.thumbNote}>Zrzut ekranu: {TODO.toLowerCase()}</span>
    </span>
  );
}

export function CardFront({ project }: { project: Project }) {
  return (
    <span className={styles.front}>
      <Thumb project={project} />
      <span className={styles.frontBody}>
        <span className={styles.metaRow}>
          <span className={`${styles.status} ${STATUS_CLASS[project.status]}`}>
            <span className={styles.statusDot} aria-hidden="true" />
            {project.status}
          </span>
          {project.labels.map((l) => (
            <span key={l} className={styles.tag}>{l}</span>
          ))}
        </span>
        <span className={styles.name}>{project.name}</span>
        <span className={project.tagline ? styles.tagline : `${styles.tagline} ${styles.taglineTodo}`}>
          {project.tagline ?? `Opis: ${TODO.toLowerCase()}`}
        </span>
        <span className={styles.frontFoot}>
          {project.kind && (
            <span className={styles.chips}>
              <span className={styles.chip}>{project.kind}</span>
            </span>
          )}
        </span>
      </span>
    </span>
  );
}
