'use client';

import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

const noopSubscribe = () => () => {};

export function useReducedMotionSafe() {
  const reduced = useReducedMotion();
  // false przy SSR i hydratacji, true po zamontowaniu — bez setState w efekcie.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return mounted ? !!reduced : false;
}
