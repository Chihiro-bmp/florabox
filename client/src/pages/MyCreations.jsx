import { useCallback, useEffect, useRef, useState } from 'react'
import { useTransition } from '../context/TransitionContext'

// ---------------------------------------------------------------------------
// Placeholder cards — will be replaced by real user-created card data + components
// ---------------------------------------------------------------------------
const CARDS = [
  { id: 1, label: 'Spring Birthday',  to: 'Mama'     },
  { id: 2, label: 'Thank You',        to: 'Jamie'    },
  { id: 3, label: 'Get Well Soon',    to: 'Aunt Rosa'},
  { id: 4, label: 'Anniversary',      to: 'Us'       },
  { id: 5, label: 'Thinking of You',  to: 'Gran'     },
  { id: 6, label: 'Congratulations',  to: 'Lena'     },
  { id: 7, label: 'Welcome Home',     to: 'Dad'      },
  { id: 8, label: 'Just Because',     to: 'You'      },
]

const NATIVE_W   = 300;
const NATIVE_H   = 400;
const THUMB_W    = 39;
const THUMB_H    = 52;
const THUMB_SCALE = THUMB_W / NATIVE_W;

// Design tokens — match CardGallery
const GOLD        = 'rgba(201,168,76,0.88)';
const GOLD_BORDER = 'rgba(201,168,76,0.65)';
const GOLD_GLOW   = 'rgba(201,168,76,0.14)';
const ROSE        = 'rgba(196,149,106,0.75)';
const ROSE_FULL   = 'rgba(196,149,106,1)';
const ROSE_BORDER = 'rgba(196,149,106,0.55)';
const CHROME      = 'rgba(245,237,224,0.52)';

// Placeholder card face — rendered for cards that don't have a Component yet
function PlaceholderCard({ card }) {
  return (
    <div style={{
      width: NATIVE_W,
      height: NATIVE_H,
      background: 'linear-gradient(160deg, #2a1a0e 0%, #130a04 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: "'Cormorant Garamond', serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Faint botanical line accent */}
      <svg style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.12 }}
        width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="38" stroke="#f5ede0" strokeWidth="0.5"/>
        <line x1="40" y1="2" x2="40" y2="78" stroke="#f5ede0" strokeWidth="0.5"/>
        <line x1="2" y1="40" x2="78" y2="40" stroke="#f5ede0" strokeWidth="0.5"/>
      </svg>
      <p style={{
        fontSize: '1.35rem',
        fontWeight: 300,
        fontStyle: 'italic',
        color: 'rgba(245,237,224,0.82)',
        letterSpacing: '0.04em',
        lineHeight: 1.25,
        marginBottom: '0.55rem',
      }}>{card.label}</p>
      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.52rem',
        fontWeight: 300,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'rgba(245,237,224,0.28)',
      }}>for {card.to}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Texture overlays
// ---------------------------------------------------------------------------
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
const WASHI_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23w)' opacity='1'/%3E%3C/svg%3E")`

function WashiOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 6,
        pointerEvents: 'none',
        backgroundImage: WASHI_SVG,
        backgroundSize: '300px 300px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

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
// Expanded card overlay — centred live card component + label
// ---------------------------------------------------------------------------
function ExpandedView({ card, visible, expandedScale }) {
  const w = NATIVE_W * expandedScale;
  const h = NATIVE_H * expandedScale;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'opacity 320ms ease',
    }}>
      {/* Semi-dark backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,6,3,0.82)',
        pointerEvents: 'none',
      }} />

      {card && (
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.4rem',
        }}>
          {/* Scaled card */}
          <div style={{
            width: `${w}px`,
            height: `${h}px`,
            overflow: 'hidden',
            borderRadius: '3px',
            boxShadow: `0 0 0 1px ${GOLD_BORDER}, 0 0 40px 12px ${GOLD_GLOW}, 0 40px 120px rgba(0,0,0,0.85)`,
          }}>
            <div style={{
              width: NATIVE_W,
              height: NATIVE_H,
              transformOrigin: 'top left',
              transform: `scale(${expandedScale})`,
              pointerEvents: 'none',
            }}>
              <PlaceholderCard card={card} />
            </div>
          </div>

          {/* Label */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.6vw, 1.4rem)',
              fontWeight: 300,
              color: 'rgba(201,168,76,0.82)',
              letterSpacing: '0.06em',
            }}>
              {card.label}
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.54rem',
              fontWeight: 300,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(245,237,224,0.28)',
              marginTop: '0.4rem',
            }}>
              for {card.to}
            </p>
          </div>
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
// Individual card — scaled PlaceholderCard inside the track
// ---------------------------------------------------------------------------
function GalleryCard({ card, isSelected, onClick, onHoverChange, cardScale, enterDelay }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const scaleVal = pressed ? 0.975 : hovered && !isSelected ? 1.018 : 1

  return (
    <div
      data-card="true"
      aria-label={`${card.label}, for ${card.to}`}
      role="button"
      tabIndex={0}
      style={{
        position: 'relative', flexShrink: 0, cursor: 'pointer',
        overflow: 'hidden', borderRadius: '2px',
        animation: `cardEnter 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms both`,
        boxShadow: isSelected
          ? `0 0 0 1px ${GOLD_BORDER}, 0 0 40px 12px ${GOLD_GLOW}, 0 0 80px 20px rgba(201,168,76,0.05), 0 24px 60px rgba(0,0,0,0.6)`
          : hovered
            ? '0 0 0 1px rgba(245,237,224,0.12), 0 16px 40px rgba(0,0,0,0.55)'
            : '0 0 0 1px transparent, 0 8px 20px rgba(0,0,0,0.35)',
        transform: `scale(${scaleVal})`,
        transition: 'box-shadow 320ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={() => { setHovered(true);  onHoverChange?.(true);  }}
      onMouseLeave={() => { setHovered(false); setPressed(false); onHoverChange?.(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      {/* Live card component scaled to fit */}
      <div style={{
        width: NATIVE_W,
        height: NATIVE_H,
        transformOrigin: 'top left',
        transform: `scale(${cardScale})`,
        pointerEvents: 'none',
      }}>
        <PlaceholderCard card={card} />
      </div>

      {/* Hover / selected label */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '3.5vmin 2.2vmin 2.2vmin',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.88))',
        borderRadius: '0 0 2px 2px',
        opacity: (hovered || isSelected) ? 1 : 0,
        transition: 'opacity 300ms ease',
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
  const { transitionTo } = useTransition()
  const trackRef     = useRef(null)
  const trackAnimRef = useRef(null)

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

  // Responsive track card dimensions — maintains native 3:4 ratio
  const [cardDims, setCardDims] = useState({ w: 240, h: 320, scale: 0.8 })

  useEffect(() => {
    const update = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight)
      const w = Math.round(vmin * 0.38)
      const h = Math.round(w * (4 / 3))
      setCardDims({ w, h, scale: w / NATIVE_W })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Responsive expanded scale
  const [expandedScale, setExpandedScale] = useState(1.2)

  useEffect(() => {
    const update = () => {
      const avH = (window.innerHeight - 190) * 0.92
      const avW = (window.innerWidth  - 280) * 0.90
      setExpandedScale(Math.max(0.5, Math.min(avH / NATIVE_H, avW / NATIVE_W)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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
    } else {
      trackAnimRef.current?.cancel()
      trackAnimRef.current = null
      track.style.transform = `translateX(${pct}%)`
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

      <WashiOverlay />
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
          aria-label="Back to home"
          onClick={() => transitionTo('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.35)',
            padding: '0.55rem',
            minWidth: '44px', minHeight: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: 'rgba(201,168,76,0.72)',
          }}>
            My Collection
          </p>
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.52rem',
            fontWeight: 300,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,237,224,0.22)',
          }}>
            {CARDS.length} cards
          </span>
        </div>
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
            cardScale={cardDims.scale}
            enterDelay={i * 45}
          />
        ))}
      </div>
      </div>

      {/* ── Expanded card overlay ─────────────────────────────────────────── */}
      <ExpandedView
        card={selectedIdx !== null ? CARDS[selectedIdx] : null}
        visible={expandedVisible}
        expandedScale={expandedScale}
      />

      {/* ── Close expanded view — top right ───────────────────────────────── */}
      <button
        aria-label="Close expanded view"
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
        aria-label="Previous card"
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
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), color 220ms ease',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atStart) { e.currentTarget.style.color = GOLD; e.currentTarget.style.opacity = '1' } }}
        onMouseLeave={e => { if (!atStart) { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '0.65' } }}
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
        aria-label="Next card"
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
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), color 220ms ease',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atEnd) { e.currentTarget.style.color = GOLD; e.currentTarget.style.opacity = '1' } }}
        onMouseLeave={e => { if (!atEnd) { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '0.65' } }}
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
          color: CHROME,
        }}>
          {selectedIdx !== null
            ? `${String(selectedIdx + 1).padStart(2, '0')} / ${String(CARDS.length).padStart(2, '0')}`
            : ''
          }
        </p>
      </div>

      {/* ── Action CTAs — bottom left (view + send again) ─────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: '1.55rem',
        left: '2rem',
        zIndex: 20,
        display: 'flex',
        gap: '0.6rem',
        alignItems: 'center',
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 480ms ease, transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: navVisible ? 'auto' : 'none',
      }}>
        {/* View card */}
        <button
          aria-label="View this card"
          onClick={() => transitionTo(`/card/view/${CARDS[selectedIdx]?.id}`)}
          style={{
            background: 'none',
            border: `0.5px solid ${ROSE_BORDER}`,
            borderRadius: '2px',
            cursor: 'pointer',
            padding: '0 1.3rem',
            minHeight: '44px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ROSE,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
            transition: 'color 220ms ease, border-color 220ms ease, box-shadow 280ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = ROSE_FULL;
            e.currentTarget.style.borderColor = ROSE_FULL;
            e.currentTarget.style.boxShadow = '0 0 14px rgba(196,149,106,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = ROSE;
            e.currentTarget.style.borderColor = ROSE_BORDER;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          View card
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Send again */}
        <button
          aria-label="Send this card again"
          onClick={() => transitionTo(`/card/new?preset=${CARDS[selectedIdx]?.id}`)}
          style={{
            background: 'none',
            border: '0.5px solid rgba(245,237,224,0.16)',
            borderRadius: '2px',
            cursor: 'pointer',
            padding: '0 1.3rem',
            minHeight: '44px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 300,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245,237,224,0.38)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
            transition: 'color 220ms ease, border-color 220ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(245,237,224,0.75)';
            e.currentTarget.style.borderColor = 'rgba(245,237,224,0.32)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(245,237,224,0.38)';
            e.currentTarget.style.borderColor = 'rgba(245,237,224,0.16)';
          }}
        >
          Send again
        </button>
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
            role="button"
            aria-label={`Select ${card.label}`}
            tabIndex={navVisible ? 0 : -1}
            onClick={() => { setSelectedIdx(i); snapToCard(i) }}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (setSelectedIdx(i), snapToCard(i))}
            style={{
              width: `${THUMB_W}px`,
              height: `${THUMB_H}px`,
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '1px',
              cursor: 'pointer',
              opacity: selectedIdx === i ? 1 : 0.32,
              outline: selectedIdx === i
                ? `1px solid ${GOLD_BORDER}`
                : '1px solid transparent',
              transition: 'opacity 280ms ease, outline-color 280ms ease',
            }}
          >
            <div style={{
              width: NATIVE_W,
              height: NATIVE_H,
              transformOrigin: 'top left',
              transform: `scale(${THUMB_SCALE})`,
              pointerEvents: 'none',
            }}>
              <PlaceholderCard card={card} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-card="true"] { animation: none !important; transition: box-shadow 300ms ease !important; }
        }
      `}</style>

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
