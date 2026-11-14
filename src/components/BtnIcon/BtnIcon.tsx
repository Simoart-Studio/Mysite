import { ArrowUpRight, ArrowDown, ArrowRight } from 'lucide-react';

export function BtnIcon({ dir = 'up-right' }: { dir?: 'up-right' | 'down' | 'right' }) {
  const Icon = dir === 'down' ? ArrowDown : dir === 'right' ? ArrowRight : ArrowUpRight;
  return (
    <span className="btn__icon" aria-hidden="true">
      <Icon strokeWidth={2} />
    </span>
  );
}
