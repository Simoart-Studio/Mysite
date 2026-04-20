'use client';

import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text: string, active: boolean, speed = 22, once = true) {
  const [displayed, setDisplayed] = useState('');
  const doneRef  = useRef(false);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (frameRef.current) { clearTimeout(frameRef.current); frameRef.current = null; }

    if (!active) {
      if (!once) { setDisplayed(''); indexRef.current = 0; }
      return;
    }

    if (once && doneRef.current) return;

    function tick() {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        frameRef.current = setTimeout(tick, speed);
      } else {
        doneRef.current = true;
      }
    }
    frameRef.current = setTimeout(tick, speed);
    return () => { if (frameRef.current) { clearTimeout(frameRef.current); frameRef.current = null; } };
  }, [active, once, text, speed]);

  return displayed;
}
