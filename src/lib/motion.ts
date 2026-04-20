'use client';

import type { Transition, TargetAndTransition } from 'framer-motion';

export const EASE       = [0.22, 1, 0.36, 1]   as [number, number, number, number];
export const EASE_WAVE  = [0.76, 0, 0.24, 1]   as [number, number, number, number];

export const TRANSITION_BASE: Transition = { duration: 0.95, ease: EASE };
export const TRANSITION_FAST: Transition = { duration: 0.5,  ease: EASE };
export const TRANSITION_WAVE: Transition = { duration: 1.0,  ease: EASE_WAVE };

type RevealProps = {
  initial:    TargetAndTransition | boolean;
  animate:    TargetAndTransition;
  transition: Transition;
};

type From = { x?: number; y?: number };

function make(
  isInView:       boolean,
  prefersReduced: boolean | null,
  from:           From,
  delay:          number,
  trans:          Transition
): RevealProps {
  if (prefersReduced) return { initial: false, animate: {}, transition: {} };
  const hidden = { ...from, opacity: 0 };
  return {
    initial:    hidden,
    animate:    isInView ? { x: 0, y: 0, opacity: 1 } : hidden,
    transition: { ...trans, delay },
  };
}

export const revealProps = (
  v: boolean, r: boolean | null, delay = 0
) => make(v, r, { y: 45 }, delay, TRANSITION_BASE);

export const fromLeftProps = (
  v: boolean, r: boolean | null, delay = 0
) => make(v, r, { x: -70 }, delay, TRANSITION_WAVE);

export const fromRightProps = (
  v: boolean, r: boolean | null, delay = 0
) => make(v, r, { x: 70 }, delay, TRANSITION_WAVE);

export const fromTopProps = (
  v: boolean, r: boolean | null, delay = 0
) => make(v, r, { y: -60 }, delay, TRANSITION_WAVE);

export const fromBottomProps = (
  v: boolean, r: boolean | null, delay = 0
) => make(v, r, { y: 70 }, delay, TRANSITION_WAVE);

export const diagonalProps = (
  v: boolean, r: boolean | null, xDir: 1 | -1, delay = 0
) => make(v, r, { x: xDir * 55, y: 55 }, delay, TRANSITION_WAVE);

export function fadeProps(
  isInView:       boolean,
  prefersReduced: boolean | null,
  delay = 0
): RevealProps {
  if (prefersReduced) return { initial: false, animate: {}, transition: {} };
  return {
    initial:    { opacity: 0 },
    animate:    isInView ? { opacity: 1 } : { opacity: 0 },
    transition: { ...TRANSITION_FAST, delay },
  };
}
