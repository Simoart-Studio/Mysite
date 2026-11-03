'use client';

import type { ReactNode } from 'react';
import { useOverlay, type ContactPreset } from '@/context/OverlayContext';

/**
 * Link do formularza kontaktowego. Z JS przewija do formularza i ustawia cel,
 * bez JS (lub z podstrony) przechodzi do /#contact.
 */
export function ContactTrigger({
  children,
  className,
  preset,
}: {
  children: ReactNode;
  className?: string;
  preset?: Omit<ContactPreset, 'nonce'>;
}) {
  const { openContact } = useOverlay();
  return (
    <a
      href="/#contact"
      className={className}
      onClick={(e) => {
        if (!document.getElementById('contact')) return;
        e.preventDefault();
        openContact(preset);
      }}
    >
      {children}
    </a>
  );
}
