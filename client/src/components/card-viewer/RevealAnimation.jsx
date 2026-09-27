import { useEffect, useRef } from 'react';

const DURATION = 4200; // ms — particles spawn for the first ~60%, then drift out

// ─── Botanical: petals and small leaves spiral upward on a soft wind ─────────
function makePetal(w, h) {
  const leaf = Math.random() < 0.3;
  return {
    x: Math.random() * w,
    y: h + 20 + Math.random() * 60,
    size: 5 + Math.random() * 8,
    vy: -(1.2 + Math.random() * 1.8),
    swayAmp: 0.6 + Math.random() * 1.4,
    swayFreq: 0.012 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.06,
    color: leaf
      ? `rgba(${110 + Math.random() * 30},${130 + Math.random() * 25},${80 + Math.random() * 20},`
      : Math.random() < 0.6
        ? `rgba(${201},${120 + Math.random() * 20},${136 + Math.random() * 16},` // blush
        : `rgba(${214},${165 + Math.random() * 20},${90 + Math.random() * 20},`, // amber
    leaf,
  };
}

function drawPetal(ctx, p, alpha) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = `${p.color}${0.55 * alpha})`;
  ctx.strokeStyle = `rgba(30,16,8,${0.28 * alpha})`;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  if (p.leaf) {
    ctx.moveTo(-p.size, 0);
    ctx.quadraticCurveTo(0, -p.size * 0.55, p.size, 0);
    ctx.quadraticCurveTo(0, p.size * 0.55, -p.size, 0);
  } else {
    ctx.ellipse(0, 0, p.size * 0.62, p.size, 0, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  if (p.leaf) {
    ctx.beginPath();
    ctx.moveTo(-p.size * 0.8, 0);
    ctx.lineTo(p.size * 0.8, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function stepPetal(p, t) {
  p.x += Math.sin(t * p.swayFreq + p.phase) * p.swayAmp + 0.35;
  p.y += p.vy;
  p.rot += p.vrot;
}

// ─── Cosmic: stars streak outward from the card centre ───────────────────────
function makeStreak(w, h) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 3 + Math.random() * 6;
  return {
    x: w / 2, y: h / 2,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: 10 + Math.random() * 26,
    width: 0.6 + Math.random() * 1.2,
    color: Math.random() < 0.55 ? '42,48,120' : '190,150,60', // ink indigo / gold
  };
}

function drawStreak(ctx, s, alpha) {
  const mag = Math.hypot(s.vx, s.vy);
  const tx = s.x - (s.vx / mag) * s.len;
  const ty = s.y - (s.vy / mag) * s.len;
  const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
  g.addColorStop(0, `rgba(${s.color},0)`);
  g.addColorStop(1, `rgba(${s.color},${0.75 * alpha})`);
  ctx.strokeStyle = g;
  ctx.lineWidth = s.width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(s.x, s.y);
  ctx.stroke();
  ctx.fillStyle = `rgba(${s.color},${0.9 * alpha})`;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.width * 0.9, 0, Math.PI * 2);
  ctx.fill();
}

function stepStreak(s) {
  s.x += s.vx;
  s.y += s.vy;
  s.vx *= 1.015;
  s.vy *= 1.015;
}

// Registry — new send/reveal themes slot in here
const THEMES = {
  botanical: { make: makePetal, draw: drawPetal, step: stepPetal, rate: 2.2 },
  cosmic:    { make: makeStreak, draw: drawStreak, step: stepStreak, rate: 3 },
};

export default function RevealAnimation({ theme, onDone }) {
  const canvasRef = useRef(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      onDoneRef.current?.();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const { make, draw, step, rate } = THEMES[theme] ?? THEMES.botanical;
    const particles = [];
    const start = performance.now();
    let frame = 0;
    let spawnDebt = 0;
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (elapsed < DURATION * 0.6) {
        spawnDebt += rate;
        while (spawnDebt >= 1) { particles.push(make(w, h)); spawnDebt -= 1; }
      }

      // Everything fades out over the last 25% of the run
      const fade = Math.min(1, Math.max(0, (DURATION - elapsed) / (DURATION * 0.25)));
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        step(p, frame);
        if (p.y < -60 || p.y > h + 120 || p.x < -60 || p.x > w + 60) {
          particles.splice(i, 1);
          continue;
        }
        draw(ctx, p, fade);
      }
      frame++;

      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        onDoneRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 30,
      }}
    />
  );
}
