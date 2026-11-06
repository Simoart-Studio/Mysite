'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useOverlay, type ContactPreset } from '@/context/OverlayContext';

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
    <Link
      href="/#contact"
      className={className}
      onClick={(e) => {
        if (!document.getElementById('contact')) return;
        e.preventDefault();
        openContact(preset);
      }}
    >
      {children}
    </Link>
  );
}
