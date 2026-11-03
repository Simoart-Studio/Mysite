'use client';

import {
  useCallback, useEffect, useId, useRef, useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Project, ProjectImage } from '@/types/project';
import { TODO } from '@/lib/projects';
import { lockScroll } from '@/lib/scrollLock';
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import { CaseStudyBody, ProjectLinks } from './CaseStudyBody';
import styles from './ProjectDetail.module.scss';

const EASE = [0.22, 1, 0.36, 1] as const;
const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

type Tab = 'opis' | 'wyglad';

function trapTab(e: ReactKeyboardEvent<HTMLElement>, root: HTMLElement | null) {
  if (e.key !== 'Tab' || !root) return;
  const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
    .filter((el) => !el.closest('[inert]') && el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0]!;
  const last  = items[items.length - 1]!;
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function ProjectDetail({
  projects,
  index: initialIndex,
  onClose,
}: {
  projects: Project[];
  index: number;
  onClose: (lastIndex: number) => void;
}) {
  const reduced = !!useReducedMotion();
  const uid = useId();
  const [index, setIndex] = useState(initialIndex);
  const [tab, setTab] = useState<Tab>('opis');
  const [visible, setVisible] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ opis: null, wyglad: null });

  const project = projects[index]!;
  const n = projects.length;

  useEffect(() => lockScroll(), []);

  // Fokus do otwartej karty (nagłówek)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [index]);

  const requestClose = useCallback(() => setVisible(false), []);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + n) % n);
    setTab('opis');
    setPreview(false);
    setLightbox(null);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [n]);

  useEffect(() => {
    if (lightbox !== null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, requestClose]);

  function onTabKey(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next: Tab = tab === 'opis' ? 'wyglad' : 'opis';
    const target = e.key === 'Home' ? 'opis' : e.key === 'End' ? 'wyglad' : next;
    setTab(target);
    tabRefs.current[target]?.focus();
  }

  const shots = project.screenshots;

  return createPortal(
    <AnimatePresence onExitComplete={() => onClose(index)}>
      {visible && (
        <motion.div
          key="detail"
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.3 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) requestClose(); }}
        >
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            inert={lightbox !== null}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -14, scale: 0.94, y: 24 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, rotateY: 0, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotateY: 10, scale: 0.96, y: 16 }}
            transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE }}
            onKeyDown={(e) => trapTab(e, panelRef.current)}
          >
            <header className={styles.head}>
              <div className={styles.headMeta}>
                <span className={styles.status}>{project.status}</span>
                {project.labels.map((l) => <span key={l} className={styles.tag}>{l}</span>)}
                <span className={styles.count}>
                  {index + 1}/{n}
                </span>
              </div>
              <div className={styles.headActions}>
                <button type="button" className={styles.navBtn} onClick={() => go(-1)} aria-label="Poprzedni projekt" title="Poprzedni">
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" className={styles.navBtn} onClick={() => go(1)} aria-label="Następny projekt" title="Następny">
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <button type="button" className={styles.closeBtn} onClick={requestClose} aria-label="Zamknij" title="Zamknij">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className={styles.scroll} data-lenis-prevent>
              <div className={styles.intro}>
                <h2 id={`${uid}-title`} ref={titleRef} tabIndex={-1} className={styles.title}>
                  {project.name}
                </h2>
                <p className={project.tagline ? styles.tagline : `${styles.tagline} ${styles.todo}`}>
                  {project.tagline ?? `Opis problemu: ${TODO.toLowerCase()}`}
                </p>
              </div>

              <div role="tablist" aria-label="Widok projektu" className={styles.tabs}>
                {(['opis', 'wyglad'] as const).map((t) => (
                  <button
                    key={t}
                    ref={(el) => { tabRefs.current[t] = el; }}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${t}`}
                    aria-selected={tab === t}
                    aria-controls={`${uid}-panel-${t}`}
                    tabIndex={tab === t ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setTab(t)}
                    onKeyDown={onTabKey}
                  >
                    {t === 'opis' ? 'Opis' : 'Wygląd'}
                    {tab === t && !reduced && (
                      <motion.span layoutId={`${uid}-ink`} className={styles.tabInk} />
                    )}
                    {tab === t && reduced && <span className={styles.tabInk} />}
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id={`${uid}-panel-opis`}
                aria-labelledby={`${uid}-tab-opis`}
                hidden={tab !== 'opis'}
                className={styles.tabPanel}
              >
                <CaseStudyBody project={project} heading="h3" showLinks={false} />
                <div className={styles.linksRow}>
                  <ProjectLinks
                    project={project}
                    extra={
                      <Link href={`/works/${project.slug}`} className={styles.moreLink}>
                        Pełny opis →
                      </Link>
                    }
                  />
                </div>
              </div>

              <div
                role="tabpanel"
                id={`${uid}-panel-wyglad`}
                aria-labelledby={`${uid}-tab-wyglad`}
                hidden={tab !== 'wyglad'}
                className={styles.tabPanel}
              >
                {shots.length > 0 ? (
                  <ul className={styles.gallery} aria-label="Zrzuty ekranu">
                    {shots.map((s, i) => (
                      <li key={s.src} className={s.device === 'mobile' ? styles.shotMobile : styles.shotDesktop}>
                        <button
                          type="button"
                          ref={(el) => { thumbRefs.current[i] = el; }}
                          className={styles.shotBtn}
                          onClick={() => setLightbox(i)}
                          aria-label={`Powiększ: ${s.alt ?? `zrzut ${i + 1}`}`}
                        >
                          <Image
                            src={s.src}
                            alt={s.alt ?? ''}
                            width={s.width}
                            height={s.height}
                            sizes={s.device === 'mobile' ? '200px' : '(max-width: 768px) 90vw, 560px'}
                            className={styles.shotImg}
                          />
                          <span className={styles.shotDevice}>{s.device === 'mobile' ? 'Telefon' : 'Komputer'}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.placeholder}>
                    <span className={styles.todo}>Zrzuty ekranu: {TODO.toLowerCase()}</span>
                  </div>
                )}

                {project.demoUrl && project.embed && (
                  <div className={styles.preview}>
                    <div className={styles.previewHead}>
                      <p className={styles.previewLabel}>Na żywo</p>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.previewExt}>
                        {new URL(project.demoUrl).host} ↗
                      </a>
                    </div>
                    {preview ? (
                      <iframe
                        src={project.demoUrl}
                        title={`Podgląd na żywo: ${project.name}`}
                        className={styles.iframe}
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={styles.previewIdle}>
                        <button
                          type="button"
                          className={styles.previewBtn}
                          onClick={() => setPreview(true)}
                          aria-label={`Uruchom podgląd na żywo: ${project.name}`}
                        >
                          <Play size={26} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {lightbox !== null && shots[lightbox] && (
              <Lightbox
                key="lb"
                shots={shots}
                index={lightbox}
                onIndex={setLightbox}
                onClose={() => {
                  const i = lightbox;
                  setLightbox(null);
                  requestAnimationFrame(() => thumbRefs.current[i]?.focus());
                }}
                reduced={reduced}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Lightbox({
  shots, index, onIndex, onClose, reduced,
}: {
  shots: ProjectImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  reduced: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const shot = shots[index]!;
  const many = shots.length > 1;

  useEffect(() => { closeRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
      if (many && e.key === 'ArrowRight') onIndex((index + 1) % shots.length);
      if (many && e.key === 'ArrowLeft')  onIndex((index - 1 + shots.length) % shots.length);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [index, many, onClose, onIndex, shots.length]);

  return (
    <motion.div
      ref={rootRef}
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`Powiększenie: ${shot.alt ?? 'zrzut ekranu'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.1 : 0.25 }}
      onKeyDown={(e) => trapTab(e, rootRef.current)}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <figure className={styles.lbFigure}>
        <Image
          src={shot.src}
          alt={shot.alt ?? ''}
          width={shot.width}
          height={shot.height}
          sizes="100vw"
          className={styles.lbImg}
          style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
        />
        {shot.alt && <figcaption className={styles.lbCaption}>{shot.alt} · {index + 1} / {shots.length}</figcaption>}
      </figure>
      <div className={styles.lbControls}>
        {many && (
          <button type="button" className={styles.lbBtn} onClick={() => onIndex((index - 1 + shots.length) % shots.length)} aria-label="Poprzedni zrzut">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        )}
        <button ref={closeRef} type="button" className={styles.lbBtn} onClick={onClose} aria-label="Zamknij powiększenie">
          <X size={20} aria-hidden="true" />
        </button>
        {many && (
          <button type="button" className={styles.lbBtn} onClick={() => onIndex((index + 1) % shots.length)} aria-label="Następny zrzut">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
