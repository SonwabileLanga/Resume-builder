import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Resume Builder 2025</title>
        <meta name="description" content="Modern resume builder with Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              Resume Builder 2025
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Modern resume builder with Tailwind CSS
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <a 
                href="/public/index.html" 
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  marginRight: '1rem'
                }}
              >
                Open Resume Builder
              </a>
              <a 
                href="/api/health" 
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600'
                }}
              >
                Test API
              </a>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Developed by Sonwabile Langa
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
