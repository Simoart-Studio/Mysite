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

export function Thumb({ project, sizes = '340px' }: { project: Project; sizes?: string }) {
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
          loading="lazy"
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

export function CardFront({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
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
          <span className={styles.chips}>
            {project.stack.slice(0, 3).map((t) => (
              <span key={t} className={styles.chip}>{t}</span>
            ))}
          </span>
          <span className={styles.counter}>
            {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </span>
      </span>
    </span>
  );
}

export function CardBack({ remaining, total }: { remaining: number; total: number }) {
  return (
    <span className={styles.back}>
      <svg className={styles.backArt} viewBox="0 0 300 420" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <path d="M228,46C268,74,292,128,284,180C276,232,236,282,184,300C132,318,68,304,38,262C8,220,12,150,44,104C76,58,188,18,228,46Z" fill="rgb(255 255 255 / 0.10)" />
        <path d="M250,262C284,290,300,340,280,378C260,416,204,436,158,428C112,420,76,384,78,342C80,300,120,252,164,240C208,228,216,234,250,262Z" fill="rgb(255 255 255 / 0.08)" />
      </svg>
      <span className={styles.backTop}>
        <span>SimoArt</span>
        <span>{String(total - remaining + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      </span>
      <span className={styles.backTitle}>Projekty</span>
      <span className={styles.backMark} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </span>
  );
}
