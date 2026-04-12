import { useEffect, useRef } from 'react'

// ─── Tuning ────────────────────────────────────────────────────────────────────
const CELL         = 80          // grid cell size, px
const CROSS_ARM    = 6           // half-length of each arm of the + mark, px
const SPOTLIGHT_R  = 210         // cursor spotlight radius, px
const GOLD         = [201, 168, 76]  // warm gold RGB

// resting opacity
const REST_CROSS   = 0.07
const REST_LINE    = 0.04

// peak opacity (at cursor centre)
const PEAK_CROSS   = 0.58
const PEAK_LINE    = 0.30

// line weights
const LINE_W       = 0.35
const CROSS_W      = 0.6
const DASH         = [3, 9]

// ─── smoothstep: smooth S-curve from 1→0 over [0..r] ─────────────────────────
const smooth = (dist, r) => {
  const t = Math.min(1, dist / r)
  return 1 - (3 * t * t - 2 * t * t * t)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PatternCanvas({ touch = false }) {
  const canvasRef = useRef(null)
  const mouse     = useRef({ x: -9999, y: -9999 })
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const [gR, gG, gB] = GOLD

    // Size canvas to viewport (section is 100% × 100dvh)
    const setSize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    // Mouse tracking — desktop only, relative to canvas position
    let cleanupMouse = () => {}
    if (!touch) {
      const section = canvas.parentElement
      const onMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }
      const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
      section?.addEventListener('mousemove', onMove)
      section?.addEventListener('mouseleave', onLeave)
      cleanupMouse = () => {
        section?.removeEventListener('mousemove', onMove)
        section?.removeEventListener('mouseleave', onLeave)
      }
    }

    // ── Draw loop ──────────────────────────────────────────────────────────────
    const draw = () => {
      const W  = canvas.width
      const H  = canvas.height
      const mx = mouse.current.x
      const my = mouse.current.y

      ctx.clearRect(0, 0, W, H)

      const cols = Math.ceil(W / CELL) + 1
      const rows = Math.ceil(H / CELL) + 1

      // ── Dashed grid lines ──────────────────────────────────────────────────
      ctx.lineWidth = LINE_W
      ctx.setLineDash(DASH)

      // Horizontal lines — one segment per cell, opacity sampled at segment midpoint
      for (let r = 0; r < rows; r++) {
        const y = r * CELL
        for (let c = 0; c < cols - 1; c++) {
          const x1  = c * CELL
          const x2  = x1 + CELL
          const str = smooth(Math.hypot((x1 + x2) * 0.5 - mx, y - my), SPOTLIGHT_R)
          const a   = REST_LINE + str * (PEAK_LINE - REST_LINE)
          ctx.strokeStyle = `rgba(${gR},${gG},${gB},${a.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.stroke()
        }
      }

      // Vertical lines
      for (let c = 0; c < cols; c++) {
        const x = c * CELL
        for (let r = 0; r < rows - 1; r++) {
          const y1  = r * CELL
          const y2  = y1 + CELL
          const str = smooth(Math.hypot(x - mx, (y1 + y2) * 0.5 - my), SPOTLIGHT_R)
          const a   = REST_LINE + str * (PEAK_LINE - REST_LINE)
          ctx.strokeStyle = `rgba(${gR},${gG},${gB},${a.toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(x, y1)
          ctx.lineTo(x, y2)
          ctx.stroke()
        }
      }

      // ── Cross marks at each node ───────────────────────────────────────────
      ctx.lineWidth = CROSS_W
      ctx.setLineDash([])

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x   = c * CELL
          const y   = r * CELL
          const str = smooth(Math.hypot(x - mx, y - my), SPOTLIGHT_R)
          const a   = REST_CROSS + str * (PEAK_CROSS - REST_CROSS)
          const arm = CROSS_ARM + str * 2.5   // subtle grow in spotlight

          ctx.strokeStyle = `rgba(${gR},${gG},${gB},${a.toFixed(3)})`

          ctx.beginPath()
          ctx.moveTo(x - arm, y)
          ctx.lineTo(x + arm, y)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(x, y - arm)
          ctx.lineTo(x, y + arm)
          ctx.stroke()
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setSize)
      cleanupMouse()
    }
  }, [touch])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        zIndex:        1,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  )
}
