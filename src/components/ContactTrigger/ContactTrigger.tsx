'use client';

import type { ReactNode } from 'react';
import { useOverlay, type ContactPreset } from '@/context/OverlayContext';

/**
 * Link do formularza kontaktowego. Z JS otwiera nakładkę z formularzem
 * (opcjonalnie z wybranym celem), bez JS przewija do sekcji kontaktu.
 */
export function ContactTrigger({
  children,
  className,
  preset,
}: {
  children: ReactNode;
  className?: string;
  preset?: ContactPreset;
}) {
  const { openContact } = useOverlay();
  return (
    <a
      href="#contact"
      className={className}
      aria-haspopup="dialog"
      onClick={(e) => {
        e.preventDefault();
        openContact(preset);
      }}
    >
      {children}
    </a>
  );
}
