import { useCallback, useEffect, useRef, useState } from 'react';
import { useTransition } from '../../context/TransitionContext';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD        = 'rgba(201,168,76,0.88)';  // gold — nav button hover
const GOLD_BORDER = 'rgba(201,168,76,0.65)';  // gold — selected card glow ring
const GOLD_GLOW   = 'rgba(201,168,76,0.14)';  // gold — selected card ambient glow
const ROSE        = 'rgba(196,149,106,0.75)';  // rose — CTA text
const ROSE_FULL   = 'rgba(196,149,106,1)';     // rose — CTA hover text
const ROSE_BORDER = 'rgba(196,149,106,0.55)';  // rose — CTA border
// UI chrome: warm parchment — "testament of time" aged cream, not gold
const CHROME      = 'rgba(245,237,224,0.52)';  // eyebrow label, counter
const CHROME_RULE = 'rgba(245,237,224,0.20)';  // hairline rule

// ---------------------------------------------------------------------------
// Texture overlays
// ---------------------------------------------------------------------------
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;
const WASHI_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23w)' opacity='1'/%3E%3C/svg%3E")`;

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
  );
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
  );
}

// Fine-linework plus icon — no emoji
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="10" y1="1"  x2="10" y2="19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="1"  y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Individual gallery card — live React component scaled into the track
// ---------------------------------------------------------------------------
const NATIVE_W = 300;
const NATIVE_H = 400;
const THUMB_W  = 39;
const THUMB_H  = 52; // 3:4 ratio
const THUMB_SCALE = THUMB_W / NATIVE_W;

function GalleryCard({ card, isSelected, onClick, onHoverChange, cardScale, enterDelay }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const scaleVal = pressed ? 0.975 : hovered && !isSelected ? 1.018 : 1;

  return (
    <div
      data-card="true"
      aria-label={`${card.name}, ${card.occasion} card`}
      role="button"
      tabIndex={0}
      style={{
        position: 'relative',
        flexShrink: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '2px',
        // Stagger entrance from below
        animation: `cardEnter 500ms cubic-bezier(0.16, 1, 0.3, 1) ${enterDelay}ms both`,
        // Lift + glow on selected; subtle lift on hover
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
        <card.Component />
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
          fontSize: 'clamp(0.75rem, 2.2vmin, 1rem)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
        }}>
          {card.name}
        </p>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 'clamp(0.48rem, 1.2vmin, 0.58rem)',
          fontWeight: 300,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
          marginTop: '0.5vmin',
        }}>
          {card.occasion}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expanded card overlay — live React component + CTA
// ---------------------------------------------------------------------------
function ExpandedCard({ card, visible, expandedScale }) {
  const NATIVE_W = 300;
  const NATIVE_H = 400;
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
      {/* Semi-dark background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,6,3,0.82)',
        pointerEvents: 'none',
      }} />

      {card && (
        <div
          key={card.id}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.4rem',
          }}
        >
          {/* Live card component */}
          <div style={{
            width:  `${w}px`,
            height: `${h}px`,
            overflow: 'hidden',
            borderRadius: '3px',
            boxShadow: `0 0 0 1px rgba(196,149,106,0.55), 0 40px 120px rgba(0,0,0,0.85)`,
          }}>
            <div style={{
              width: NATIVE_W,
              height: NATIVE_H,
              transformOrigin: 'top left',
              transform: `scale(${expandedScale})`,
              pointerEvents: 'none',
            }}>
              <card.Component />
            </div>
          </div>

          {/* Card name */}
          <div style={{
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}>
            <p style={{
              fontFamily: card.nameFont || "'Cormorant Garamond', serif",
              fontStyle: card.nameItalic !== false ? 'italic' : 'normal',
              fontSize: 'clamp(1rem, 2.6vw, 1.4rem)',
              fontWeight: 300,
              color: card.nameColor || 'rgba(201,168,76,0.88)',
              letterSpacing: card.nameFont?.includes('Mono') ? '0.12em' : '0.06em',
            }}>
              {card.name}
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.54rem',
              fontWeight: 300,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(245,237,224,0.32)',
              marginTop: '0.4rem',
            }}>
              {card.occasion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main gallery component
// ---------------------------------------------------------------------------
export default function CardGallery({ cards }) {
  const { transitionTo } = useTransition();
  const trackRef     = useRef(null);
  const trackAnimRef = useRef(null);
  const containerRef = useRef(null);

  // Show fixed UI elements only once the hero has scrolled mostly away.
  // Threshold: hero is ~100dvh tall; 40% scroll = hero 40% gone = safe to show gallery chrome.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const check = () => {
      const heroGone = window.scrollY > window.innerHeight * 0.4;
      setInView(heroGone);
      if (!heroGone) setSelectedIdx(null);
    };
    check(); // run once on mount
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  // Drag state
  const mouseDownAt  = useRef(0);
  const dragStartX   = useRef(0);
  const prevPct      = useRef(0);
  const currentPct   = useRef(0);
  const didDrag      = useRef(false);

  const [dragging,    setDragging]    = useState(false);
  const [interacted,  setInteracted]  = useState(false);
  const interactedRef = useRef(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  // + button rotation state
  const [leftRot,  setLeftRot]  = useState(0);
  const [rightRot, setRightRot] = useState(0);

  // Navigation animation direction: -1 = left, 1 = right, null = none
  const [navDir, setNavDir] = useState(null);
  const [expandedVisible, setExpandedVisible] = useState(false);
  const navTimeoutRef = useRef(null);

  const hoveredIdxRef  = useRef(null);
  const selectedIdxRef = useRef(null);
  const wheelThrottle  = useRef(false);

  selectedIdxRef.current = selectedIdx;

  // Trigger expanded crossfade when selectedIdx changes
  useEffect(() => {
    if (selectedIdx !== null) {
      if (navDir !== null) {
        setExpandedVisible(false);
        clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = setTimeout(() => {
          setExpandedVisible(true);
          setNavDir(null);
        }, 180);
      } else {
        setExpandedVisible(true);
      }
    } else {
      setExpandedVisible(false);
    }
    return () => clearTimeout(navTimeoutRef.current);
  }, [selectedIdx]);

  // Responsive expanded scale
  const [expandedScale, setExpandedScale] = useState(1.2);

  useEffect(() => {
    const update = () => {
      const avH = (window.innerHeight - 190) * 0.92;
      const avW = (window.innerWidth  - 280) * 0.90;
      setExpandedScale(Math.max(0.5, Math.min(avH / 400, avW / 300)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Responsive track card dimensions — maintains native 3:4 ratio
  const [cardDims, setCardDims] = useState({ w: 240, h: 320, scale: 0.8 });

  useEffect(() => {
    const update = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const w = Math.round(vmin * 0.38);
      const h = Math.round(w * (4 / 3));
      setCardDims({ w, h, scale: w / NATIVE_W });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ---------------------------------------------------------------------------
  // Dynamic clamp bounds — centres first/last card instead of hardcoded [−100, 0]
  // ---------------------------------------------------------------------------
  const getClampBounds = useCallback(() => {
    const track = trackRef.current;
    if (!track) return { min: -100, max: 0 };
    const cardEls = track.querySelectorAll('[data-card]');
    if (cardEls.length === 0) return { min: -100, max: 0 };
    const first = cardEls[0];
    const last  = cardEls[cardEls.length - 1];
    const firstCenter = first.offsetLeft + first.offsetWidth / 2;
    const lastCenter  = last.offsetLeft  + last.offsetWidth  / 2;
    return {
      max: (-firstCenter / track.offsetWidth) * 100,
      min: (-lastCenter  / track.offsetWidth) * 100,
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Core animation helpers
  // ---------------------------------------------------------------------------
  const applyTrackPosition = useCallback((pct, duration = 0) => {
    const track = trackRef.current;
    if (!track) return;
    if (duration > 0) {
      trackAnimRef.current?.cancel();
      trackAnimRef.current = track.animate(
        { transform: `translateX(${pct}%)` },
        { duration, fill: 'forwards', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
      trackAnimRef.current.onfinish = () => {
        track.style.transform = `translateX(${pct}%)`;
        trackAnimRef.current?.cancel();
        trackAnimRef.current = null;
      };
    } else {
      trackAnimRef.current?.cancel();
      trackAnimRef.current = null;
      track.style.transform = `translateX(${pct}%)`;
    }
  }, []);

  const snapToCard = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const cardEls = track.querySelectorAll('[data-card]');
    const cardEl  = cardEls[index];
    if (!cardEl) return;

    const cardCenterPx = cardEl.offsetLeft + cardEl.offsetWidth / 2;
    const pct          = (-cardCenterPx / track.offsetWidth) * 100;
    const bounds       = getClampBounds();
    const clamped      = Math.max(Math.min(pct, bounds.max), bounds.min);

    currentPct.current = clamped;
    prevPct.current    = clamped;
    applyTrackPosition(clamped, 600);
  }, [applyTrackPosition, getClampBounds]);

  const handleCardClick = useCallback((index) => {
    if (didDrag.current) return;
    setSelectedIdx(index);
    snapToCard(index);
    if (!interactedRef.current) {
      interactedRef.current = true;
      setInteracted(true);
    }
  }, [snapToCard]);

  const navigateTo = useCallback((dir) => {
    setNavDir(dir);
    setSelectedIdx(prev => {
      const next = Math.max(0, Math.min(cards.length - 1, (prev ?? 0) + dir));
      snapToCard(next);
      return next;
    });
  }, [snapToCard, cards.length]);

  // ---------------------------------------------------------------------------
  // Drag / touch event wiring
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleDown = (x) => {
      mouseDownAt.current = x;
      dragStartX.current  = x;
      didDrag.current     = false;
      setDragging(true);
      if (!interactedRef.current) {
        interactedRef.current = true;
        setInteracted(true);
      }
    };

    const handleUp = () => {
      mouseDownAt.current = 0;
      prevPct.current     = currentPct.current;
      setDragging(false);
    };

    const handleMove = (x) => {
      if (mouseDownAt.current === 0) return;
      if (Math.abs(x - dragStartX.current) > 5) {
        if (!didDrag.current) {
          didDrag.current = true;
          setSelectedIdx(null);
        }
      }
      const delta    = mouseDownAt.current - x;
      const maxDelta = window.innerWidth / 2;
      const next     = (delta / maxDelta) * -100;
      const raw      = prevPct.current + next;
      const bounds   = getClampBounds();
      const clamped  = Math.max(Math.min(raw, bounds.max), bounds.min);
      currentPct.current = clamped;
      applyTrackPosition(clamped);
    };

    const onMouseDown  = e => handleDown(e.clientX);
    const onTouchStart = e => handleDown(e.touches[0].clientX);
    const onMouseUp    = () => handleUp();
    const onTouchEnd   = () => handleUp();
    const onMouseMove  = e => handleMove(e.clientX);
    const onTouchMove  = e => { e.preventDefault(); handleMove(e.touches[0].clientX); };

    window.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mouseup',    onMouseUp);
    window.addEventListener('touchend',   onTouchEnd);
    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('touchmove',  onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousedown',  onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchmove',  onTouchMove);
    };
  }, [applyTrackPosition]);

  // ---------------------------------------------------------------------------
  // Scroll wheel: up over a card → expand; down when expanded → close
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleWheel = (e) => {
      if (wheelThrottle.current) return;
      const idx = selectedIdxRef.current;

      if (idx !== null) {
        if (e.deltaY > 30) {
          wheelThrottle.current = true;
          setTimeout(() => { wheelThrottle.current = false; }, 700);
          setSelectedIdx(null);
        }
      } else {
        if (e.deltaY < -30) {
          const hi = hoveredIdxRef.current;
          if (hi !== null) {
            wheelThrottle.current = true;
            setTimeout(() => { wheelThrottle.current = false; }, 700);
            setSelectedIdx(hi);
            snapToCard(hi);
            if (!interactedRef.current) {
              interactedRef.current = true;
              setInteracted(true);
            }
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [snapToCard]);

  const navVisible = selectedIdx !== null;
  const atStart    = selectedIdx === 0;
  const atEnd      = selectedIdx === cards.length - 1;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        background: '#080709',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >

      {inView && <WashiOverlay />}
      {inView && <GrainOverlay />}

      {/* Radial vignette — only when gallery is in view */}
      {inView && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, zIndex: 8, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(4,2,1,0.72) 100%)',
        }} />
      )}

      {/* Eyebrow label + gold hairline — only when gallery is in view */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 10,
        pointerEvents: 'none',
        opacity: inView ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}>
        <div style={{
          padding: '1.8rem 2rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.62rem',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: CHROME,
          }}>
            Choose a card
          </p>
        </div>
        <div style={{
          height: '1px',
          background: CHROME_RULE,
          marginTop: '-0.8rem',
        }} />
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
        {cards.map((card, i) => (
          <GalleryCard
            key={card.id}
            card={card}
            isSelected={selectedIdx === i}
            onClick={() => handleCardClick(i)}
            onHoverChange={(h) => {
              if (h) hoveredIdxRef.current = i;
              else if (hoveredIdxRef.current === i) hoveredIdxRef.current = null;
            }}
            cardScale={cardDims.scale}
            enterDelay={i * 45}
          />
        ))}
      </div>
      </div>

      {/* ── Expanded card overlay (live React component) ───────────────────── */}
      <ExpandedCard
        card={selectedIdx !== null ? cards[selectedIdx] : null}
        visible={expandedVisible}
        expandedScale={expandedScale}
      />

      {/* ── Return to home — top left (visible when gallery in view, no card selected) */}
      <button
        aria-label="Back to home"
        onClick={() => transitionTo('/')}
        style={{
          position: 'fixed',
          top: '1.55rem',
          left: '2rem',
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
          opacity: (inView && !navVisible) ? 1 : 0,
          transform: (inView && !navVisible) ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'opacity 400ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), color 260ms ease',
          pointerEvents: (inView && !navVisible) ? 'auto' : 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,237,224,0.9)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,237,224,0.44)' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M7 1.5L2.5 5L7 8.5M2.5 5H9" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        home
      </button>

      {/* ── Return to carousel — top left ─────────────────────────────────── */}
      <button
        aria-label="Back to carousel"
        onClick={() => setSelectedIdx(null)}
        style={{
          position: 'fixed',
          top: '1.55rem',
          left: '2rem',
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
          transform: navVisible ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'opacity 400ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), color 260ms ease',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,237,224,0.9)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,237,224,0.44)'}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M7 1.5L2.5 5L7 8.5M2.5 5H9" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        back
      </button>

      {/* ── Left + navigation ─────────────────────────────────────────────── */}
      <button
        aria-label="Previous card"
        onClick={() => { navigateTo(-1); setLeftRot(r => r + 90); }}
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          opacity: navVisible ? (atStart ? 0.14 : 0.65) : 0,
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atStart) { e.currentTarget.style.color = GOLD; e.currentTarget.style.opacity = '1'; } }}
        onMouseLeave={e => { if (!atStart) { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '0.65'; } }}
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
        onClick={() => { navigateTo(1); setRightRot(r => r + 90); }}
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          opacity: navVisible ? (atEnd ? 0.14 : 0.65) : 0,
          transition: 'opacity 420ms ease, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { if (!atEnd) { e.currentTarget.style.color = GOLD; e.currentTarget.style.opacity = '1'; } }}
        onMouseLeave={e => { if (!atEnd) { e.currentTarget.style.color = 'white'; e.currentTarget.style.opacity = '0.65'; } }}
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
        left: 0, right: 0,
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
            ? `${String(selectedIdx + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`
            : ''
          }
        </p>
      </div>

      {/* ── "Use this card" CTA — bottom left ─────────────────────────────── */}
      <button
        aria-label={`Use ${cards[selectedIdx]?.name ?? 'this'} card`}
        onClick={() => transitionTo(`/card/new?preset=${cards[selectedIdx]?.id}`)}
        style={{
          position: 'fixed',
          bottom: '1.55rem',
          left: '2rem',
          zIndex: 20,
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
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 480ms ease, transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 280ms ease, color 220ms ease, border-color 220ms ease',
          pointerEvents: navVisible ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          whiteSpace: 'nowrap',
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
        Use this card
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

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
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => { setSelectedIdx(i); snapToCard(i); }}
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
              <card.Component />
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
        opacity: (inView && !interacted) ? 0.35 : 0,
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
  );
}
