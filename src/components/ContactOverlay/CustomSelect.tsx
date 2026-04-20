'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './CustomSelect.module.scss';

type Props = {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
};

export function CustomSelect({ id, value, onChange, options, placeholder = 'Wybierz...' }: Props) {
  const [open, setOpen] = useState(false);
  const uid  = useId();
  const btnId = id ?? uid;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const displayed = value || placeholder;

  return (
    <div ref={rootRef} className={`${styles.root} ${open ? styles.rootOpen : ''}`}>
      <button
        id={btnId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${styles.trigger} ${!value ? styles.placeholder : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{displayed}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            className={styles.list}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((opt, i) => (
              <motion.li
                key={opt}
                role="option"
                aria-selected={opt === value}
                className={`${styles.option} ${opt === value ? styles.optionActive : ''}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                <span className={styles.optionDot} aria-hidden="true" />
                {opt}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
