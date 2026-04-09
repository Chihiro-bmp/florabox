export default function CardView() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '2rem' }}>🌸</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", marginTop: '0.5rem' }}>Your gift is here</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Coming soon — the envelope flip reveal lives here.</p>
      </div>
    </div>
  )
}
