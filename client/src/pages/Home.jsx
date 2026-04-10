import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const isTouch = () => window.matchMedia('(hover: none)').matches

// ─── Particle helpers ─────────────────────────────────────────────────────────
const PETAL_COLORS = ['#c9788a','#d4909e','#e8b4bc','#c47a6e','#d4a090','#b8848c']
const GRASS_DARK = ['#3a5020','#2e4018','#4a6028']
const GRASS_LIGHT = ['#8aaa70','#9aba80','#7a9a60']

function makePetal(w, h, fromX, fromY, burst = false) {
  const angle = Math.random() * Math.PI * 2
  const speed = burst ? 2.5 + Math.random() * 3.5 : 0.4 + Math.random() * 0.7
  return {
    kind: 'petal',
    x: fromX ?? (Math.random() * w * 1.2 - w * 0.1),
    y: fromY ?? (Math.random() * h * 0.85),
    vx: burst ? Math.cos(angle) * speed : speed,
    vy: burst ? Math.sin(angle) * speed : -0.05 + Math.random() * 0.18,
    burstDecay: burst ? 0.92 : 1,
    burstDone: !burst,
    angle: Math.random() * Math.PI * 2,
    angleV: (Math.random() - 0.5) * 0.018,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.005 + Math.random() * 0.008,
    swayAmp: 0.25 + Math.random() * 0.45,
    size: burst ? 4 + Math.random() * 7 : 5 + Math.random() * 9,
    opacity: burst ? 0.6 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    type: Math.floor(Math.random() * 3),
  }
}

function makeGrassShard(w, h) {
  const dark = Math.random() > 0.4
  return {
    kind: 'grass',
    x: Math.random() * w * 1.2 - w * 0.1,
    y: Math.random() * h * 0.88,
    vx: 0.2 + Math.random() * 0.4,
    vy: -0.01 + Math.random() * 0.05,
    burstDone: true,
    angle: -0.35 + Math.random() * 0.7,
    angleV: (Math.random() - 0.5) * 0.004,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.003 + Math.random() * 0.004,
    swayAmp: 0.08 + Math.random() * 0.16,
    length: 18 + Math.random() * 26,
    opacity: dark ? 0.5 + Math.random() * 0.3 : 0.32 + Math.random() * 0.22,
    color: dark
      ? GRASS_DARK[Math.floor(Math.random() * GRASS_DARK.length)]
      : GRASS_LIGHT[Math.floor(Math.random() * GRASS_LIGHT.length)],
    width: dark ? 1.4 : 0.9,
  }
}


// Grass burst — sideways scatter like wind catching loose blades
function makeGrassBurst(w, h, fromX, fromY) {
  const dark = Math.random() > 0.4
  const leftBias = fromX > w / 2 ? -1 : 1
  const spreadAngle = (Math.random() - 0.3) * Math.PI * 0.7
  const speed = 1.8 + Math.random() * 2.8
  return {
    kind: 'grass',
    x: fromX, y: fromY,
    vx: Math.cos(spreadAngle) * speed * leftBias,
    vy: Math.sin(spreadAngle) * speed - 0.8 - Math.random() * 1.2,
    burstDecay: 0.94, burstDone: false,
    angle: Math.random() * Math.PI * 2,
    angleV: (Math.random() - 0.5) * 0.04,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.003 + Math.random() * 0.004,
    swayAmp: 0.08 + Math.random() * 0.14,
    length: 14 + Math.random() * 20,
    opacity: dark ? 0.55 + Math.random() * 0.3 : 0.35 + Math.random() * 0.2,
    color: dark ? GRASS_DARK[Math.floor(Math.random() * GRASS_DARK.length)] : GRASS_LIGHT[Math.floor(Math.random() * GRASS_LIGHT.length)],
    width: dark ? 1.4 : 0.85,
  }
}

function drawParticle(ctx, p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.angle)
  ctx.globalAlpha = p.opacity
  if (p.kind === 'grass') {
    ctx.strokeStyle = p.color
    ctx.lineWidth = p.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, p.length / 2)
    ctx.quadraticCurveTo(p.width * 4, 0, 0, -p.length / 2)
    ctx.stroke()
  } else {
    ctx.fillStyle = p.color
    ctx.beginPath()
    if (p.type === 0) {
      ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2)
    } else if (p.type === 1) {
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2)
    } else {
      ctx.moveTo(0, -p.size)
      ctx.bezierCurveTo(p.size*0.6,-p.size*0.4,p.size*0.6,p.size*0.4,0,p.size)
      ctx.bezierCurveTo(-p.size*0.6,p.size*0.4,-p.size*0.6,-p.size*0.4,0,-p.size)
    }
    ctx.fill()
  }
  ctx.restore()
}

// ─── Combined canvas — petals + grass shards ──────────────────────────────────
function ParticleCanvas({ burstRef }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const dimsRef = useRef({ w: 0, h: 0 })
  const rafRef = useRef(null)

  // Expose burst function via ref
  burstRef.current = (x, y, grassBurst = false) => {
    const { w, h } = dimsRef.current
    const burst = grassBurst
      ? Array.from({ length: 8 }, () => makeGrassBurst(w, h, x, y))
      : Array.from({ length: 9 }, () => makePetal(w, h, x, y, true))
    particlesRef.current.push(...burst)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const init = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h
      dimsRef.current = { w, h }
      const petals = Array.from({ length: 20 }, () => makePetal(w, h))
      const grass = Array.from({ length: 18 }, () => makeGrassShard(w, h))
      particlesRef.current = [...petals, ...grass]
    }
    init()

    const tick = () => {
      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)
      particlesRef.current.forEach(p => {
        if (!p.burstDone) {
          p.vx *= p.burstDecay
          p.vy *= p.burstDecay
          if (Math.abs(p.vx) < 1.2 && Math.abs(p.vy) < 0.8) {
            p.vx = 0.4 + Math.random() * 0.5
            p.vy = -0.05 + Math.random() * 0.15
            p.burstDone = true
          }
        }
        p.sway += p.swaySpeed
        p.x += p.vx + (p.burstDone ? Math.sin(p.sway) * p.swayAmp : 0)
        p.y += p.vy + (p.burstDone ? Math.cos(p.sway * 0.7) * 0.1 : 0)
        p.angle += p.angleV
        if (p.x > w + 30) { p.x = -30; p.y = Math.random() * h * 0.88 }
        if (p.y < -30) p.y = h + 30
        if (p.y > h + 30) p.y = -30
        drawParticle(ctx, p)
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => { init() }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', () => setTimeout(onResize, 150))
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none' }}/>
}

// ─── Branch paths ─────────────────────────────────────────────────────────────
const BRANCH_PATHS = [
  "M -10,820 C 60,760 130,700 200,640 C 270,580 310,530 340,480 C 370,430 375,390 360,340",
  "M 200,640 C 260,600 330,570 400,530 C 460,498 520,470 580,430",
  "M 400,530 C 440,500 470,465 500,420 C 520,392 530,368 525,340",
  "M 280,560 C 320,535 365,515 410,500 C 445,488 480,482 515,478",
  "M 340,480 C 350,455 355,425 345,395 C 338,372 325,355 315,335",
  "M 360,340 C 375,315 395,295 415,272 C 430,255 445,240 452,218",
  "M 525,340 C 535,315 548,292 558,268 C 566,248 570,228 565,205",
  "M 580,430 C 610,408 645,390 678,368 C 702,352 722,335 735,310",
  "M 315,335 C 308,318 298,302 285,288",
  "M 315,335 C 322,316 328,298 332,278",
  "M 452,218 C 445,200 438,182 428,165",
  "M 452,218 C 462,200 472,182 480,162",
  "M 1440,120 C 1380,150 1310,185 1240,225 C 1185,258 1138,290 1095,320",
  "M 1240,225 C 1210,258 1182,292 1158,328 C 1140,355 1128,380 1120,408",
  "M 1095,320 C 1070,348 1048,378 1030,410",
  "M 1158,328 C 1145,355 1130,380 1115,405",
  "M 1300,200 C 1285,228 1268,255 1248,278",
]
const BRANCH_WIDTHS = [8,5.5,3.5,3,2.5,2,1.8,2.2,1.4,1.4,1.2,1.2,5,3.2,2,1.5,1.8]

// ─── Ground meadow data — 3 depth layers ─────────────────────────────────────
// Layer 1: Far background — short, pale, low opacity (baseY 870)
// Layer 2: Mid ground — medium height, medium opacity (baseY 880)
// Layer 3: Foreground — tall, dense, full opacity (baseY 895)

const GROUND_LAYERS = (() => {
  const layers = []

  // LAYER 1 — background, short pale wisps, baseY 865
  for (let i = 0; i < 40; i++) {
    layers.push({
      x: (i / 39) * 1440 + (Math.random() * 30 - 15),
      h: 35 + Math.random() * 45,
      baseY: 865,
      color: GRASS_LIGHT[i % 3],
      w: 0.7, op: 0.28, type: 0, layer: 1,
      phase: Math.random() * Math.PI * 2,       // random start offset
      freq: 0.3 + Math.random() * 0.25,         // individual sway speed
      amp: 0.015 + Math.random() * 0.012,       // individual sway amount
    })
  }

  // LAYER 2 — mid ground, medium blades, baseY 878
  for (let i = 0; i < 55; i++) {
    const dark = i % 3 !== 0
    layers.push({
      x: (i / 54) * 1440 + (Math.random() * 22 - 11),
      h: 70 + Math.random() * 80,
      baseY: 878,
      color: dark ? GRASS_DARK[i % 3] : GRASS_LIGHT[i % 3],
      w: dark ? 1.6 : 1.0, op: dark ? 0.55 : 0.38, type: 0, layer: 2,
      phase: Math.random() * Math.PI * 2,
      freq: 0.4 + Math.random() * 0.3,
      amp: 0.02 + Math.random() * 0.015,
    })
  }
  // Mid reeds
  for (let i = 0; i < 16; i++) {
    layers.push({
      x: 45 + i * 88 + Math.random() * 35,
      h: 130 + Math.random() * 80,
      baseY: 878,
      color: '#4a7030', w: 1.8, op: 0.5, type: 1, layer: 2,
      phase: Math.random() * Math.PI * 2,
      freq: 0.25 + Math.random() * 0.2,
      amp: 0.025 + Math.random() * 0.015,
    })
  }

  // LAYER 3 — foreground, tall dense, baseY 900 (bottom edge)
  for (let i = 0; i < 70; i++) {
    const dark = i % 2 === 0
    layers.push({
      x: (i / 69) * 1440 + (Math.random() * 18 - 9),
      h: 100 + Math.random() * 130,
      baseY: 900,
      color: dark ? GRASS_DARK[i % 3] : GRASS_LIGHT[i % 3],
      w: dark ? 2.2 : 1.3, op: dark ? 0.80 : 0.58, type: 0, layer: 3,
      phase: Math.random() * Math.PI * 2,
      freq: 0.35 + Math.random() * 0.3,
      amp: 0.025 + Math.random() * 0.02,
    })
  }
  // Tall foreground reeds
  for (let i = 0; i < 22; i++) {
    layers.push({
      x: 30 + i * 66 + Math.random() * 28,
      h: 180 + Math.random() * 90,
      baseY: 900,
      color: '#3a6020', w: 2.5, op: 0.72, type: 1, layer: 3,
      phase: Math.random() * Math.PI * 2,
      freq: 0.22 + Math.random() * 0.18,
      amp: 0.03 + Math.random() * 0.018,
    })
  }
  // Extra fine wisps foreground
  for (let i = 0; i < 35; i++) {
    layers.push({
      x: 10 + i * 41 + Math.random() * 18,
      h: 80 + Math.random() * 80,
      baseY: 900,
      color: GRASS_LIGHT[i % 3], w: 0.9, op: 0.45, type: 0, layer: 3,
      phase: Math.random() * Math.PI * 2,
      freq: 0.4 + Math.random() * 0.35,
      amp: 0.018 + Math.random() * 0.014,
    })
  }

  return layers
})()

// Flowers — layered across depths
const FLOWER_HEADS = (() => {
  const flowers = []

  // Background small daisies — layer 1
  for (let i = 0; i < 10; i++) {
    flowers.push({
      x: 60 + i * 140 + Math.random() * 40,
      stemH: 40 + Math.random() * 30,
      baseY: 865, layer: 1,
      type: 'daisy',
      color: '#f5edc8', scale: 0.6,
    })
  }

  // Mid ground — clover clusters + small wildflowers — layer 2
  for (let i = 0; i < 14; i++) {
    flowers.push({
      x: 40 + i * 100 + Math.random() * 35,
      stemH: 60 + Math.random() * 50,
      baseY: 878, layer: 2,
      type: i % 3 === 0 ? 'clover' : i % 3 === 1 ? 'daisy' : 'wildflower',
      color: i%4===0?'#c97888':i%4===1?'#b8d070':i%4===2?'#e8c840':'#d4a070',
      scale: 0.75,
    })
  }

  // Foreground — tall dandelions + big clover + poppies — layer 3
  for (let i = 0; i < 20; i++) {
    flowers.push({
      x: 30 + i * 72 + Math.random() * 28,
      stemH: 100 + Math.random() * 100,
      baseY: 900, layer: 3,
      type: i % 4 === 0 ? 'dandelion' : i % 4 === 1 ? 'clover' : i % 4 === 2 ? 'poppy' : 'daisy',
      color: i%5===0?'#c97888':i%5===1?'#d4909e':i%5===2?'#e8c840':i%5===3?'#b8d890':'#f0a870',
      scale: 1.0,
      // Pre-computed dandelion ray lengths — fixed so they never re-randomise on render
      rays: Array.from({length: 18}, () => 11 + Math.random() * 6),
    })
  }

  return flowers
})()


// ─── Ground grass canvas — runs its own RAF, zero React re-renders ────────────
function GrassCanvas({ drawProgressRef, swayTRef }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)
    window.addEventListener('orientationchange', () => setTimeout(setSize, 150))

    // Pre-parse colors once
    const parsedLayers = GROUND_LAYERS.map(b => ({ ...b }))
    const parsedFlowers = FLOWER_HEADS.map(f => ({ ...f }))

    const scaleX = window.innerWidth / 1440
    const scaleY = window.innerHeight / 900

    const tick = () => {
      const dp = drawProgressRef.current
      const t = swayTRef.current
      const w = canvas.width
      const h = canvas.height
      const sx = w / 1440
      const sy = h / 900

      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = dp

      // Draw grass blades
      parsedLayers.forEach(b => {
        const bladeSway = Math.sin(t * b.freq + b.phase) * b.amp * b.h
        const baseX = b.x * sx
        const baseY = b.baseY * sy
        const tipX = baseX + bladeSway * sx
        const tipY = baseY - b.h * sy
        const ctrlX = baseX + bladeSway * 0.55 * sx
        const ctrlY = baseY - b.h * 0.56 * sy

        ctx.beginPath()
        ctx.moveTo(baseX, baseY)
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY)
        ctx.strokeStyle = b.color
        ctx.lineWidth = b.w
        ctx.globalAlpha = dp * b.op
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      // Draw flower heads
      parsedFlowers.forEach(f => {
        const swayScale = f.layer === 1 ? 0.5 : f.layer === 2 ? 0.8 : 1.0
        // Find matching blade for phase — use index-based fallback
        const fs = Math.sin(t * 0.4 * swayScale + (f.x % (Math.PI * 2))) * f.stemH * 0.035
        const baseY = f.baseY * sy
        const fx = (f.x + fs) * sx
        const fy = baseY - f.stemH * sy
        const sc = f.scale * Math.min(sx, sy)

        ctx.globalAlpha = dp * (f.layer === 1 ? 0.6 : f.layer === 2 ? 0.78 : 0.92)

        if (f.type === 'daisy') {
          for (let j = 0; j < 8; j++) {
            const a = (j / 8) * Math.PI * 2
            const pr = 6 * sc
            ctx.beginPath()
            ctx.ellipse(fx + Math.cos(a)*pr, fy + Math.sin(a)*pr, 3.2*sc, 1.5*sc, a, 0, Math.PI*2)
            ctx.fillStyle = f.color
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(fx, fy, 3.2*sc, 0, Math.PI*2)
          ctx.fillStyle = '#e8c030'
          ctx.fill()
        }

        else if (f.type === 'clover') {
          for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2
            ctx.beginPath()
            ctx.arc(fx + Math.cos(a)*4*sc, fy + Math.sin(a)*4*sc, 4.5*sc, 0, Math.PI*2)
            ctx.fillStyle = f.color
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(fx, fy, 3.5*sc, 0, Math.PI*2)
          ctx.fillStyle = f.color
          ctx.fill()
          ctx.beginPath()
          ctx.arc(fx, fy, 1.5*sc, 0, Math.PI*2)
          ctx.fillStyle = '#fff8e0'
          ctx.globalAlpha = dp * 0.55
          ctx.fill()
        }

        else if (f.type === 'dandelion') {
          const rays = f.rays ?? Array.from({length:18}, () => 13)
          rays.forEach((r2, j) => {
            const a = (j / rays.length) * Math.PI * 2
            const r1 = 4.5 * sc
            const r2s = r2 * sc
            ctx.beginPath()
            ctx.moveTo(fx + Math.cos(a)*r1, fy + Math.sin(a)*r1)
            ctx.lineTo(fx + Math.cos(a)*r2s, fy + Math.sin(a)*r2s)
            ctx.strokeStyle = '#8aaa50'
            ctx.lineWidth = 1.1 * sc
            ctx.globalAlpha = dp * 0.9
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(fx + Math.cos(a)*r2s, fy + Math.sin(a)*r2s, 2*sc, 0, Math.PI*2)
            ctx.fillStyle = '#c8d870'
            ctx.globalAlpha = dp * 0.95
            ctx.fill()
          })
          ctx.beginPath()
          ctx.arc(fx, fy, 4.5*sc, 0, Math.PI*2)
          ctx.fillStyle = '#b8c850'
          ctx.globalAlpha = dp * 0.92
          ctx.fill()
        }

        else if (f.type === 'poppy') {
          for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2
            ctx.beginPath()
            ctx.ellipse(fx + Math.cos(a)*6*sc, fy + Math.sin(a)*6*sc, 7*sc, 5*sc, a, 0, Math.PI*2)
            ctx.fillStyle = f.color
            ctx.globalAlpha = dp * 0.72
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(fx, fy, 4.5*sc, 0, Math.PI*2)
          ctx.fillStyle = '#2a1a0e'
          ctx.globalAlpha = dp * 0.55
          ctx.fill()
        }

        else {
          // wildflower
          for (let j = 0; j < 5; j++) {
            const a = (j / 5) * Math.PI * 2
            ctx.beginPath()
            ctx.ellipse(fx + Math.cos(a)*5.5*sc, fy + Math.sin(a)*5.5*sc, 3.2*sc, 2*sc, a + Math.PI/2, 0, Math.PI*2)
            ctx.fillStyle = f.color
            ctx.globalAlpha = dp * 0.74
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(fx, fy, 2.8*sc, 0, Math.PI*2)
          ctx.fillStyle = '#f0d080'
          ctx.globalAlpha = dp * 0.85
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setSize)
      window.removeEventListener('orientationchange', setSize)
    }
  }, [])

  return <canvas ref={canvasRef}
    style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none' }}/>
}

// ─── SVG background ───────────────────────────────────────────────────────────
function BlossomBackground({ drawProgress }) {
  // Branch sway uses CSS animations — no JS needed, smooth 60fps with no re-renders

  return (
    <svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1 }}>
      <defs>
        <filter id="paper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n" result="g"/>
          <feBlend in="SourceGraphic" in2="g" mode="multiply" result="b"/>
          <feComposite in="b" in2="SourceGraphic" operator="in"/>
        </filter>
        <filter id="inkblur"><feGaussianBlur stdDeviation="0.6"/></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="8"/></filter>
        <linearGradient id="parchment" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5ede0"/>
          <stop offset="40%" stopColor="#ede0cc"/>
          <stop offset="100%" stopColor="#e8d8bf"/>
        </linearGradient>
        <radialGradient id="lightpool" cx="62%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#fffdf5" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#e8d8bf" stopOpacity="0"/>
        </radialGradient>
        {/* Sage green ground fade — from bottom, covering bottom ~25% */}
        <linearGradient id="groundfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a8850" stopOpacity="0"/>
          <stop offset="100%" stopColor="#4a6830" stopOpacity="0.18"/>
        </linearGradient>
      </defs>
      <style>{`
        @keyframes branchSwayLeft {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(2.5deg); }
          60% { transform: rotate(-1.5deg); }
          80% { transform: rotate(1deg); }
        }
        @keyframes branchSwayRight {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          55% { transform: rotate(1.5deg); }
          75% { transform: rotate(-0.8deg); }
        }
      `}</style>

      {/* Parchment */}
      <rect width="1440" height="900" fill="url(#parchment)"/>
      <rect width="1440" height="900" fill="url(#lightpool)"/>
      <rect width="1440" height="900" fill="url(#parchment)" filter="url(#paper)" opacity="0.08"/>

      {/* Sage ground wash — bottom 30% of screen */}
      <rect x="0" y="630" width="1440" height="270" fill="url(#groundfade)" opacity={drawProgress}/>
      <ellipse cx="720" cy="900" rx="900" ry="80" fill="#5a7840" opacity={0.1 * drawProgress} filter="url(#glow)"/>

      {/* Left branch group — sways gently, pivoting from root at bottom-left */}
      <g style={{ transformOrigin:'-10px 820px', animation:'branchSwayLeft 8s ease-in-out infinite' }}>
        {BRANCH_PATHS.slice(0,12).map((d,i) => (
          <path key={`g${i}`} d={d} stroke="#2a1a0e"
            strokeWidth={BRANCH_WIDTHS[i]||2} fill="none" strokeLinecap="round" opacity="0.06"/>
        ))}
        {BRANCH_PATHS.slice(0,12).map((d,i) => {
          const start = i < 4 ? 0 : i < 8 ? 0.12 : 0.25
          const lp = Math.max(0, Math.min(1, (drawProgress - start) / (1 - start)))
          return (
            <path key={`ink${i}`} d={d} stroke="#2a1a0e"
              strokeWidth={BRANCH_WIDTHS[i]||2} fill="none" strokeLinecap="round"
              filter={i < 4 ? "url(#inkblur)" : undefined}
              opacity={(i<2?0.82:i<6?0.65:0.5)*lp}
              style={{ strokeDasharray:2000, strokeDashoffset:2000*(1-lp) }}
            />
          )
        })}
      </g>

      {/* Right branch group — sways with slight phase offset, pivoting from top-right */}
      <g style={{ transformOrigin:'1440px 120px', animation:'branchSwayRight 9s ease-in-out infinite' }}>
        {BRANCH_PATHS.slice(12).map((d,i) => (
          <path key={`gr${i}`} d={d} stroke="#2a1a0e"
            strokeWidth={BRANCH_WIDTHS[i+12]||2} fill="none" strokeLinecap="round" opacity="0.06"/>
        ))}
        {BRANCH_PATHS.slice(12).map((d,i) => {
          const lp = Math.max(0, Math.min(1, (drawProgress - 0.12) / 0.88))
          return (
            <path key={`inkr${i}`} d={d} stroke="#2a1a0e"
              strokeWidth={BRANCH_WIDTHS[i+12]||2} fill="none" strokeLinecap="round"
              filter="url(#inkblur)"
              opacity={0.62*lp}
              style={{ strokeDasharray:2000, strokeDashoffset:2000*(1-lp) }}
            />
          )
        })}
      </g>

      {/* Blossoms — wrapped in matching branch sway */}
      <g style={{ transformOrigin:'-10px 820px', animation:'branchSwayLeft 8s ease-in-out infinite' }}>
      {[
        [362,338,1.1],[348,393,0.95],[318,332,0.9],[288,286,0.85],[332,276,0.8],
        [455,216,1.05],[430,163,0.88],[480,160,0.82],[415,270,0.92],[528,338,0.88],
        [566,203,0.78],[525,476,0.92],[500,418,0.85],[518,478,0.78],[580,428,0.9],
        [737,308,0.82],[580,348,0.75],[410,498,0.88],
      ].map(([cx,cy,s],i) => {
        const bp = Math.max(0,(drawProgress-0.45)/0.55)
        return (
          <g key={`bl${i}`} transform={`translate(${cx},${cy}) scale(${s})`} opacity={bp}>
            {[0,72,144,216,288].map((a,j) => {
              const r=a*Math.PI/180,px=Math.cos(r)*9,py=Math.sin(r)*9
              return <ellipse key={j} cx={px} cy={py} rx="5.5" ry="3.2"
                fill={i%4===0?'#c97888':i%4===1?'#d4909e':i%4===2?'#e8b8c4':'#bf7080'}
                opacity="0.88" transform={`rotate(${a+90},${px},${py})`}/>
            })}
            <circle r="3.5" fill="#f0d080" opacity="0.9"/>
            <circle r="1.5" fill="#c87840" opacity="0.85"/>
          </g>
        )
      })}

      </g>

      {/* Right branch blossoms — matching right sway */}
      <g style={{ transformOrigin:'1440px 120px', animation:'branchSwayRight 9s ease-in-out infinite' }}>
      {[[1095,318,0.9],[1120,406,0.85],[1160,326,0.88],[1116,403,0.78],[1030,408,0.82],[1250,276,0.75],[1300,198,0.8],[1240,224,0.85]].map(([cx,cy,s],i) => (
        <g key={`rb${i}`} transform={`translate(${cx},${cy}) scale(${s})`}
          opacity={Math.max(0,(drawProgress-0.55)/0.45)}>
          {[0,72,144,216,288].map((a,j) => {
            const r=a*Math.PI/180,px=Math.cos(r)*9,py=Math.sin(r)*9
            return <ellipse key={j} cx={px} cy={py} rx="5.5" ry="3.2"
              fill={i%3===0?'#d4909e':i%3===1?'#e0b0bc':'#c88090'}
              opacity="0.82" transform={`rotate(${a+90},${px},${py})`}/>
          })}
          <circle r="3.5" fill="#f0d080" opacity="0.88"/>
          <circle r="1.5" fill="#c87840" opacity="0.8"/>
        </g>
      ))}
      </g>

      {/* Fallen petals */}
      {[[180,858,22],[350,868,14],[520,862,18],[680,856,12],[840,864,16],[1000,858,20],[1160,866,13],[1320,855,17]].map(([x,y,s],i) => (
        <ellipse key={`fp${i}`} cx={x} cy={y} rx={s*0.4} ry={s*0.22}
          fill={i%3===0?'#c97888':i%3===1?'#d4a0a8':'#e8c0c8'}
          opacity={(0.2+i%3*0.06)*Math.max(0,(drawProgress-0.6)/0.4)}
          transform={`rotate(${i*28},${x},${y})`}/>
      ))}
    </svg>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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
  { type:'archive', label:'My creations',       desc:"Everything you've sent, in one place",               path:'/u/me' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const [touch] = useState(() => isTouch())
  const [drawProgress, setDrawProgress] = useState(0)
  const swayTRef = useRef(0)
  const drawProgressRef = useRef(0)
  const burstRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 20, damping: 16 })
  const springY = useSpring(mouseY, { stiffness: 20, damping: 16 })

  // 7s unified reveal
  useEffect(() => {
    const duration = 7000
    const start = performance.now()
    let raf
    const animate = now => {
      const t = Math.min((now - start) / duration, 1)
      const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
      setDrawProgress(eased)
      drawProgressRef.current = eased
      if (t < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Continuous sway clock — ref only, no re-render
  useEffect(() => {
    let raf
    const tick = () => { swayTRef.current += 0.016; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Mouse parallax — desktop only
  useEffect(() => {
    if (touch) return
    const onMove = e => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 12)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 7)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [touch])

  // Click to burst petals — background only
  const handleClick = e => {
    if (e.target.closest('button')) return
    const x = e.clientX ?? e.touches?.[0]?.clientX
    const y = e.clientY ?? e.touches?.[0]?.clientY
    if (x != null && burstRef.current) {
      const grassChance = Math.random() < 0.1 // 1 in 10
      burstRef.current(x, y, grassChance)
    }
  }

  const uiOpacity = Math.max(0, (drawProgress - 0.5) / 0.5)

  return (
    <div onClick={handleClick} onTouchStart={handleClick}
      style={{
        position:'relative', width:'100vw', height:'100dvh',
        overflow:'hidden', fontFamily:"'Jost', sans-serif",
        background:'#ede0cc', cursor:'default',
      }}>

      {/* Parallax background */}
      <motion.div style={{
        position:'absolute', inset:'-2%',
        x: touch ? 0 : springX,
        y: touch ? 0 : springY,
        zIndex:1,
      }}>
        <BlossomBackground drawProgress={drawProgress}/>
      </motion.div>

      {/* Particle canvas — petals + grass shards */}
      <ParticleCanvas burstRef={burstRef}/>

      {/* Ground grass canvas — independent RAF, per-blade sway */}
      <GrassCanvas drawProgressRef={drawProgressRef} swayTRef={swayTRef}/>

      {/* Vignette */}
      <div style={{
        position:'absolute', inset:0, zIndex:4, pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(100,70,30,0.13) 100%)',
      }}/>

      {/* UI — fades in with everything else */}
      <div style={{
        position:'relative', zIndex:5,
        width:'100%', height:'100%',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'space-between',
        padding:'clamp(2rem,5vh,3.8rem) clamp(1rem,4vw,2rem) clamp(1.5rem,4vh,2.8rem)',
        boxSizing:'border-box',
        pointerEvents:'none',
        opacity: uiOpacity,
      }}>

        {/* Header */}
        <div style={{ textAlign:'center' }}>
          <div style={{ marginBottom:'0.55rem' }}>
            <svg width="130" height="18" viewBox="0 0 160 18" fill="none" style={{ display:'block', margin:'0 auto' }}>
              <path d="M4,9 C12,5 28,4 50,9" stroke="#3d2510" strokeWidth="0.8" fill="none" opacity="0.45" strokeLinecap="round"/>
              <path d="M12,9 C14,5 18,3 22,5" stroke="#3d2510" strokeWidth="0.6" fill="none" opacity="0.35" strokeLinecap="round"/>
              {[0,72,144,216,288].map((a,i) => {
                const r=a*Math.PI/180
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
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:'clamp(3.2rem,9.5vw,7.5rem)',
            fontWeight:300, letterSpacing:'0.1em',
            color:'#1e1008', lineHeight:1,
            textShadow:'0 1px 18px rgba(245,235,210,0.5)',
          }}>Florabox</h1>
          <p style={{
            fontFamily:"'Jost', sans-serif",
            fontSize:'clamp(0.58rem,1.3vw,0.82rem)', fontWeight:300,
            letterSpacing:'clamp(0.12em,1.5vw,0.28em)',
            textTransform:'uppercase', color:'#3d2510',
            marginTop:'0.9rem', opacity:0.72,
          }}>Send a little joy today</p>
        </div>

        {/* Action cards */}
        <div
          style={{ display:'flex', flexDirection:'column', gap:'0.65rem', width:'100%', maxWidth:'860px',
            pointerEvents: uiOpacity > 0.5 ? 'auto' : 'none' }}
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
            <motion.button key={a.type}
              whileHover={touch ? {} : { y:-5, scale:1.022 }}
              whileTap={{ scale:0.975 }}
              transition={{
                scale:{ type:'tween', duration:0.15, ease:'easeOut' },
                y:{ type:'tween', duration:0.15, ease:'easeOut' },
              }}
              onClick={() => navigate(a.path)}
              style={{
                flex:'1 1 200px', maxWidth:'100%', minHeight:'64px',
                background:'rgba(248,240,225,0.82)',
                backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
                border:'0.8px solid rgba(140,100,60,0.2)', borderRadius:'4px',
                padding:'clamp(1rem,2.5vw,1.5rem) clamp(1rem,2.5vw,1.5rem) clamp(0.9rem,2vw,1.3rem)',
                cursor:'pointer', textAlign:'left', position:'relative',
                overflow:'hidden', willChange:'transform',
                display:'flex', alignItems:'flex-start', gap:'0.85rem',
              }}>
              <div style={{
                position:'absolute', top:0, left:'12%', right:'12%', height:'1px',
                background:'linear-gradient(90deg, transparent, rgba(140,100,60,0.35), transparent)',
              }}/>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                style={{ position:'absolute', top:6, right:6, opacity:0.12 }}>
                <path d="M22,0 C18,4 14,10 14,16 C14,18 15,20 16,22"
                  stroke="#3d2510" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <circle cx="16" cy="22" r="1.5" fill="#c97888"/>
              </svg>
              <div style={{ color:'#5a3018', opacity:0.75, flexShrink:0, marginTop:'0.1rem' }}>
                <CardIcon type={a.type}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:'clamp(1rem,2.5vw,1.18rem)', fontWeight:400,
                  color:'#1e1008', marginBottom:'0.2rem', letterSpacing:'0.02em',
                }}>{a.label}</p>
                <p style={{
                  fontFamily:"'Jost', sans-serif",
                  fontSize:'clamp(0.68rem,1.5vw,0.72rem)', fontWeight:300,
                  color:'#5a3018', letterSpacing:'0.04em', lineHeight:1.6, opacity:0.8,
                }}>{a.desc}</p>
                <div style={{
                  marginTop:'0.75rem', height:'0.8px',
                  background:'linear-gradient(90deg, rgba(140,100,60,0.22), rgba(140,100,60,0.08), transparent)',
                }}/>
                <p style={{
                  fontFamily:"'Jost', sans-serif",
                  fontSize:'0.62rem', fontWeight:300,
                  letterSpacing:'0.18em', textTransform:'uppercase',
                  color:'#7a4820', marginTop:'0.55rem', opacity:0.6,
                }}>Begin →</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <p style={{
          fontFamily:"'Jost', sans-serif",
          fontSize:'clamp(0.58rem,1.2vw,0.62rem)',
          letterSpacing:'0.2em', textTransform:'uppercase',
          color:'#3d2510', opacity:0.28, textAlign:'center', pointerEvents:'none',
        }}>Free forever · No account needed</p>
      </div>
    </div>
  )
}