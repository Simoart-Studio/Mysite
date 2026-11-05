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
          draggable={false}
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
          <span className={styles.chips}>
            {project.stack.slice(0, 3).map((t) => (
              <span key={t} className={styles.chip}>{t}</span>
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}

const SCRAPS = [
  { src: '/projects/collage/travelpoint.webp', w: 440, h: 330, cls: 'scrapA' },
  { src: '/projects/collage/barberspace.webp', w: 440, h: 330, cls: 'scrapB' },
  { src: '/projects/collage/buds.webp',        w: 440, h: 330, cls: 'scrapC' },
  { src: '/projects/collage/pawflo.webp',      w: 440, h: 330, cls: 'scrapD' },
  { src: '/projects/collage/fancyshop.webp',   w: 440, h: 330, cls: 'scrapE' },
  { src: '/projects/collage/taskiner.webp',    w: 220, h: 275, cls: 'scrapF' },
] as const;

/** Rewers talii: kolaż wycinków z realizacji przyklejonych taśmą. */
export function CardBack({ art = true }: { art?: boolean }) {
  return (
    <span className={styles.back}>
      {art && <span className={styles.collage} aria-hidden="true">
        {SCRAPS.map((sc) => (
          <span key={sc.src} className={`${styles.scrap} ${styles[sc.cls]}`}>
            <Image src={sc.src} alt="" width={sc.w} height={sc.h} sizes="180px" className={styles.scrapImg} loading="lazy" draggable={false} />
          </span>
        ))}
        <span className={`${styles.tape} ${styles.tapeA}`} />
        <span className={`${styles.tape} ${styles.tapeB}`} />
        <span className={`${styles.tape} ${styles.tapeC}`} />
      </span>}
      <span className={styles.backLabel}>
        <span className={styles.backTitle}>Projekty</span>
      </span>
      <span className={styles.backMark} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </span>
  );
}
