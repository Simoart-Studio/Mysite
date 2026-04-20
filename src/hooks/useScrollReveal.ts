'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  margin = '-80px'
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, {
    once: false,
    margin: margin as `${number}px`,
  });

  return { ref, isInView } as const;
}
