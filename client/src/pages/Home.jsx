import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// --- Detect touch/hover capability ---
const isTouch = () => window.matchMedia('(hover: none)').matches

// --- Petal canvas system ---
const PETAL_COUNT = 22
const PETAL_COLORS = ['#c9788a','#d4909e','#e8b4bc','#c47a6e','#d4a090','#b8848c']

function initPetals(w, h) {
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    x: Math.random() * w * 1.2 - w * 0.1,
    y: Math.random() * h,
    vx: 0.4 + Math.random() * 0.7,
    vy: -0.05 + Math.random() * 0.18,
    angle: Math.random() * Math.PI * 2,
    angleV: (Math.random() - 0.5) * 0.018,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.005 + Math.random() * 0.008,
    swayAmp: 0.25 + Math.random() * 0.45,
    size: 5 + Math.random() * 9,
    opacity: 0.25 + Math.random() * 0.45,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    type: i % 3,
  }))
}

function drawPetal(ctx, p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.angle)
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color
  ctx.beginPath()
  if (p.type === 0) {
    ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2)
  } else if (p.type === 1) {
    ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2)
  } else {
    ctx.moveTo(0, -p.size)
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.6, p.size * 0.4, 0, p.size)
    ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.4, 0, -p.size)
  }
  ctx.fill()
  ctx.restore()
}

function PetalCanvas() {
  const canvasRef = useRef(null)
  const petalsRef = useRef(null)
  const rafRef = useRef(null)
  const dimsRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setSize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      dimsRef.current = { w, h }
      // Re-init petals on resize so they spread across new dimensions
      petalsRef.current = initPetals(w, h)
    }

    setSize()

    const tick = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)
      petalsRef.current.forEach(p => {
        p.sway += p.swaySpeed
        p.x += p.vx + Math.sin(p.sway) * p.swayAmp
        p.y += p.vy + Math.cos(p.sway * 0.7) * 0.15
        p.angle += p.angleV
        if (p.x > w + 20) { p.x = -20; p.y = Math.random() * h }
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
        drawPetal(ctx, p)
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('resize', setSize)
    window.addEventListener('orientationchange', () => setTimeout(setSize, 120))

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setSize)
      window.removeEventListener('orientationchange', setSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
    />
  )
}

// --- Ink blossom SVG background ---
function BlossomBackground() {
  return (
    <svg
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
    >
      <defs>
        <filter id="paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
        <filter id="inkblur"><feGaussianBlur stdDeviation="0.6"/></filter>
        <filter id="softglow"><feGaussianBlur stdDeviation="4"/></filter>
        <linearGradient id="parchment" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5ede0"/>
          <stop offset="40%" stopColor="#ede0cc"/>
          <stop offset="100%" stopColor="#e8d8bf"/>
        </linearGradient>
        <radialGradient id="lightpool" cx="62%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#fffdf5" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#e8d8bf" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#parchment)"/>
      <rect width="1440" height="900" fill="url(#lightpool)"/>
      <rect width="1440" height="900" fill="url(#parchment)" filter="url(#paper)" opacity="0.08"/>

      {/* Main branch — bottom-left rising */}
      <path d="M -10,820 C 60,760 130,700 200,640 C 270,580 310,530 340,480 C 370,430 375,390 360,340"
        stroke="#2a1a0e" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#inkblur)" opacity="0.82"/>
      <path d="M -10,820 C 60,760 130,700 200,640 C 270,580 310,530 340,480 C 370,430 375,390 360,340"
        stroke="#3d2510" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 200,640 C 260,600 330,570 400,530 C 460,498 520,470 580,430"
        stroke="#2a1a0e" strokeWidth="5.5" fill="none" strokeLinecap="round" filter="url(#inkblur)" opacity="0.78"/>
      <path d="M 400,530 C 440,500 470,465 500,420 C 520,392 530,368 525,340"
        stroke="#2a1a0e" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 280,560 C 320,535 365,515 410,500 C 445,488 480,482 515,478"
        stroke="#2a1a0e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M 340,480 C 350,455 355,425 345,395 C 338,372 325,355 315,335"
        stroke="#2a1a0e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.68"/>
      <path d="M 360,340 C 375,315 395,295 415,272 C 430,255 445,240 452,218"
        stroke="#2a1a0e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 525,340 C 535,315 548,292 558,268 C 566,248 570,228 565,205"
        stroke="#2a1a0e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55"/>
      <path d="M 580,430 C 610,408 645,390 678,368 C 702,352 722,335 735,310"
        stroke="#2a1a0e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.58"/>
      <path d="M 315,335 C 308,318 298,302 285,288" stroke="#2a1a0e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 315,335 C 322,316 328,298 332,278" stroke="#2a1a0e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 452,218 C 445,200 438,182 428,165" stroke="#2a1a0e" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M 452,218 C 462,200 472,182 480,162" stroke="#2a1a0e" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* Right corner branch */}
      <path d="M 1440,120 C 1380,150 1310,185 1240,225 C 1185,258 1138,290 1095,320"
        stroke="#2a1a0e" strokeWidth="5" fill="none" strokeLinecap="round" filter="url(#inkblur)" opacity="0.62"/>
      <path d="M 1240,225 C 1210,258 1182,292 1158,328 C 1140,355 1128,380 1120,408"
        stroke="#2a1a0e" strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.55"/>
      <path d="M 1095,320 C 1070,348 1048,378 1030,410" stroke="#2a1a0e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.48"/>
      <path d="M 1158,328 C 1145,355 1130,380 1115,405" stroke="#2a1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.42"/>
      <path d="M 1300,200 C 1285,228 1268,255 1248,278" stroke="#2a1a0e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* Blossoms — main branch */}
      {[
        [362,338,1.1],[348,393,0.95],[318,332,0.9],[288,286,0.85],[332,276,0.8],
        [455,216,1.05],[430,163,0.88],[480,160,0.82],[415,270,0.92],[528,338,0.88],
        [566,203,0.78],[525,476,0.92],[500,418,0.85],[518,478,0.78],[580,428,0.9],
        [737,308,0.82],[580,348,0.75],[410,498,0.88],
      ].map(([cx,cy,s],i) => (
        <g key={`b1_${i}`} transform={`translate(${cx},${cy}) scale(${s})`}>
          {[0,72,144,216,288].map((a,j) => {
            const rad = a * Math.PI / 180
            const px = Math.cos(rad)*9, py = Math.sin(rad)*9
            return <ellipse key={j} cx={px} cy={py} rx="5.5" ry="3.2"
              fill={i%4===0?'#c97888':i%4===1?'#d4909e':i%4===2?'#e8b8c4':'#bf7080'}
              opacity="0.88" transform={`rotate(${a+90},${px},${py})`}/>
          })}
          <circle r="3.5" fill="#f0d080" opacity="0.9"/>
          <circle r="1.5" fill="#c87840" opacity="0.85"/>
          {[0,60,120,180,240,300].map((a,j) => {
            const rad = a*Math.PI/180
            return <line key={j} x1={Math.cos(rad)*2} y1={Math.sin(rad)*2}
              x2={Math.cos(rad)*6} y2={Math.sin(rad)*6} stroke="#8a4820" strokeWidth="0.5" opacity="0.6"/>
          })}
        </g>
      ))}

      {/* Buds */}
      {[[375,390],[350,454],[400,528],[470,464],[540,400],[560,268],[490,215]].map(([cx,cy],i) => (
        <g key={`bud${i}`} transform={`translate(${cx},${cy})`}>
          <ellipse rx="3.5" ry="5.5" fill={i%2===0?'#c97888':'#d4a0a8'} opacity="0.8"/>
          <path d="M0,-5 C2,-3 2,0 0,3" stroke="#2a1a0e" strokeWidth="0.8" fill="none" opacity="0.5"/>
        </g>
      ))}

      {/* Blossoms — right branch */}
      {[[1095,318,0.9],[1120,406,0.85],[1160,326,0.88],[1116,403,0.78],[1030,408,0.82],[1250,276,0.75],[1300,198,0.8],[1240,224,0.85]].map(([cx,cy,s],i) => (
        <g key={`b2_${i}`} transform={`translate(${cx},${cy}) scale(${s})`}>
          {[0,72,144,216,288].map((a,j) => {
            const rad = a*Math.PI/180
            const px = Math.cos(rad)*9, py = Math.sin(rad)*9
            return <ellipse key={j} cx={px} cy={py} rx="5.5" ry="3.2"
              fill={i%3===0?'#d4909e':i%3===1?'#e0b0bc':'#c88090'}
              opacity="0.82" transform={`rotate(${a+90},${px},${py})`}/>
          })}
          <circle r="3.5" fill="#f0d080" opacity="0.88"/>
          <circle r="1.5" fill="#c87840" opacity="0.8"/>
        </g>
      ))}

      {/* Fallen petals */}
      {[[180,865,22],[320,880,14],[480,872,18],[620,868,12],[760,875,16],[900,870,20],[1050,878,13],[1200,865,17]].map(([x,y,s],i) => (
        <ellipse key={`fp${i}`} cx={x} cy={y} rx={s*0.4} ry={s*0.22}
          fill={i%3===0?'#c97888':i%3===1?'#d4a0a8':'#e8c0c8'}
          opacity={0.18+i%3*0.06} transform={`rotate(${i*28},${x},${y})`}/>
      ))}

      <ellipse cx="200" cy="720" rx="280" ry="200" fill="#c8a878" opacity="0.04" filter="url(#softglow)"/>
    </svg>
  )
}

// --- Icons ---
function CardIcon({ type }) {
  if (type === 'card') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="1.5"/>
      <path d="M2 9.5 L12 15 L22 9.5"/>
    </svg>
  )
  if (type === 'bouquet') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20 C12 20 6.5 16 6.5 11.5 C6.5 9 8.2 7.2 10 7.8 C11 8.2 12 9.5 12 9.5 C12 9.5 13 8.2 14 7.8 C15.8 7.2 17.5 9 17.5 11.5 C17.5 16 12 20 12 20Z"/>
      <path d="M9.5 7.8 C8.8 6.2 9.5 4.5 11 4.2"/>
      <path d="M14.5 7.8 C15.2 6.2 14.5 4.5 13 4.2"/>
      <path d="M11 4.2 C11.5 5.5 12 6.2 12 6.2 C12 6.2 12.5 5.5 13 4.2"/>
      <path d="M12 20 L10.5 23.5 M12 20 L13.5 23.5"/>
      <path d="M9.5 23.5 C10.5 23.8 13.5 23.8 14.5 23.5"/>
    </svg>
  )
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4 L20 4 L20 6 L4 6 Z"/>
      <path d="M5 6 L5 20 C5 20.6 5.4 21 6 21 L18 21 C18.6 21 19 20.6 19 20 L19 6"/>
      <path d="M9 11 C9 9.8 10.2 9 12 9 C13.8 9 15 9.8 15 11 C15 13 12 15 12 15 C12 15 9 13 9 11Z"/>
    </svg>
  )
}

const actions = [
  { type:'card',    label:'Make a wish card',  desc:'Choose a design, write your message, share the love', path:'/gallery' },
  { type:'bouquet', label:'Build a bouquet',    desc:'Pick flowers from the garden and wrap them up',       path:'/bouquet/new' },
  { type:'archive', label:'My creations',       desc:'Everything you\'ve sent, in one place',               path:'/u/me' },
]

export default function Home() {
  const navigate = useNavigate()
  const [touch] = useState(() => isTouch())
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 20, damping: 16 })
  const springY = useSpring(mouseY, { stiffness: 20, damping: 16 })

  useEffect(() => {
    if (touch) return
    const onMove = e => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 12)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 7)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [touch])

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh', // dvh accounts for mobile browser chrome
      overflow: 'hidden',
      fontFamily: "'Jost', sans-serif",
      background: '#ede0cc',
    }}>

      {/* Parallax background — disabled on touch */}
      <motion.div style={{
        position: 'absolute', inset: '-2%',
        x: touch ? 0 : springX,
        y: touch ? 0 : springY,
        zIndex: 1,
      }}>
        <BlossomBackground />
      </motion.div>

      <PetalCanvas />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(100,70,30,0.14) 100%)',
      }}/>

      {/* UI */}
      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: 'clamp(2rem, 5vh, 3.8rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vh, 2.8rem)',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '0.55rem' }}
          >
            <svg width="130" height="18" viewBox="0 0 160 18" fill="none"
              style={{ display: 'block', margin: '0 auto' }}>
              <path d="M4,9 C12,5 28,4 50,9" stroke="#3d2510" strokeWidth="0.8" fill="none" opacity="0.45" strokeLinecap="round"/>
              <path d="M12,9 C14,5 18,3 22,5" stroke="#3d2510" strokeWidth="0.6" fill="none" opacity="0.35" strokeLinecap="round"/>
              {[0,72,144,216,288].map((a,i) => {
                const r = a * Math.PI / 180
                return <ellipse key={i} cx={80+Math.cos(r)*5.5} cy={9+Math.sin(r)*5.5}
                  rx="2.8" ry="1.6" fill="#d4909e" opacity="0.55"
                  transform={`rotate(${a+90},${80+Math.cos(r)*5.5},${9+Math.sin(r)*5.5})`}/>
              })}
              <circle cx="80" cy="9" r="2.2" fill="#c97888" opacity="0.7"/>
              <circle cx="80" cy="9" r="1.2" fill="#e8c060" opacity="0.8"/>
              <path d="M156,9 C148,5 132,4 110,9" stroke="#3d2510" strokeWidth="0.8" fill="none" opacity="0.45" strokeLinecap="round"/>
              <path d="M148,9 C146,5 142,3 138,5" stroke="#3d2510" strokeWidth="0.6" fill="none" opacity="0.35" strokeLinecap="round"/>
              <ellipse cx="35" cy="7" rx="2" ry="3" fill="#c97888" opacity="0.45" transform="rotate(-20,35,7)"/>
              <ellipse cx="125" cy="7" rx="2" ry="3" fill="#c97888" opacity="0.45" transform="rotate(20,125,7)"/>
            </svg>
          </motion.div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3.2rem, 9.5vw, 7.5rem)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: '#1e1008',
            lineHeight: 1,
            textShadow: '0 1px 18px rgba(245,235,210,0.5)',
          }}>
            Florabox
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1.1 }}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 'clamp(0.58rem, 1.3vw, 0.82rem)',
              fontWeight: 300,
              letterSpacing: 'clamp(0.12em, 1.5vw, 0.28em)',
              textTransform: 'uppercase',
              color: '#3d2510',
              marginTop: '0.9rem',
              opacity: 0.72,
            }}
          >
            Send a little joy today
          </motion.p>
        </motion.div>

        {/* Action cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column', // stack vertically by default (mobile-first)
          gap: '0.65rem',
          width: '100%',
          maxWidth: '860px',
        }}
          // On wider screens, switch to row via inline style + a CSS trick
          ref={el => {
            if (!el) return
            const mq = window.matchMedia('(min-width: 640px)')
            const apply = () => {
              el.style.flexDirection = mq.matches ? 'row' : 'column'
              el.style.flexWrap = mq.matches ? 'wrap' : 'nowrap'
              el.style.justifyContent = mq.matches ? 'center' : 'stretch'
            }
            apply()
            mq.addEventListener('change', apply)
          }}
        >
          {actions.map((a, i) => (
            <motion.button
              key={a.type}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.13,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
                scale: { type: 'tween', duration: 0.15, ease: 'easeOut' },
                y: { type: 'tween', duration: 0.15, ease: 'easeOut' },
              }}
              whileHover={touch ? {} : { y: -5, scale: 1.022 }}
              whileTap={{ scale: 0.975 }}
              onClick={() => navigate(a.path)}
              style={{
                flex: '1 1 200px',
                maxWidth: '100%', // full width on mobile
                minHeight: '64px', // touch target
                background: 'rgba(248,240,225,0.78)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '0.8px solid rgba(140,100,60,0.2)',
                borderRadius: '4px',
                padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem) clamp(0.9rem, 2vw, 1.3rem)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                willChange: 'transform',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              {/* Top hairline */}
              <div style={{
                position: 'absolute', top: 0, left: '12%', right: '12%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(140,100,60,0.35), transparent)',
              }}/>

              {/* Corner mark */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                style={{ position: 'absolute', top: 6, right: 6, opacity: 0.12 }}>
                <path d="M22,0 C18,4 14,10 14,16 C14,18 15,20 16,22"
                  stroke="#3d2510" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <circle cx="16" cy="22" r="1.5" fill="#c97888"/>
              </svg>

              {/* Icon */}
              <div style={{ color: '#5a3018', opacity: 0.75, flexShrink: 0, marginTop: '0.1rem' }}>
                <CardIcon type={a.type} />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.18rem)',
                  fontWeight: 400, color: '#1e1008',
                  marginBottom: '0.2rem', letterSpacing: '0.02em',
                }}>
                  {a.label}
                </p>
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 'clamp(0.68rem, 1.5vw, 0.72rem)',
                  fontWeight: 300, color: '#5a3018',
                  letterSpacing: '0.04em', lineHeight: 1.6, opacity: 0.8,
                }}>
                  {a.desc}
                </p>
                <div style={{
                  marginTop: '0.75rem', height: '0.8px',
                  background: 'linear-gradient(90deg, rgba(140,100,60,0.22), rgba(140,100,60,0.08), transparent)',
                }}/>
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '0.62rem', fontWeight: 300,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#7a4820', marginTop: '0.55rem', opacity: 0.6,
                }}>
                  Begin →
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 'clamp(0.58rem, 1.2vw, 0.62rem)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#3d2510', opacity: 0.28,
            textAlign: 'center',
          }}
        >
          Free forever · No account needed
        </motion.p>
      </div>
    </div>
  )
}