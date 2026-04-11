import { useEffect, useRef, useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = 'rgba(201,168,76,0.9)'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

const WASHI_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23w)' opacity='1'/%3E%3C/svg%3E")`

// Mixed East Asian + warm quotes
const QUOTES = [
  { text: 'Even the briefest bloom leaves a trace.',  x: '8%',  y: '12%', rot: -6,  speed: 0.18 },
  { text: '花落知多少',                                x: '78%', y: '8%',  rot: 3,   speed: 0.11 },
  { text: 'The paper holds what words forget.',        x: '62%', y: '22%', rot: -3,  speed: 0.25 },
  { text: 'Some moments are worth sending.',           x: '5%',  y: '42%', rot: 5,   speed: 0.14 },
  { text: '距离不远，心意常在',                         x: '70%', y: '55%', rot: -4,  speed: 0.32 },
  { text: 'A feeling, wrapped and given.',             x: '15%', y: '68%', rot: 2,   speed: 0.20 },
  { text: 'ink dries, but warmth stays.',              x: '55%', y: '78%', rot: -7,  speed: 0.15 },
  { text: 'A quiet gesture, remembered long.',         x: '3%',  y: '84%', rot: 4,   speed: 0.28 },
  { text: 'Every card is a small ceremony.',           x: '72%', y: '88%', rot: -2,  speed: 0.12 },
]

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

// ─── Component ────────────────────────────────────────────────────────────────
export default function GalleryHero() {
  const [touch] = useState(() => isTouch())
  const [scrollY, setScrollY] = useState(0)
  const [scrollCueVisible, setScrollCueVisible] = useState(false)
  const rafRef = useRef(null)
  const scrollRef = useRef(0)

  // Delayed scroll cue entrance
  useEffect(() => {
    const t = setTimeout(() => setScrollCueVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Parallax scroll tracking — desktop only
  useEffect(() => {
    if (touch) return
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [touch])

  return (
    <section
      aria-label="Gallery entrance"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        background: '#080709',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Washi paper texture */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1,
        pointerEvents: 'none',
        backgroundImage: WASHI_SVG,
        backgroundSize: '300px 300px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }} />

      {/* Film grain */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: GRAIN_SVG,
        backgroundSize: '200px 200px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }} />

      {/* Radial vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 3,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(4,2,1,0.72) 100%)',
      }} />

      {/* Scattered background quotes */}
      {QUOTES.map((q, i) => (
        <p
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: q.x,
            top: q.y,
            zIndex: 4,
            pointerEvents: 'none',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
            color: 'rgba(201,168,76,0.18)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            transform: touch
              ? `rotate(${q.rot}deg)`
              : `rotate(${q.rot}deg) translateY(${scrollY * q.speed * -0.6}px)`,
            transition: touch ? 'none' : undefined,
            userSelect: 'none',
          }}
        >
          {q.text}
        </p>
      ))}

      {/* Centre content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.9rem',
        textAlign: 'center',
        padding: '0 2rem',
      }}>
        {/* Top hairline */}
        <div style={{
          width: '40px',
          height: '1px',
          background: 'rgba(201,168,76,0.45)',
        }} />

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2.8rem, 5vw, 4rem)',
          color: GOLD,
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          A Gallery of Feeling
        </h1>

        {/* Bottom hairline */}
        <div style={{
          width: '40px',
          height: '1px',
          background: 'rgba(201,168,76,0.45)',
        }} />

        {/* Scroll cue */}
        <div style={{
          marginTop: '1.6rem',
          opacity: scrollCueVisible ? 1 : 0,
          transition: 'opacity 800ms ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {touch ? (
            /* Mobile: text hint */
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.58rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)',
              margin: 0,
            }}>
              scroll to explore
            </p>
          ) : (
            /* Desktop: animated gold line */
            <div style={{
              width: '1px',
              height: '24px',
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.7), rgba(201,168,76,0))',
              animation: 'scrollLinePulse 2s ease-in-out infinite',
            }} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes scrollLinePulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  )
}
