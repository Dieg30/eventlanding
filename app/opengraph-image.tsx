import { ImageResponse } from 'next/og';

export const runtime     = 'edge';
export const alt         = 'UP · Entradas para eventos en Ecuador';
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ background: '#0A0A0A', width: '32px', height: '14px', borderRadius: '2px' }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', letterSpacing: '0.3em' }}>
            UP · UNIPOLI LA FIESTA
          </span>
        </div>

        <div style={{
          color: 'white',
          fontSize: '96px',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          ENTRADAS
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '28px',
          letterSpacing: '0.05em',
        }}>
          LOS MEJORES EVENTOS DE ECUADOR
        </div>
      </div>
    ),
    { ...size },
  );
}
