import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Placeholder cards — swap src for actual card hero images (wide crop, ≥16:9)
// ---------------------------------------------------------------------------
const CARDS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?w=1600&q=85', label: 'Spring Birthday',   to: 'Mama'     },
  { id: 2, src: 'https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?w=1600&q=85', label: 'Thank You',         to: 'Jamie'    },
  { id: 3, src: 'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?w=1600&q=85', label: 'Get Well Soon',     to: 'Aunt Rosa'},
  { id: 4, src: 'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?w=1600&q=85', label: 'Anniversary',       to: 'Us'       },
  { id: 5, src: 'https://images.unsplash.com/photo-1548021682-1720ed403a5b?w=1600&q=85', label: 'Thinking of You',   to: 'Gran'     },
  { id: 6, src: 'https://images.unsplash.com/photo-1496753480864-3e588e0269b3?w=1600&q=85', label: 'Congratulations',   to: 'Lena'     },
  { id: 7, src: 'https://images.unsplash.com/photo-1613346945084-35cccc812dd5?w=1600&q=85', label: 'Welcome Home',      to: 'Dad'      },
  { id: 8, src: 'https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?w=1600&q=85', label: 'Just Because',      to: 'You'      },
]

// ---------------------------------------------------------------------------
// Film-grain overlay using inline SVG noise
// ---------------------------------------------------------------------------
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: GRAIN_SVG,
        backgroundSize: '200px 200px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Individual card — owns its own hover state so the label fade works cleanly
// ---------------------------------------------------------------------------
function GalleryCard({ card }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="gallery-img"
        src={card.src}
        draggable="false"
        alt={card.label}
        style={{
          width: '40vmin',
          height: '56vmin',
          objectFit: 'cover',
          objectPosition: '100% center',
          display: 'block',
          borderRadius: '2px',
        }}
      />

      {/* Hover label */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '3.5vmin 2.2vmin 2.2vmin',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.86))',
        borderRadius: '0 0 2px 2px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 380ms ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(0.85rem, 2.2vmin, 1.05rem)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
        }}>
          {card.label}
        </p>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 'clamp(0.52rem, 1.3vmin, 0.6rem)',
          fontWeight: 300,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
          marginTop: '0.5vmin',
        }}>
          for {card.to}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MyCreations() {
  const navigate = useNavigate()
  const trackRef = useRef(null)

  // Drag state in refs — never stale in event handlers
  const mouseDownAt  = useRef(0)
  const prevPct      = useRef(0)
  const currentPct   = useRef(0)

  const [dragging,   setDragging]   = useState(false)
  const [interacted, setInteracted] = useState(false)
  const interactedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleDown = (x) => {
      mouseDownAt.current = x
      setDragging(true)
      if (!interactedRef.current) {
        interactedRef.current = true
        setInteracted(true)
      }
    }

    const handleUp = () => {
      mouseDownAt.current = 0
      prevPct.current = currentPct.current
      setDragging(false)
    }

    const handleMove = (x) => {
      if (mouseDownAt.current === 0) return

      const delta       = mouseDownAt.current - x
      const maxDelta    = window.innerWidth / 2
      const next        = (delta / maxDelta) * -100
      const raw         = prevPct.current + next
      const clamped     = Math.max(Math.min(raw, 0), -100)
      currentPct.current = clamped

      track.animate(
        { transform: `translate(${clamped}%, -50%)` },
        { duration: 1200, fill: 'forwards' }
      )

      for (const img of track.getElementsByClassName('gallery-img')) {
        img.animate(
          { objectPosition: `${100 + clamped}% center` },
          { duration: 1200, fill: 'forwards' }
        )
      }
    }

    const onMouseDown  = e => handleDown(e.clientX)
    const onTouchStart = e => handleDown(e.touches[0].clientX)
    const onMouseUp    = ()  => handleUp()
    const onTouchEnd   = ()  => handleUp()
    const onMouseMove  = e => handleMove(e.clientX)
    const onTouchMove  = e => { e.preventDefault(); handleMove(e.touches[0].clientX) }

    window.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('mouseup',    onMouseUp)
    window.addEventListener('touchend',   onTouchEnd)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('touchmove',  onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mouseup',    onMouseUp)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      background: '#0d0905',
      cursor: dragging ? 'grabbing' : 'grab',
      userSelect: 'none',
    }}>

      <GrainOverlay />

      {/* Radial vignette */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(4,2,1,0.72) 100%)',
      }} />

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: '1.8rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.4rem',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.28)',
            padding: '0.4rem',
            display: 'flex', alignItems: 'center',
            transition: 'color 280ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.7rem',
          fontWeight: 300,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
        }}>
          My Creations
        </p>
      </div>

      {/* Image track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '3vmin',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(0%, -50%)',
        }}
      >
        {CARDS.map(card => <GalleryCard key={card.id} card={card} />)}
      </div>

      {/* Drag hint — fades on first interaction */}
      <div style={{
        position: 'fixed', bottom: '2.2rem', left: 0, right: 0,
        textAlign: 'center', zIndex: 10,
        opacity: interacted ? 0 : 0.35,
        transition: 'opacity 700ms ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.58rem',
          fontWeight: 300,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'white',
        }}>
          drag to explore
        </p>
      </div>

    </div>
  )
}
