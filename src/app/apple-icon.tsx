import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Ikona ekranu głównego iOS w barwach marki (generowana statycznie przy buildzie).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E1D15' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 108, fontWeight: 700, color: '#FFFFFF', letterSpacing: -6, lineHeight: 1 }}>
          S
          <div style={{ width: 26, height: 26, borderRadius: 13, background: '#A8EE6A', marginLeft: 6, marginBottom: 14 }} />
        </div>
      </div>
    ),
    size,
  );
}
