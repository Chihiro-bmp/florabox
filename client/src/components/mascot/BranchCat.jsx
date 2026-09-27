import { useEffect, useRef } from 'react';
import { SEATED, SIDE } from './catShapes';
import { SeatedCat, SideCat } from './CatParts';

const SCALE      = 0.2;   // design units → scene units (~43 units tall seated)
const WALK_SPEED = 34;    // scene units per second
const LEAP_TIME  = 0.72;  // seconds
const HOP_TIME   = 0.45;
const FADE_IN    = 0.9;

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * The living mascot. Render inside an <svg> group that shares the branches'
 * coordinates (and sway transform). It sits, blinks, flicks its tail and watches
 * the pointer; now and then it walks along its branch or leaps to another perch.
 *
 * perches: [{ d, width, from, to, walk }] — `d` is a branch path, from/to bound the
 * usable stretch (0–1 of its length), `walk` allows strolling along it.
 */
export default function BranchCat({ perches, active }) {
  const rootRef   = useRef(null);
  const seatRef   = useRef(null);
  const sideRef   = useRef(null);
  const measureRefs = useRef([]);
  const seatTail  = useRef(null);
  const pupil0 = useRef(null), pupil1 = useRef(null);
  const openEyes  = useRef(null);
  const shutEyes  = useRef(null);
  const leg0 = useRef(null), leg1 = useRef(null), leg2 = useRef(null), leg3 = useRef(null);
  const sideTail  = useRef(null);
  const leapTail  = useRef(null);
  const hopRequest = useRef(false);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const paths = measureRefs.current;
    if (!root || paths.some(p => !p)) return;

    const pupils = [pupil0, pupil1];
    const legs = [leg0, leg1, leg2, leg3];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lengths = paths.map(p => p.getTotalLength());

    // Point on a perch at fraction t, lifted onto the top of the branch
    const pointAt = (pi, t) => {
      const p = paths[pi], L = lengths[pi];
      const a = p.getPointAtLength(t * L);
      const b = p.getPointAtLength(Math.min(L, t * L + 1));
      const c = p.getPointAtLength(Math.max(0, t * L - 1));
      const dx = b.x - c.x, dy = b.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      let nx = dy / len, ny = -dx / len;           // a normal…
      if (ny > 0) { nx = -nx; ny = -ny; }           // …pointing upward
      const lift = perches[pi].width * 0.45;
      return { x: a.x + nx * lift, y: a.y + ny * lift, dx: dx / len, dy: dy / len };
    };

    const s = {
      mode: 'sit', perch: 0, t: (perches[0].from + perches[0].to) / 2,
      timer: rand(2.5, 5), target: 0, dir: 1, phase: 0,
      nextBlink: rand(1.5, 4), blinkLeft: 0,
      nextFlick: rand(3, 7), flickT: -1,
      leap: null, hopT: -1, age: 0,
      look: { x: 0, y: 0 }, pointer: null,
    };

    const onPointer = (e) => { s.pointer = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const showSeated = (seated) => {
      seatRef.current.style.display = seated ? '' : 'none';
      sideRef.current.style.display = seated ? 'none' : '';
    };

    const placeSeated = (x, y, lift = 0) => {
      const tx = x - SEATED.footX * SCALE;
      const ty = y - SEATED.footY * SCALE - lift;
      seatRef.current.setAttribute('transform', `translate(${tx},${ty}) scale(${SCALE})`);
    };

    // (vx, vy) is the travel direction. The figure faces +x, so when heading left
    // it is mirrored and rotated to align with the reversed travel vector.
    const placeSide = (x, y, vx, vy) => {
      const face = vx < 0 ? -1 : 1;
      const ang = Math.atan2(vy * face, vx * face) * 180 / Math.PI;
      sideRef.current.setAttribute('transform',
        `translate(${x},${y}) rotate(${ang}) scale(${SCALE * face},${SCALE})`);
    };

    const setLegs = (angles) => {
      SIDE.legs.forEach(([hx, hy], i) => {
        legs[i].current.setAttribute('transform', `rotate(${angles[i]} ${hx} ${hy})`);
      });
    };

    const pickNext = () => {
      const here = perches[s.perch];
      const roll = Math.random();
      if (reduced) { s.timer = rand(4, 8); return; }
      if (roll < 0.5 && here.walk) {
        let target = rand(here.from, here.to);
        if (Math.abs(target - s.t) < 0.12) target = s.t > (here.from + here.to) / 2 ? here.from + 0.04 : here.to - 0.04;
        s.mode = 'walk'; s.target = target; s.dir = 0;
        showSeated(false);
      } else if (roll < 0.8 && perches.length > 1) {
        const others = perches.map((_, i) => i).filter(i => i !== s.perch);
        const to = others[Math.floor(Math.random() * others.length)];
        const toT = rand(perches[to].from, perches[to].to);
        s.mode = 'leap';
        s.leap = { from: pointAt(s.perch, s.t), to: pointAt(to, toT), perch: to, t: toT, u: 0 };
        showSeated(false);
        leapTail.current.style.display = '';
        sideTail.current.style.display = 'none';
      } else {
        s.timer = rand(3, 6);
      }
    };

    const sitDown = () => {
      s.mode = 'sit';
      s.timer = rand(4, 9);
      showSeated(true);
      leapTail.current.style.display = 'none';
      sideTail.current.style.display = '';
    };

    let last = performance.now();
    let raf;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.age += dt;
      root.style.opacity = Math.min(1, s.age / FADE_IN);

      if (hopRequest.current && s.mode === 'sit' && s.hopT < 0) {
        s.hopT = 0; s.blinkLeft = HOP_TIME;
      }
      hopRequest.current = false;

      if (s.mode === 'sit') {
        const p = pointAt(s.perch, s.t);
        let lift = 0;
        if (s.hopT >= 0) {
          s.hopT += dt / HOP_TIME;
          lift = Math.sin(Math.min(1, s.hopT) * Math.PI) * 14;
          if (s.hopT >= 1) s.hopT = -1;
        }
        placeSeated(p.x, p.y, lift);

        // Blink
        s.nextBlink -= dt;
        if (s.nextBlink <= 0) { s.blinkLeft = 0.14; s.nextBlink = rand(2, 5.5); }
        s.blinkLeft -= dt;
        const shut = s.blinkLeft > 0;
        openEyes.current.style.display = shut ? 'none' : '';
        shutEyes.current.style.display = shut ? '' : 'none';

        // Tail: slow idle sway plus the occasional flick
        s.nextFlick -= dt;
        if (s.nextFlick <= 0 && s.flickT < 0) { s.flickT = 0; s.nextFlick = rand(4, 9); }
        let tail = Math.sin(now / 900) * 2.5;
        if (s.flickT >= 0) {
          s.flickT += dt;
          tail += Math.sin(s.flickT * 14) * 10 * Math.max(0, 1 - s.flickT / 0.9);
          if (s.flickT > 0.9) s.flickT = -1;
        }
        seatTail.current.style.transform = `rotate(${tail}deg)`;

        // Pupils follow the pointer
        if (s.pointer && root.parentNode?.getScreenCTM) {
          const m = root.parentNode.getScreenCTM();
          if (m) {
            const pt = new DOMPoint(s.pointer.x, s.pointer.y).matrixTransform(m.inverse());
            const hx = p.x, hy = p.y - 34;
            const d = Math.hypot(pt.x - hx, pt.y - hy) || 1;
            const k = Math.min(1, d / 160);
            s.look.x += (((pt.x - hx) / d) * 2.4 * k - s.look.x) * 0.12;
            s.look.y += (((pt.y - hy) / d) * 1.6 * k - s.look.y) * 0.12;
          }
        }
        pupils.forEach(r => r.current?.setAttribute('transform', `translate(${s.look.x},${s.look.y})`));

        if (s.hopT < 0) {
          s.timer -= dt;
          if (s.timer <= 0) pickNext();
        }
      } else if (s.mode === 'walk') {
        const L = lengths[s.perch];
        const dir = Math.sign(s.target - s.t) || 1;
        s.t += (dir * WALK_SPEED * dt) / L;
        if ((dir > 0 && s.t >= s.target) || (dir < 0 && s.t <= s.target)) {
          s.t = s.target;
          sitDown();
        } else {
          const p = pointAt(s.perch, s.t);
          placeSide(p.x, p.y, p.dx * dir, p.dy * dir);
          s.phase += dt * 9;
          const a = Math.sin(s.phase) * 22;
          setLegs([a, -a, -a, a]);
          sideTail.current.style.transform = `rotate(${Math.sin(s.phase / 2) * 5}deg)`;
        }
      } else if (s.mode === 'leap') {
        const lp = s.leap;
        lp.u = Math.min(1, lp.u + dt / LEAP_TIME);
        const u = lp.u;
        const h = 36 + Math.abs(lp.to.x - lp.from.x) * 0.15;
        const x = lp.from.x + (lp.to.x - lp.from.x) * u;
        const y = lp.from.y + (lp.to.y - lp.from.y) * u - h * 4 * u * (1 - u);
        const vx = (lp.to.x - lp.from.x);
        const vy = (lp.to.y - lp.from.y) - h * 4 * (1 - 2 * u);
        const vl = Math.hypot(vx, vy) || 1;
        placeSide(x, y, vx / vl, (vy / vl) * 0.6);
        // Crouch → stretch out → reach for the landing
        const stretch = Math.sin(u * Math.PI);
        setLegs([-70 * stretch - 10, -64 * stretch - 10, 72 * stretch + 10, 66 * stretch + 10]);
        if (u >= 1) {
          s.perch = lp.perch; s.t = lp.t;
          s.hopT = 0.5; // land with a little settle
          sitDown();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    root.style.opacity = 0;
    showSeated(true);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [active, perches]);

  return (
    <g>
      {perches.map((p, i) => (
        <path key={i} ref={el => { measureRefs.current[i] = el; }} d={p.d} fill="none" stroke="none" />
      ))}
      {active && (
        <g
          ref={rootRef}
          role="img"
          aria-label="Florabox cat"
          style={{ cursor: 'pointer', opacity: 0 }}
          onPointerDown={() => { hopRequest.current = true; }}
        >
          <g ref={seatRef}>
            <SeatedCat tailRef={seatTail} pupilRefs={[pupil0, pupil1]} openEyesRef={openEyes} closedEyesRef={shutEyes} />
          </g>
          <g ref={sideRef} style={{ display: 'none' }}>
            <SideCat legRefs={[leg0, leg1, leg2, leg3]} tailRef={sideTail} leapTailRef={leapTail} />
          </g>
        </g>
      )}
    </g>
  );
}
