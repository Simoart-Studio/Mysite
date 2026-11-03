'use client';

import {
  useCallback, useEffect, useId, useRef, useState,
  type KeyboardEvent, type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, type PanInfo, type Transition } from 'framer-motion';
import { ArrowRight, LayoutGrid, Layers, RotateCcw, Undo2 } from 'lucide-react';
import type { Project } from '@/types/project';
import { CardBack, CardFront } from './CardFaces';
import styles from './ProjectDeck.module.scss';

// Widok szczegółowy ładujemy dopiero na żądanie (code splitting)
const loadDetail = () => import('./ProjectDetail').then((m) => m.ProjectDetail);
const ProjectDetail = dynamic(loadDetail, { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;
const STACK_ROT = [0, -2.2, 1.6, -3, 2.4];
const PILE_ROT  = [0, 3.2, -2.6, 4.4];
const SWIPE_PX  = 80;
const SWIPE_VEL = 450;

type Move = { idx: number; dir: 'out' | 'back' } | null;
type Pose = { x: string; y: number; rotate: number; scale: number; z: number; faceUp: boolean };

export function ProjectDeck({ projects, grid }: { projects: Project[]; grid: ReactNode }) {
  const reduced = !!useReducedMotion();
  const n = projects.length;
  const uid = useId();

  const [revealed, setRevealed]   = useState(0);       // ile kart leży w „odkrytej” kupce
  const [move, setMove]           = useState<Move>(null);
  const [resetting, setResetting] = useState(false);
  const [openIdx, setOpenIdx]     = useState<number | null>(null);
  const [wide, setWide]           = useState(false);
  const [listMode, setListMode]   = useState(false);
  const [announce, setAnnounce]   = useState('');

  const rootRef      = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'stack' | 'pile' | null>(null);
  const dragged      = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Fokus po akcji z klawiatury: wierzch stosu albo wierzch kupki
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    focusTop(target === 'stack' && revealed < n ? 'stack' : 'pile');
  }, [revealed, n]);

  const focusTop = (which: 'stack' | 'pile') => {
    rootRef.current
      ?.querySelector<HTMLButtonElement>(`[data-top="${which}"]`)
      ?.focus({ preventScroll: true });
  };

  const focusInside = () => !!rootRef.current?.contains(document.activeElement);

  const reveal = useCallback(() => {
    if (revealed >= n) return;
    if (focusInside()) pendingFocus.current = revealed + 1 < n ? 'stack' : 'pile';
    const p = projects[revealed]!;
    setMove({ idx: revealed, dir: 'out' });
    setResetting(false);
    setRevealed(revealed + 1);
    setAnnounce(`Odsłonięto: ${p.name}. Karta ${revealed + 1} z ${n}.`);
  }, [revealed, n, projects]);

  const undo = useCallback(() => {
    if (revealed <= 0) return;
    if (focusInside()) pendingFocus.current = 'stack';
    setMove({ idx: revealed - 1, dir: 'back' });
    setResetting(false);
    setRevealed(revealed - 1);
    setAnnounce(`Karta ${projects[revealed - 1]!.name} wróciła na stos.`);
  }, [revealed, projects]);

  const reset = useCallback(() => {
    if (revealed === 0) return;
    if (focusInside()) pendingFocus.current = 'stack';
    setMove(null);
    setResetting(true);
    setRevealed(0);
    setAnnounce('Talia przetasowana. Wszystkie karty wróciły na stos.');
  }, [revealed]);

  const open = useCallback((idx: number) => {
    setOpenIdx(idx);
  }, []);

  const closeDetail = useCallback((lastIdx: number) => {
    setOpenIdx(null);
    // Jeśli w szczegółach przeszliśmy dalej niż kupka — dołóż karty
    setRevealed((r) => Math.max(r, lastIdx + 1));
    returnFocus.current = true;
  }, []);

  // Po zamknięciu szczegółów oddaj fokus odkrytej karcie (otwierającej)
  const returnFocus = useRef(false);
  useEffect(() => {
    if (openIdx === null && returnFocus.current) {
      returnFocus.current = false;
      focusTop('pile');
    }
  }, [openIdx, revealed]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (openIdx !== null) return;
    if ((e.target as HTMLElement).closest('[data-deck-controls]')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); reveal(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); undo(); }
  }

  function pose(i: number): Pose {
    if (i >= revealed) {
      const d = Math.min(i - revealed, STACK_ROT.length - 1);
      const behind = !wide && revealed > 0;
      return {
        x: wide && revealed > 0 ? '-54%' : '0%',
        y: d * 6 + (behind ? -22 : 0),
        rotate: STACK_ROT[d]!,
        scale: behind ? 0.94 : 1,
        z: 100 - (i - revealed),
        faceUp: false,
      };
    }
    const j = Math.min(revealed - 1 - i, PILE_ROT.length - 1);
    return {
      x: wide ? '54%' : '0%',
      y: j * 4,
      rotate: PILE_ROT[j]!,
      scale: 1 - j * 0.015,
      z: 300 - (revealed - 1 - i),
      faceUp: true,
    };
  }

  function onDragEnd(where: 'stack' | 'pile', info: PanInfo) {
    const dx = info.offset.x;
    const fast = Math.abs(info.velocity.x) > SWIPE_VEL;
    if (Math.abs(dx) < SWIPE_PX && !fast) return;
    if (where === 'stack') reveal();
    else if (dx < 0) reveal();
    else undo();
  }

  const stackX = wide && revealed > 0 ? '-54%' : '0%';

  return (
    <div
      ref={rootRef}
      className={styles.deckRoot}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="talia kart"
      aria-label="Talia projektów"
      aria-describedby={`${uid}-help`}
    >
      <p id={`${uid}-help`} className="sr-only">
        Enter lub Spacja odsłania kartę ze stosu albo otwiera odkrytą kartę.
        Strzałka w prawo odsłania kolejną kartę, strzałka w lewo cofa ostatnią.
        Escape zamyka widok szczegółowy.
      </p>
      <p className="sr-only" aria-live="polite">{announce}</p>

      {listMode ? (
        <div className={styles.listWrap}>{grid}</div>
      ) : (
        <div className={styles.stage}>
          {/* Puste miejsce po stosie */}
          <motion.div
            className={styles.slot}
            aria-hidden={revealed < n}
            animate={{ x: stackX, opacity: revealed >= n ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
          >
            <span>To już wszystkie.</span>
            <button
              type="button"
              className={styles.slotBtn}
              onClick={reset}
              tabIndex={revealed >= n ? 0 : -1}
              aria-label="Przetasuj od nowa"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          </motion.div>

          {projects.map((p, i) => {
            const ps = pose(i);
            const isStackTop = i === revealed;
            const isPileTop  = i === revealed - 1;
            const interactive = isStackTop || isPileTop;
            const moving = move?.idx === i;

            const base: Transition = reduced
              ? { duration: 0 }
              : { duration: 0.6, ease: EASE, delay: resetting ? (n - i) * 0.045 : 0 };

            const animate = moving && !reduced
              ? {
                  x: ps.x,
                  y: [null, -84, ps.y],
                  rotate: [null, move!.dir === 'out' ? -12 : 10, ps.rotate],
                  scale: [null, 1.06, ps.scale],
                  zIndex: 500,
                }
              : moving && reduced
                // Ruch ograniczony: bez odklejania, tylko łagodne pojawienie się
                ? { x: ps.x, y: ps.y, rotate: ps.rotate, scale: ps.scale, zIndex: ps.z, opacity: [0, 1] }
                : { x: ps.x, y: ps.y, rotate: ps.rotate, scale: ps.scale, zIndex: ps.z, opacity: 1 };

            const transition: Transition = moving && !reduced
              ? { duration: 0.78, ease: EASE, times: [0, 0.38, 1], zIndex: { duration: 0 } }
              : moving && reduced
                ? { duration: 0, opacity: { duration: 0.3, ease: 'easeOut' } }
                : { ...base, zIndex: { duration: 0, delay: reduced ? 0 : resetting ? 0.4 : 0.3 } };

            // Treść awersu renderujemy tylko dla kart odkrytych i wierzchu stosu
            const showFront = i <= revealed;

            const inner = (
              <motion.span
                className={styles.flipper}
                initial={false}
                animate={{ rotateY: ps.faceUp ? 0 : 180 }}
                transition={reduced ? { duration: 0 } : { duration: moving ? 0.78 : 0.6, ease: EASE }}
              >
                <span className={styles.faceFront}>
                  {showFront && <CardFront project={p} index={i} total={n} />}
                </span>
                <span className={styles.faceBack}>
                  <CardBack remaining={n - i} total={n} />
                </span>
              </motion.span>
            );

            return (
              <motion.div
                key={p.slug}
                className={styles.card}
                initial={false}
                animate={animate}
                transition={transition}
                onAnimationComplete={() => { if (moving) setMove(null); }}
                aria-hidden={!interactive}
              >
                {interactive ? (
                  <motion.button
                    data-top={isStackTop ? 'stack' : 'pile'}
                    type="button"
                    className={styles.cardBtn}
                    drag="x"
                    dragSnapToOrigin
                    dragElastic={0.5}
                    dragMomentum={false}
                    whileHover={reduced ? undefined : { y: -6 }}
                    whileTap={reduced ? undefined : { scale: 0.985 }}
                    onDragStart={() => { dragged.current = true; }}
                    onDragEnd={(_, info) => onDragEnd(isStackTop ? 'stack' : 'pile', info)}
                    onClick={() => {
                      if (dragged.current) { dragged.current = false; return; }
                      if (isStackTop) reveal();
                      else open(i);
                    }}
                    onPointerEnter={isPileTop ? () => { void loadDetail(); } : undefined}
                    onFocus={isPileTop ? () => { void loadDetail(); } : undefined}
                    aria-haspopup={isPileTop ? 'dialog' : undefined}
                  >
                    {/* Nazwa dostępna z tekstu (zamiast aria-label), treść graficzna ukryta przed czytnikiem */}
                    <span className="sr-only">
                      {isStackTop
                        ? `Moje projekty. Odsłoń kartę ${i + 1} z ${n}`
                        : `${p.name}${p.tagline ? `: ${p.tagline}` : ''} — otwórz szczegóły projektu`}
                    </span>
                    <span aria-hidden="true" className={isStackTop ? styles.invite : styles.innerWrap}>{inner}</span>
                  </motion.button>
                ) : (
                  <span className={styles.cardBtn} inert>{inner}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className={styles.controls} data-deck-controls>
        <button
          type="button"
          className={styles.ctrl}
          onClick={undo}
          disabled={revealed === 0 || listMode}
          aria-label="Cofnij kartę"
          title="Cofnij"
        >
          <Undo2 size={18} aria-hidden="true" />
        </button>

        <div className={styles.progress} aria-hidden="true">
          {projects.map((p, i) => (
            <span key={p.slug} className={i < revealed ? `${styles.pip} ${styles.pipOn}` : styles.pip} />
          ))}
        </div>

        <button
          type="button"
          className={`${styles.ctrl} ${styles.ctrlPrimary}`}
          onClick={reveal}
          disabled={revealed >= n || listMode}
          aria-label="Odsłoń następną kartę"
          title="Następna"
        >
          <ArrowRight size={20} aria-hidden="true" />
        </button>

        <span className={styles.ctrlSep} aria-hidden="true" />

        <button
          type="button"
          className={styles.ctrl}
          onClick={reset}
          disabled={revealed === 0 || listMode}
          aria-label="Przetasuj od nowa"
          title="Przetasuj"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.ctrl}
          onClick={() => setListMode((v) => !v)}
          aria-pressed={listMode}
          aria-label={listMode ? 'Wróć do talii' : 'Widok listy'}
          title={listMode ? 'Talia' : 'Lista'}
        >
          {listMode ? <Layers size={18} aria-hidden="true" /> : <LayoutGrid size={18} aria-hidden="true" />}
        </button>
      </div>

      {openIdx !== null && (
        <ProjectDetail
          projects={projects}
          index={openIdx}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
