'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SmokeReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(28px)', y: 24, scale: 1.05 }}
      animate={
        isInView
          ? { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }
          : { opacity: 0, filter: 'blur(28px)', y: 24, scale: 1.05 }
      }
      transition={{ duration: 1.2, ease: EASE, delay }}
      style={{ willChange: 'filter, transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
