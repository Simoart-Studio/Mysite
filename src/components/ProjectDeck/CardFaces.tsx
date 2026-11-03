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

/** Awers karty. Same <span>, bo treść siedzi wewnątrz <button>. */
export function CardFront({
  project,
  index,
  total,
  hint = 'Kliknij, aby otworzyć',
}: {
  project: Project;
  index: number;
  total: number;
  hint?: string | null;
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
          {project.tagline ?? `Opis problemu: ${TODO.toLowerCase()}`}
        </span>
        <span className={styles.chips}>
          {project.stack.map((t) => (
            <span key={t} className={styles.chip}>{t}</span>
          ))}
        </span>
        <span className={styles.frontFoot}>
          {hint && <span className={styles.hint}>{hint}</span>}
          <span className={styles.counter}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </span>
      </span>
    </span>
  );
}

/** Rewers: karta tytułowa talii. */
export function CardBack({ remaining, total }: { remaining: number; total: number }) {
  return (
    <span className={styles.back}>
      <span className={styles.backTop}>
        <span>SimoArt studio</span>
        <span>{String(total - remaining + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </span>
      <span className={styles.backTitle}>
        Moje projekty.
        <em>Odsłoń kartę.</em>
      </span>
      <span className={styles.backHint}>
        <span className={styles.backHintIcon} aria-hidden="true">↗</span>
        Kliknij, aby odsłonić
        <span className={styles.backHintSwipe}> · lub przesuń w bok</span>
      </span>
    </span>
  );
}
