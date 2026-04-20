import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Szymon Pochopień — Frontend Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0A0A0B',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: '#52525B',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            fontFamily: 'monospace',
          }}
        >
          FRONTEND DEVELOPER — POLSKA
        </div>

        <div
          style={{
            fontSize: '96px',
            fontWeight: 400,
            color: '#FAFAFA',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '8px',
          }}
        >
          Szymon Pochopień
        </div>

        <div
          style={{
            width: '200px',
            height: '3px',
            background: '#FF4D1A',
            marginBottom: '32px',
            borderRadius: '2px',
          }}
        />

        <div
          style={{
            fontSize: '28px',
            color: '#A1A1AA',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontWeight: 400,
          }}
        >
          React · TypeScript · Next.js
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
