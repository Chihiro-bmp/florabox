import { useEffect, useRef, useState } from 'react'
import PatternCanvas from './PatternCanvas'
import { useTransition } from '../../context/TransitionContext'

// ─── Gold palette ──────────────────────────────────────────────────────────────
const G_WARM  = (a) => `rgba(201,168,76,${a})`
const G_ROSE  = (a) => `rgba(196,128,136,${a})`
const G_LIGHT = (a) => `rgba(224,202,148,${a})`

// ─── Background textures ───────────────────────────────────────────────────────
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

const WASHI_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23w)' opacity='1'/%3E%3C/svg%3E")`


// ─── Quotes ────────────────────────────────────────────────────────────────────
const QUOTES = [
  // top band
  { text: 'Even the briefest bloom leaves a trace.',   x: '6%',  y: '9%',  rot: -5, speed: 0.18, float: 9,  delay: 0.2, gold: 'warm',  bright: false },
  { text: '花落知多少',                                 x: '74%', y: '7%',  rot:  3, speed: 0.11, float: 12, delay: 0.9, gold: 'rose',  bright: true  },
  { text: 'The paper holds what words forget.',         x: '39%', y: '16%', rot: -2, speed: 0.25, float: 8,  delay: 1.4, gold: 'light', bright: false },
  // upper-middle
  { text: '春色满园关不住',                              x: '14%', y: '27%', rot:  4, speed: 0.13, float: 14, delay: 0.5, gold: 'rose',  bright: false },
  { text: 'Some moments are worth sending.',            x: '57%', y: '31%', rot: -3, speed: 0.20, float: 10, delay: 1.7, gold: 'warm',  bright: true  },
  // middle flanks — kept away from centre title
  { text: 'Folded with care, opened with joy.',         x: '2%',  y: '43%', rot:  5, speed: 0.14, float: 11, delay: 0.3, gold: 'light', bright: false },
  { text: '距离不远，心意常在',                           x: '72%', y: '46%', rot: -4, speed: 0.32, float: 7,  delay: 1.9, gold: 'warm',  bright: false },
  { text: 'A word that arrives at the right moment.',   x: '2%',  y: '57%', rot: -2, speed: 0.17, float: 9,  delay: 1.1, gold: 'rose',  bright: true  },
  { text: '寄情于笔，以花传心',                           x: '68%', y: '60%', rot:  3, speed: 0.21, float: 13, delay: 0.7, gold: 'light', bright: false },
  // lower-middle
  { text: 'A feeling, wrapped and given.',              x: '11%', y: '67%', rot:  2, speed: 0.20, float: 12, delay: 1.3, gold: 'warm',  bright: false },
  { text: 'ink dries, but warmth stays.',               x: '52%', y: '64%', rot: -6, speed: 0.15, float: 8,  delay: 0.6, gold: 'light', bright: true  },
  { text: '一花一世界',                                  x: '80%', y: '74%', rot:  4, speed: 0.22, float: 15, delay: 1.6, gold: 'rose',  bright: false },
  // bottom band
  { text: 'A quiet gesture, remembered long.',          x: '3%',  y: '80%', rot:  3, speed: 0.28, float: 10, delay: 2.2, gold: 'warm',  bright: false },
  { text: 'Every card is a small ceremony.',            x: '34%', y: '85%', rot: -2, speed: 0.12, float: 9,  delay: 0.7, gold: 'light', bright: true  },
  { text: 'beauty passes — the sending remains.',       x: '63%', y: '89%', rot: -5, speed: 0.18, float: 11, delay: 1.8, gold: 'rose',  bright: false },
  { text: '心花怒放',                                    x: '20%', y: '93%', rot:  6, speed: 0.15, float: 13, delay: 0.4, gold: 'warm',  bright: false },
]

function quoteColor(gold, bright) {
  const a = bright ? 0.86 : 0.44
  if (gold === 'rose')  return G_ROSE(a)
  if (gold === 'light') return G_LIGHT(a)
  return G_WARM(a)
}

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

// ─── Plum-blossom kamon (梅鉢紋) — traditional East Asian family crest ────────
function MonEmblem() {
  const petals = [0, 60, 120, 180, 240, 300].map(deg => {
    const rad = (deg - 90) * Math.PI / 180
    return { cx: 16 + Math.cos(rad) * 5.6, cy: 16 + Math.sin(rad) * 5.6 }
  })
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="rgba(201,168,76,0.22)" strokeWidth="0.7"/>
      <circle cx="16" cy="16" r="10.8" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5"/>
      {petals.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="2.5"
          fill="rgba(201,168,76,0.14)" stroke="rgba(201,168,76,0.38)" strokeWidth="0.65"/>
      ))}
      <circle cx="16" cy="16" r="1.7"
        fill="rgba(201,168,76,0.28)" stroke="rgba(201,168,76,0.5)" strokeWidth="0.5"/>
    </svg>
  )
}

export default function GalleryHero() {
  const { transitionTo }   = useTransition()
  const [touch]            = useState(() => isTouch())
  const [scrollY, setScrollY]         = useState(0)
  const [scrollCueVisible, setScrollCueVisible] = useState(false)
  const rafRef    = useRef(null)
  const sectionRef = useRef(null)

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
      ref={sectionRef}
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
      {/* Cross-grid pattern canvas — spotlight on cursor hover */}
      <PatternCanvas touch={touch} />

      {/* Washi paper texture */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: WASHI_SVG,
        backgroundSize: '300px 300px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }} />

      {/* Film grain */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 3,
        pointerEvents: 'none',
        backgroundImage: GRAIN_SVG,
        backgroundSize: '200px 200px',
        opacity: 0.045,
        mixBlendMode: 'overlay',
      }} />

      {/* Radial vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 4,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(4,2,1,0.72) 100%)',
      }} />


      {/* Floating quotes — 4-layer structure avoids transform conflicts:
            Layer 1 (outer div)  : position + JS parallax translateY
            Layer 2 (entry div)  : CSS quoteEntry animation (translateY, once)
            Layer 3 (rotate div) : static rotate() — no animation
            Layer 4 (p)          : quoteFade (opacity, once) + quoteFloat (translateY, ∞)
          Each transform lives on a different element → no CSS animation conflicts. */}
      {QUOTES.map((q, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: q.x,
            top: q.y,
            zIndex: 6,
            pointerEvents: 'none',
            transform: touch ? 'none' : `translateY(${scrollY * q.speed * -0.6}px)`,
          }}
        >
          {/* Euveka-style spring entry — slides down from -18px, slight overshoot */}
          <div style={{
            animation: `quoteEntry 900ms cubic-bezier(0.34,1.06,0.64,1) ${q.delay}s both`,
          }}>
            <div style={{ transform: `rotate(${q.rot}deg)` }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: q.bright
                  ? 'clamp(0.76rem, 1.5vw, 0.96rem)'
                  : 'clamp(0.64rem, 1.15vw, 0.8rem)',
                color: quoteColor(q.gold, q.bright),
                letterSpacing: '0.07em',
                whiteSpace: 'nowrap',
                margin: 0,
                userSelect: 'none',
                // quoteFade = opacity only, quoteFloat = translateY only → no conflict
                animation: `quoteFade 900ms ${q.delay}s both ease-out, quoteFloat ${q.float}s ease-in-out infinite`,
              }}>
                {q.text}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* ── Back to home — top left ───────────────────────────────────────────── */}
      <button
        aria-label="Back to home"
        onClick={() => transitionTo('/')}
        style={{
          position: 'absolute',
          top: '1.6rem',
          left: '2rem',
          zIndex: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.58rem',
          fontWeight: 300,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: G_WARM(0.45),
          transition: 'color 260ms ease',
          animation: 'quoteFade 700ms 0.6s both ease-out',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = G_WARM(0.9) }}
        onMouseLeave={e => { e.currentTarget.style.color = G_WARM(0.45) }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M7 1.5L2.5 5L7 8.5M2.5 5H9"
            stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        florabox
      </button>

      {/* Centre content */}
      <div style={{
        position: 'relative',
        zIndex: 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.9rem',
        textAlign: 'center',
        padding: '0 2rem',
      }}>
        {/* Mon emblem — plum blossom kamon, fades in before hairline */}
        <div style={{
          marginBottom: '0.2rem',
          animation: 'quoteFade 1000ms 0.3s both ease-out',
        }}>
          <MonEmblem />
        </div>

        {/* Top hairline — rose-gold → champagne gradient */}
        <div style={{
          width: '52px',
          height: '1px',
          background: 'linear-gradient(to right, rgba(196,128,136,0.08), rgba(196,128,136,0.6), rgba(224,202,148,0.7), rgba(196,128,136,0.6), rgba(196,128,136,0.08))',
          animation: 'quoteFade 900ms 0.5s both ease-out',
        }} />

        {/* Headline — entrance: lifts up + fades in */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(2.8rem, 5vw, 4rem)',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          margin: 0,
          color: 'rgba(220, 196, 148, 0.92)',
          animation: 'heroTitleEnter 1000ms cubic-bezier(0.16, 1, 0.3, 1) 0.65s both',
        }}>
          A Gallery of Feeling
        </h1>

        {/* Bottom hairline */}
        <div style={{
          width: '52px',
          height: '1px',
          background: 'linear-gradient(to right, rgba(196,128,136,0.08), rgba(196,128,136,0.6), rgba(224,202,148,0.7), rgba(196,128,136,0.6), rgba(196,128,136,0.08))',
          animation: 'quoteFade 900ms 0.8s both ease-out',
        }} />

        {/* Sub-caption */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 'clamp(0.48rem, 1vw, 0.58rem)',
          fontWeight: 300,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: G_WARM(0.32),
          margin: 0,
          animation: 'quoteFade 900ms 1.1s both ease-out',
        }}>
          preset cards &nbsp;·&nbsp; every occasion
        </p>

        {/* Scroll cue */}
        <div style={{
          marginTop: '1.4rem',
          opacity: scrollCueVisible ? 1 : 0,
          transition: 'opacity 800ms ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {touch ? (
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.58rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: G_WARM(0.5),
              margin: 0,
            }}>
              scroll to explore
            </p>
          ) : (
            <div style={{
              width: '1px',
              height: '24px',
              background: `linear-gradient(to bottom, ${G_ROSE(0.8)}, ${G_WARM(0.5)}, rgba(201,168,76,0))`,
              animation: 'scrollLinePulse 2s ease-in-out infinite',
            }} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes heroTitleEnter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes scrollLinePulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }

        /* Euveka-style spring entry — slides down from above with slight overshoot.
           cubic-bezier(0.34, 1.06, 0.64, 1) approximates Framer spring bounce:0.1 */
        @keyframes quoteEntry {
          from { transform: translateY(-18px); }
          to   { transform: translateY(0); }
        }

        /* Opacity fade lives on innermost p — separate element from quoteEntry div,
           so both can animate transform + opacity independently with no conflict */
        @keyframes quoteFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Ongoing gentle drift — translateY only, same element as quoteFade.
           No conflict because quoteFade only touches opacity. */
        @keyframes quoteFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }

      `}</style>
    </section>
  )
}
