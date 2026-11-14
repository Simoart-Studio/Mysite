'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/project';
import styles from './ProjectList.module.scss';

const loadDetail = () => import('@/components/ProjectDeck/ProjectDetail').then((mod) => mod.ProjectDetail);
const ProjectDetail = dynamic(loadDetail, { ssr: false });

/* Mozaika: siatka kawałków, z których składa się podgląd projektu */
const COLS = 5;
const ROWS = 4;
const ASSEMBLE_MS = 1500; // najpóźniejszy kawałek + jego lot; potem podmiana na pełny obraz

/** Deterministyczny „los” — ten sam układ kawałków na serwerze i w przeglądarce. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h ^= h >>> 13;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function Mosaic({ src, seed }: { src: string; seed: string }) {
  const rnd = seeded(seed);
  const pieces = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // kawałki nadlatują z zewnątrz, w kierunku od środka obrazu
      const fx = (c + 0.5) / COLS - 0.5;
      const fy = (r + 0.5) / ROWS - 0.5;
      const dist = Math.hypot(fx, fy);
      const vars = {
        '--c': c,
        '--r': r,
        '--x': `${(fx * 150 + (rnd() - 0.5) * 50).toFixed(1)}px`,
        '--y': `${(fy * 120 + (rnd() - 0.5) * 40).toFixed(1)}px`,
        '--rot': `${((rnd() - 0.5) * 50).toFixed(1)}deg`,
        '--d': `${(dist * 380 + rnd() * 260).toFixed(0)}ms`,
      } as React.CSSProperties;
      pieces.push(
        <span key={`${r}-${c}`} className={styles.piece} style={vars}>
          <span className={styles.pieceImg} style={{ backgroundImage: `url("${src}")` }} />
        </span>,
      );
    }
  }
  return <span className={styles.mosaic} aria-hidden="true">{pieces}</span>;
}

function Tile({ project, order, onOpen, tileRef, devices }: {
  project: Project;
  order: number;
  devices?: boolean;
  onOpen: (e: MouseEvent<HTMLAnchorElement>) => void;
  tileRef: (el: HTMLAnchorElement | null) => void;
}) {
  const mediaRef = useRef<HTMLSpanElement>(null);
  /* Mozaika (20 kawałków z tłem) montowana dopiero, gdy kafel zbliża się do ekranu — ~240 węzłów DOM mniej
     przy starcie strony. Przed złożeniem jest niewidoczna, po złożeniu ukryta, więc wizualnie nic się nie zmienia. */
  const [near, setNear] = useState(false);
  const src = project.thumbnail?.src;
  const phone = devices ? project.screenshots.find((s) => s.device === 'mobile')?.src : undefined;
  const stagger = order * 140; // kolejne kolumny składają się z lekkim opóźnieniem

  // Składanie mozaiki, gdy projekt wjeżdża na ekran (raz). Najpierw obraz musi być gotowy.
  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !src) return;
    const whole = () => el.classList.add(styles.whole!);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      whole();
      return;
    }
    let timer = 0;
    const pre = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      pre.disconnect();
      setNear(true);
    }, { rootMargin: '600px 0px' });
    pre.observe(el);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const img = new window.Image();
      img.src = src;
      const start = () => {
        el.classList.add(styles.assembling!);
        timer = window.setTimeout(whole, ASSEMBLE_MS + stagger);
      };
      img.decode().then(start, start);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { pre.disconnect(); io.disconnect(); clearTimeout(timer); };
  }, [src, stagger]);

  return (
    <Link
      ref={tileRef}
      href={`/works/${project.slug}`}
      className={styles.tile}
      onClick={onOpen}
      onPointerEnter={() => { void loadDetail(); }}
      onFocus={() => { void loadDetail(); }}
    >
      <span className={styles.frame} style={{ ['--td' as string]: `${stagger}ms` }}>
      <span ref={mediaRef} className={styles.media}>
        {src ? (
          <>
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px"
              className={styles.img}
              draggable={false}
            />
            {near && <Mosaic src={src} seed={project.slug} />}
          </>
        ) : (
          <span className={styles.empty}>{project.name}</span>
        )}

        {/* Po najechaniu: przyciemnienie i najważniejsze informacje */}
        <span className={styles.shade} aria-hidden="true" />
        <span className={styles.reveal} aria-hidden="true">
          <span className={styles.revealName}>{project.name}</span>
          {project.tagline && <span className={styles.revealWhat}>{project.tagline}</span>}
          <span className={styles.revealCta}>
            Zobacz szczegóły
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </span>
        </span>
      </span>

      {/* Mini telefon w rogu podglądu: jak projekt wygląda na komórce */}
      {phone && (
        <span className={styles.phone} aria-hidden="true">
          <span className={styles.phoneScreen}>
            <Image src={phone} alt="" fill unoptimized sizes="90px" className={styles.phoneImg} draggable={false} />
          </span>
          <i className={styles.island} />
        </span>
      )}
      </span>

      {/* nazwa dostępna = widoczny podpis (+ dopowiedzenie dla czytników) — zgodność etykiety z treścią (WCAG 2.5.3) */}
      <span className={styles.caption}>
        <span className={styles.name}>{project.name}</span>
        {project.kind && <span className={styles.kind}>{project.kind}</span>}
        <span className="sr-only">, zobacz szczegóły projektu</span>
      </span>
    </Link>
  );
}

/**
 * Lista projektów: spokojna siatka podglądów. Każdy podgląd składa się z rozbitej mozaiki,
 * po najechaniu przyciemnia się i pokazuje nazwę oraz to, czym jest projekt.
 * Kliknięcie otwiera szczegóły (bez JS — podstronę projektu).
 */
export function ProjectList({ projects, devices = false }: { projects: Project[]; devices?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tiles = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastOpened = useRef<number | null>(null);

  const open = useCallback((e: MouseEvent<HTMLAnchorElement>, i: number) => {
    // Ctrl/Cmd/Shift + klik zostawia przeglądarce (nowa karta z podstroną projektu).
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpenIdx(i);
  }, []);

  const close = useCallback((lastIdx: number) => {
    lastOpened.current = lastIdx;
    setOpenIdx(null);
  }, []);

  // Po zamknięciu szczegółów fokus wraca na kafel ostatnio oglądanego projektu.
  useEffect(() => {
    if (openIdx !== null || lastOpened.current === null) return;
    tiles.current[lastOpened.current]?.focus({ preventScroll: true });
    lastOpened.current = null;
  }, [openIdx]);

  return (
    <>
      <ul className={styles.list} aria-label="Projekty">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Tile
              project={p}
              order={i % 3}
              onOpen={(e) => open(e, i)}
              tileRef={(el) => { tiles.current[i] = el; }}
              devices={devices}
            />
          </li>
        ))}
      </ul>

      {openIdx !== null && <ProjectDetail projects={projects} index={openIdx} onClose={close} />}
    </>
  );
}
