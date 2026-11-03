'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * useReducedMotion bez błędu hydratacji: na serwerze i w pierwszym renderze
 * klienta zwraca false, prawdziwą preferencję — dopiero po zamontowaniu.
 * Używaj tam, gdzie wartość zmienia treść DOM (nie tylko animacje).
 */
export function useReducedMotionSafe() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!reduced : false;
}
