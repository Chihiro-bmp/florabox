import { useCallback, useEffect, useRef, useState } from 'react'
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
        position: 'fixed', inset: 0, zIndex: 7,
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
// Fullscreen expanded view — shown when a card is selected
// ---------------------------------------------------------------------------
function ExpandedView({ card, visible, navDir }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 4,
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'opacity 320ms ease',
    }}>
      {card && (
        <img
          key={card.id}
          src={card.src}
          alt={card.label}
          draggable="false"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: visible
              ? 'scale(1) translateX(0)'
              : `scale(1.03) translateX(${navDir === 1 ? '2%' : navDir === -1 ? '-2%' : '0'})`,
            transition: 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      )}

      {/* Bottom gradient for text legibility */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '55%',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.93))',
        pointerEvents: 'none',
      }} />

      {/* Card title */}
      {card && (
        <div style={{
          position: 'absolute',
          bottom: '7.8rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 350ms ease',
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem, 4.2vw, 2.8rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            {card.label}
          </p>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(0.52rem, 1.3vmin, 0.65rem)',
            fontWeight: 300,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.32)',
            marginTop: '0.7rem',
          }}>
            for {card.to}
          </p>
        </div>
      )}
    </div>
  )
}

// Fine-linework plus icon — custom SVG, no emoji
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="1"  x2="10" y2="19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="1"  y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Individual card — owns its own hover state so the label fade works cleanly
// ---------------------------------------------------------------------------
function GalleryCard({ card, isSelected, onClick, onHoverChange }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      data-card="true"
      style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
      onMouseEnter={() => { setHovered(true);  onHoverChange?.(true);  }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
      onClick={onClick}
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
          outline: isSelected ? '1px solid rgba(255,255,255,0.32)' : '1px solid transparent',
          transition: 'outline-color 300ms ease',
        }}
      />

      {/* Hover / selected label */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '3.5vmin 2.2vmin 2.2vmin',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.86))',
        borderRadius: '0 0 2px 2px',
        opacity: (hovered || isSelected) ? 1 : 0,
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
  const trackRef     = useRef(null)
  const trackAnimRef = useRef(null)
  const imgAnimsRef  = useRef([])

  // Drag state in refs — never stale in event handlers
  const mouseDownAt  = useRef(0)
  const dragStartX   = useRef(0)
  const prevPct      = useRef(0)
  const currentPct   = useRef(0)
  const didDrag      = useRef(false)

  const [dragging,    setDragging]    = useState(false)
  const [interacted,  setInteracted]  = useState(false)
  const interactedRef = useRef(false)
  const [selectedIdx, setSelectedIdx] = useState(null)

  // + button rotation state — each click accumulates 90°
  const [leftRot,  setLeftRot]  = useState(0)
  const [rightRot, setRightRot] = useState(0)

  // Navigation animation direction: -1 = left, 1 = right, null = none
  const [navDir, setNavDir] = useState(null)
  const [expandedVisible, setExpandedVisible] = useState(false)
  const navTimeoutRef = useRef(null)

  // Refs to avoid stale closures in event handlers
  const hoveredIdxRef  = useRef(null)
  const selectedIdxRef = useRef(null)
  const wheelThrottle  = useRef(false)

  // Keep selectedIdxRef current on every render
  selectedIdxRef.current = selectedIdx

  // Trigger expanded crossfade when selectedIdx changes
  useEffect(() => {
    if (selectedIdx !== null) {
      // Brief fade-out then fade-in for navigation transitions
      if (navDir !== null) {
        setExpandedVisible(false)
        clearTimeout(navTimeoutRef.current)
        navTimeoutRef.current = setTimeout(() => {
          setExpandedVisible(true)
          setNavDir(null)
        }, 180)
      } else {
        setExpandedVisible(true)
      }
    } else {
      setExpandedVisible(false)
    }
    return () => clearTimeout(navTimeoutRef.current)
  }, [selectedIdx])

  // ---------------------------------------------------------------------------
  // Dynamic clamp bounds — centres first/last card instead of hardcoded [−100, 0]
  // ---------------------------------------------------------------------------
  const getClampBounds = useCallback(() => {
    const track = trackRef.current
    if (!track) return { min: -100, max: 0 }
    const cards = track.querySelectorAll('[data-card]')
    if (cards.length === 0) return { min: -100, max: 0 }
    const first = cards[0]
    const last  = cards[cards.length - 1]
    const firstCenter = first.offsetLeft + first.offsetWidth / 2
    const lastCenter  = last.offsetLeft  + last.offsetWidth  / 2
    return {
      max: (-firstCenter / track.offsetWidth) * 100,
      min: (-lastCenter  / track.offsetWidth) * 100,
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Core animation helpers
  // ---------------------------------------------------------------------------
  const applyTrackPosition = useCallback((pct, duration = 0) => {
    const track = trackRef.current
    if (!track) return
    const imgs = Array.from(track.getElementsByClassName('gallery-img'))
    if (duration > 0) {
      trackAnimRef.current?.cancel()
      trackAnimRef.current = track.animate(
        { transform: `translateX(${pct}%)` },
        { duration, fill: 'forwards', easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
      )
      trackAnimRef.current.onfinish = () => {
        track.style.transform = `translateX(${pct}%)`
        trackAnimRef.current?.cancel()
        trackAnimRef.current = null
      }
      imgAnimsRef.current.forEach(a => a?.cancel())
      imgAnimsRef.current = imgs.map(img => {
        const anim = img.animate(
          { objectPosition: `${100 + pct}% center` },
          { duration, fill: 'forwards', easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
        )
        anim.onfinish = () => { img.style.objectPosition = `${100 + pct}% center` }
        return anim
      })
    } else {
      trackAnimRef.current?.cancel()
      trackAnimRef.current = null
      track.style.transform = `translateX(${pct}%)`
      imgAnimsRef.current.forEach(a => a?.cancel())
      imgAnimsRef.current = []
      imgs.forEach(img => { img.style.objectPosition = `${100 + pct}% center` })
    }
  }, [])

  const snapToCard = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('[data-card]')
    const card  = cards[index]
    if (!card) return

    const cardCenterPx = card.offsetLeft + card.offsetWidth / 2
    const pct          = (-cardCenterPx / track.offsetWidth) * 100
    const bounds       = getClampBounds()
    const clamped      = Math.max(Math.min(pct, bounds.max), bounds.min)

    currentPct.current = clamped
    prevPct.current    = clamped
    applyTrackPosition(clamped, 800)
  }, [applyTrackPosition, getClampBounds])

  // ---------------------------------------------------------------------------
  // Click a card → centre it and reveal nav UI
  // ---------------------------------------------------------------------------
  const handleCardClick = useCallback((index) => {
    if (didDrag.current) return
    setSelectedIdx(index)
    snapToCard(index)
    if (!interactedRef.current) {
      interactedRef.current = true
      setInteracted(true)
    }
  }, [snapToCard])

  // ---------------------------------------------------------------------------
  // + button navigation
  // ---------------------------------------------------------------------------
  const navigateTo = useCallback((dir) => {
    setNavDir(dir)
    setSelectedIdx(prev => {
      const next = Math.max(0, Math.min(CARDS.length - 1, (prev ?? 0) + dir))
      snapToCard(next)
      return next
    })
  }, [snapToCard])

  // ---------------------------------------------------------------------------
  // Drag / touch event wiring
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleDown = (x) => {
      mouseDownAt.current = x
      dragStartX.current  = x
      didDrag.current     = false
      setDragging(true)
      if (!interactedRef.current) {
        interactedRef.current = true
        setInteracted(true)
      }
    }

    const handleUp = () => {
      mouseDownAt.current = 0
      prevPct.current     = currentPct.current
      setDragging(false)
    }

    const handleMove = (x) => {
      if (mouseDownAt.current === 0) return
      if (Math.abs(x - dragStartX.current) > 5) {
        if (!didDrag.current) {
          didDrag.current = true
          setSelectedIdx(null)
        }
      }
      const delta    = mouseDownAt.current - x
      const maxDelta = window.innerWidth / 2
      const next     = (delta / maxDelta) * -100
      const raw      = prevPct.current + next
      const bounds   = getClampBounds()
      const clamped  = Math.max(Math.min(raw, bounds.max), bounds.min)
      currentPct.current = clamped
      applyTrackPosition(clamped)
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
  }, [applyTrackPosition])

  // ---------------------------------------------------------------------------
  // Scroll wheel: up over a card → zoom it; down when expanded → close
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleWheel = (e) => {
      if (wheelThrottle.current) return
      const idx = selectedIdxRef.current

      if (idx !== null) {
        // Expanded — scroll down to return to carousel
        if (e.deltaY > 30) {
          wheelThrottle.current = true
          setTimeout(() => { wheelThrottle.current = false }, 700)
          setSelectedIdx(null)
        }
      } else {
        // Carousel — scroll up over a card to zoom it
        if (e.deltaY < -30) {
          const hi = hoveredIdxRef.current
          if (hi !== null) {
            wheelThrottle.current = true
            setTimeout(() => { wheelThrottle.current = false }, 700)
            setSelectedIdx(hi)
            snapToCard(hi)
            if (!interactedRef.current) {
              interactedRef.current = true
              setInteracted(true)
            }
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [snapToCard])

  const navVisible = selectedIdx !== null
  const atStart    = selectedIdx === 0
  const atEnd      = selectedIdx === CARDS.length - 1

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
        position: 'fixed', inset: 0, zIndex: 8, pointerEvents: 'none',
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
            color: 'rgba(255,255,255,0.35)',
            padding: '0.4rem',
            display: 'flex', alignItems: 'center',
            transition: 'color 280ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
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
          color: 'rgba(255,255,255,0.45)',
        }}>
          My Creations
        </p>
      </div>

      {/* Image track — outer div handles vertical centering (React), inner div handles horizontal scroll (JS) */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateY(-50%)' }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '3vmin',
          willChange: 'transform',
        }}
      >
        {CARDS.map((card, i) => (
          <GalleryCard
            key={card.id}
            card={card}
            isSelected={selectedIdx === i}
            onClick={() => handleCardClick(i)}
            onHoverChange={(h) => {
              if (h) hoveredIdxRef.current = i
              else if (hoveredIdxRef.current === i) hoveredIdxRef.current = null
            }}
          />
        ))}
      </div>
      </div>

      {/* ── Fullscreen expanded view (behind grain/vignette, above track) ── */}
      <ExpandedView
        card={selectedIdx !== null ? CARDS[selectedIdx] : null}
        visible={expandedVisible}
        navDir={navDir}
      />

      {/* ── Close expanded view — top right ───────────────────────────────── */}
      <button
        onClick={() => setSelectedIdx(null)}
        style={{
          position: 'fixed',
          top: '1.55rem',
          right: '2rem',
          zIndex: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.55rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.58rem',
          fontWeight: 300,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(245,237,224,0.44)',
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? 'translateX(0)' : 'translateX(10px)',
          transition: 'opacity 400ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), color 260ms ease',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,237,224,0.9)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,224,0.44)'}
      >
        close
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── Left + navigation ─────────────────────────────────────────────── */}
      <button
        onClick={() => { navigateTo(-1); setLeftRot(r => r + 90) }}
        style={{
          position: 'fixed',
          left: '2.6rem',
          top: '50%',
          transform: `translateY(-50%) scale(${navVisible ? 1 : 0.5})`,
          zIndex: 20,
          background: 'none',
          border: 'none',
          cursor: navVisible && !atStart ? 'pointer' : 'default',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          opacity: navVisible ? (atStart ? 0.14 : 0.65) : 0,
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atStart) e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { if (!atStart) e.currentTarget.style.opacity = '0.65' }}
      >
        <span style={{
          display: 'inline-flex',
          transform: `rotate(${leftRot}deg)`,
          transition: 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <PlusIcon />
        </span>
      </button>

      {/* ── Right + navigation ────────────────────────────────────────────── */}
      <button
        onClick={() => { navigateTo(1); setRightRot(r => r + 90) }}
        style={{
          position: 'fixed',
          right: '2.6rem',
          top: '50%',
          transform: `translateY(-50%) scale(${navVisible ? 1 : 0.5})`,
          zIndex: 20,
          background: 'none',
          border: 'none',
          cursor: navVisible && !atEnd ? 'pointer' : 'default',
          padding: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          opacity: navVisible ? (atEnd ? 0.14 : 0.65) : 0,
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atEnd) e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { if (!atEnd) e.currentTarget.style.opacity = '0.65' }}
      >
        <span style={{
          display: 'inline-flex',
          transform: `rotate(${rightRot}deg)`,
          transition: 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <PlusIcon />
        </span>
      </button>

      {/* ── Counter — bottom centre ───────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: '2.2rem',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10,
        opacity: navVisible ? 0.42 : 0,
        transition: 'opacity 420ms ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.56rem',
          fontWeight: 300,
          letterSpacing: '0.24em',
          color: 'white',
        }}>
          {selectedIdx !== null ? `${selectedIdx + 1} — ${CARDS.length}` : ''}
        </p>
      </div>

      {/* ── Thumbnail strip — bottom right ────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: '1.6rem',
        right: '2rem',
        zIndex: 20,
        display: 'flex',
        gap: '3px',
        alignItems: 'center',
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 500ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: navVisible ? 'auto' : 'none',
      }}>
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            onClick={() => { setSelectedIdx(i); snapToCard(i) }}
            style={{
              width: '48px',
              height: '34px',
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '1px',
              cursor: 'pointer',
              opacity: selectedIdx === i ? 1 : 0.32,
              outline: selectedIdx === i
                ? '1px solid rgba(255,255,255,0.5)'
                : '1px solid transparent',
              transition: 'opacity 280ms ease, outline-color 280ms ease',
            }}
          >
            <img
              src={card.src}
              alt={card.label}
              draggable="false"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Drag hint — fades on first interaction ────────────────────────── */}
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
