'use client';

import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export function ScrollSkewProvider({ children }: Props) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 400, damping: 80 });
  const skew = useTransform(smoothVelocity, [-2500, 2500], reduced ? [0, 0] : [-2, 2]);

  return (
    <motion.div style={{ skewY: skew, willChange: 'transform' }}>
      {children}
    </motion.div>
  );
}
