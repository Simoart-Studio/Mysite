import { ImageResponse } from 'next/og';
import { BRAND } from '@/data/config';

export const OG_SIZE = { width: 1200, height: 630 };

export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#080808',
          color: '#F2EDE6',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9B99A' }}>
          <span>{BRAND}</span>
          <span>{eyebrow}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: title.length > 28 ? 72 : 96, lineHeight: 1.04, letterSpacing: '-0.03em' }}>{title}</div>
          <div style={{ width: 160, height: 3, background: '#C9B99A' }} />
          <div style={{ fontSize: 32, color: '#9A9590', maxWidth: 940, lineHeight: 1.35 }}>{subtitle}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
