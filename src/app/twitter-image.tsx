import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Decidere — Decide Where to Live'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const countryCount = 27
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://decidere.app'
  const logoUrl = `${siteUrl}/logo.jpg`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#030712',
          backgroundImage: 'radial-gradient(circle at 20% 50%, #042f2e 0%, #030712 100%)',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        {/* Left Side: Branding (1/3) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '35%',
            height: '100%',
            padding: '60px',
            justifyContent: 'center',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '32px',
              border: '1px solid rgba(45, 212, 191, 0.3)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" width="100" height="100" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Decidere
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#94a3b8', lineHeight: '1.4', fontWeight: '500' }}>
            Decide where to live, starting with financial clarity.
          </div>
          <div style={{ display: 'flex', marginTop: 'auto', fontSize: '20px', color: '#475569', fontWeight: '600' }}>
            decidere.app
          </div>
        </div>

        {/* Right Side: Bento Features (2/3) */}
        <div
          style={{
            display: 'flex',
            width: '65%',
            height: '100%',
            padding: '40px',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', width: '100%', gap: '20px', height: '50%' }}>
            {/* Main Feature: Countries */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '2',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '32px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', color: '#2dd4bf', fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>{countryCount}+</div>
              <div style={{ display: 'flex', fontSize: '24px', fontWeight: '600' }}>Countries Supported</div>
              <div style={{ display: 'flex', fontSize: '18px', color: '#64748b', marginTop: '8px' }}>Global tax engine coverage</div>
            </div>

            {/* Feature: Comparison */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                backgroundColor: 'rgba(45, 212, 191, 0.1)',
                borderRadius: '32px',
                padding: '32px',
                border: '1px solid rgba(45, 212, 191, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', fontSize: '40px', marginBottom: '8px' }}>📊</div>
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold' }}>Side-by-Side</div>
              <div style={{ display: 'flex', fontSize: '16px', color: '#94a3b8' }}>Comparison</div>
            </div>
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '20px', height: '40%' }}>
             {/* Feature: Open Source */}
             <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '32px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', fontSize: '32px', marginBottom: '8px' }}>🔓</div>
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold' }}>Open Source</div>
              <div style={{ display: 'flex', fontSize: '14px', color: '#64748b' }}>Community driven</div>
            </div>

            {/* Feature: Accurate */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '32px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold' }}>Tax Accurate</div>
              <div style={{ display: 'flex', fontSize: '14px', color: '#64748b' }}>Verified configs</div>
            </div>

            {/* Feature: Variants */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1.2',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '32px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', fontSize: '32px', marginBottom: '8px' }}>✨</div>
              <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold' }}>Regimes</div>
              <div style={{ display: 'flex', fontSize: '14px', color: '#64748b' }}>30% ruling, etc.</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
