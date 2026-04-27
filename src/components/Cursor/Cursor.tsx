'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import styles from './Cursor.module.scss';

export function Cursor() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 2200, damping: 80, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 2200, damping: 80, mass: 0.1 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setActive(el.closest('a, button, [role="button"], label') !== null);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [rawX, rawY, visible]);

  if (!mounted || prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={styles.cursor}
      style={{ x, y }}
      animate={{
        scale: active ? 2.5 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{ scale: { duration: 0.12, ease: [0.22, 1, 0.36, 1] } }}
    />
  );
}
