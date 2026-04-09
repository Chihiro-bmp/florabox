import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Film-grain overlay
// ---------------------------------------------------------------------------
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

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
// Individual gallery card — JPG image in the track
// ---------------------------------------------------------------------------
function GalleryCard({ card, isSelected, onClick, onHoverChange }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-card="true"
      style={{
        position: 'relative',
        flexShrink: 0,
        cursor: 'pointer',
      }}
      onMouseEnter={() => { setHovered(true);  onHoverChange?.(true);  }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
      onClick={onClick}
    >
      <img
        className="gallery-img"
        src={card.src}
        draggable="false"
        alt={card.name}
        style={{
          width: '40vmin',
          height: '56vmin',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          borderRadius: '2px',
          outline: isSelected ? '1px solid rgba(245,237,224,0.32)' : '1px solid transparent',
          transition: 'outline-color 300ms ease',
        }}
      />

      {/* Hover / selected label */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '3.5vmin 2.2vmin 2.2vmin',
        background: 'linear-gradient(to bottom, transparent, rgba(5,3,1,0.88))',
        borderRadius: '0 0 2px 2px',
        opacity: (hovered || isSelected) ? 1 : 0,
        transition: 'opacity 380ms ease',
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
      transition: 'opacity 520ms ease',
    }}>
      {/* Semi-dark background */}
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
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'transform 650ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}>
          {/* Live card component */}
          <div style={{
            width:  `${w}px`,
            height: `${h}px`,
            overflow: 'hidden',
            borderRadius: '3px',
            boxShadow: '0 40px 120px rgba(0,0,0,0.85)',
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
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.6vw, 1.4rem)',
              fontWeight: 300,
              color: 'rgba(245,237,224,0.72)',
              letterSpacing: '0.06em',
            }}>
              {card.name}
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
  const navigate = useNavigate();
  const trackRef     = useRef(null);
  const trackAnimRef = useRef(null);

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

  const hoveredIdxRef  = useRef(null);
  const selectedIdxRef = useRef(null);
  const wheelThrottle  = useRef(false);

  selectedIdxRef.current = selectedIdx;

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
        { duration, fill: 'forwards', easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
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
    const clamped      = Math.max(Math.min(pct, 0), -100);

    currentPct.current = clamped;
    prevPct.current    = clamped;
    applyTrackPosition(clamped, 800);
  }, [applyTrackPosition]);

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
      const clamped  = Math.max(Math.min(raw, 0), -100);
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
    <div style={{
      position: 'relative',
      width: '100%',
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

      {/* Eyebrow label */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: '1.8rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.62rem',
          fontWeight: 300,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(245,237,224,0.52)',
        }}>
          Choose a card
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
          />
        ))}
      </div>
      </div>

      {/* ── Expanded card overlay (live React component) ───────────────────── */}
      <ExpandedCard
        card={selectedIdx !== null ? cards[selectedIdx] : null}
        visible={navVisible}
        expandedScale={expandedScale}
      />

      {/* ── Return to carousel — top left ─────────────────────────────────── */}
      <button
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
        onMouseEnter={e => { if (!atStart) e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { if (!atStart) e.currentTarget.style.opacity = '0.65'; }}
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
        onMouseEnter={e => { if (!atEnd) e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { if (!atEnd) e.currentTarget.style.opacity = '0.65'; }}
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
          color: 'white',
        }}>
          {selectedIdx !== null ? `${selectedIdx + 1} — ${cards.length}` : ''}
        </p>
      </div>

      {/* ── "Use this card" CTA — bottom left ─────────────────────────────── */}
      <button
        onClick={() => navigate(`/card/new?preset=${cards[selectedIdx]?.id}`)}
        style={{
          position: 'fixed',
          bottom: '1.7rem',
          left: '2rem',
          zIndex: 20,
          background: 'none',
          border: '0.5px solid rgba(245,237,224,0.28)',
          borderRadius: '2px',
          cursor: 'pointer',
          padding: '0.55rem 1.1rem',
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.6rem',
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(245,237,224,0.65)',
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 480ms ease, transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: navVisible ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(245,237,224,0.95)';
          e.currentTarget.style.borderColor = 'rgba(245,237,224,0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(245,237,224,0.65)';
          e.currentTarget.style.borderColor = 'rgba(245,237,224,0.28)';
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
              width: '39px',
              height: '52px',
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: '1px',
              cursor: 'pointer',
              opacity: selectedIdx === i ? 1 : 0.32,
              outline: selectedIdx === i
                ? '1px solid rgba(245,237,224,0.5)'
                : '1px solid transparent',
              transition: 'opacity 280ms ease, outline-color 280ms ease',
            }}
          >
            <img
              src={card.src}
              alt={card.name}
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
  );
}
