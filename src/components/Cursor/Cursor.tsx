'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import styles from './Cursor.module.scss';

const E = [0.22, 1, 0.36, 1] as const;

export function Cursor() {
  const prefersReduced = useReducedMotion();
  const [mounted,  setMounted]  = useState(false);
  const [active,   setActive]   = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [hideDot,  setHideDot]  = useState(false);
  const visibleRef = useRef(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setActive(el.closest('a, button, [role="button"], label') !== null);
      setHideDot(el.closest('[data-hide-cursor]') !== null);
    };

    const onLeave = () => { visibleRef.current = false; setVisible(false); };
    const onEnter = () => { visibleRef.current = true;  setVisible(true);  };

    window.addEventListener('mousemove', onMove,   { passive: true });
    window.addEventListener('mouseover', onOver,   { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [rawX, rawY]);

  if (!mounted || prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={styles.dot}
      style={{ x: rawX, y: rawY }}
      animate={{
        scale:   active ? 2.2 : 1,
        opacity: visible && !hideDot ? 1 : 0,
      }}
      transition={{
        scale:   { duration: 0.15, ease: E },
        opacity: { duration: 0.12 },
      }}
    />
  );
}
