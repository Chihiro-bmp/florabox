import { useEffect, useRef } from 'react';
import { SEATED, SIDE } from './catShapes';
import { SeatedCat, SideCat } from './CatParts';

const SCALE      = 0.2;   // design units → scene units (~43 units tall seated)
const ACCEL      = 340;   // scene units / s² — how briskly it gets going and slows down
const STRIDE     = 32;    // half a step, design units: a paw travels 2×STRIDE per stance
const STEP_LIFT  = 18;    // how high a paw lifts mid-swing, design units
const CROUCH     = 0.22;  // seconds of wind-up before a leap
const LEAP_TIME  = 0.62;  // seconds airborne
const HOP_TIME   = 0.45;
const FADE_IN    = 0.9;

const rand = (a, b) => a + Math.random() * (b - a);
const smooth = (v) => v * v * (3 - 2 * v);

// Two-bone IK: joint between hip and foot, bending towards `bend` (+1 forward, -1 back)
function kneeFor(hx, hy, fx, fy, bend, l1, l2) {
  let dx = fx - hx, dy = fy - hy;
  let d = Math.hypot(dx, dy);
  const max = l1 + l2 - 0.5;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; fx = hx + dx; fy = hy + dy; }
  const a = Math.atan2(dy, dx);
  const b = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  // Rotating towards -x·bend puts the knee ahead of the hip→paw line (screen x grows forward)
  const k = a - b * bend;
  return { kx: hx + Math.cos(k) * l1, ky: hy + Math.sin(k) * l1, fx, fy };
}

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
  const torso = useRef(null), head = useRef(null);
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
      timer: rand(2.5, 5), target: 0, phase: 0, vel: 0, topSpeed: 0,
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
    const placeSide = (x, y, vx, vy, maxTilt = 90) => {
      const face = vx < 0 ? -1 : 1;
      let ang = Math.atan2(vy * face, vx * face) * 180 / Math.PI;
      ang = Math.max(-maxTilt, Math.min(maxTilt, ang));
      sideRef.current.setAttribute('transform',
        `translate(${x},${y}) rotate(${ang}) scale(${SCALE * face},${SCALE})`);
    };

    // feet: [[x, y] × 4] in side-pose coords; bob lifts the hips with the torso
    const setLegs = (feet, bob = 0) => {
      SIDE.legs.forEach(([hx, hy, bend, l1, l2], i) => {
        const hipY = hy + bob;
        const { kx, ky, fx, fy } = kneeFor(hx, hipY, feet[i][0], feet[i][1], bend, l1, l2);
        legs[i].current.setAttribute('d', `M${hx},${hipY} L${kx.toFixed(1)},${ky.toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}`);
      });
    };

    const setTorso = (bob, pitch, nod, tail) => {
      torso.current.setAttribute('transform', `translate(0,${bob.toFixed(2)}) rotate(${pitch.toFixed(2)} 0 -90)`);
      head.current.setAttribute('transform', `rotate(${nod.toFixed(2)} 62 -112)`);
      sideTail.current.style.transform = `rotate(${tail.toFixed(1)}deg)`;
    };

    // Trot: diagonal pairs move together (far hind + near front, far front + near hind).
    // Each paw is planted for half the cycle (sliding back as the body passes over it)
    // and swings forward through an arc for the other half.
    const PAIR = [0, Math.PI, Math.PI, 0];
    const gaitFeet = (phase) => SIDE.legs.map(([hx], i) => {
      const u = ((phase + PAIR[i]) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const rest = hx + (i % 2 ? 6 : -2);
      if (u < Math.PI) return [rest + STRIDE * (1 - 2 * u / Math.PI), 0];
      const v = (u - Math.PI) / Math.PI;
      return [rest - STRIDE + 2 * STRIDE * smooth(v), -STEP_LIFT * Math.sin(v * Math.PI)];
    });
    const standFeet = SIDE.legs.map(([hx], i) => [hx + (i % 2 ? 6 : -2), 0]);

    const pickNext = () => {
      const here = perches[s.perch];
      const roll = Math.random();
      if (reduced) { s.timer = rand(4, 8); return; }
      // A leap needs somewhere to go sideways, or it reads as a vertical launch
      let leapTo = null;
      if (roll >= 0.5 && roll < 0.8 && perches.length > 1) {
        const from = pointAt(s.perch, s.t);
        const others = perches.map((_, i) => i).filter(i => i !== s.perch);
        for (let tries = 0; tries < 8 && !leapTo; tries++) {
          const to = others[Math.floor(Math.random() * others.length)];
          const toT = rand(perches[to].from, perches[to].to);
          const p = pointAt(to, toT);
          if (Math.abs(p.x - from.x) >= 45) leapTo = { perch: to, t: toT, p, from };
        }
      }
      if ((roll < 0.5 || (roll < 0.8 && !leapTo)) && here.walk) {
        let target = rand(here.from, here.to);
        if (Math.abs(target - s.t) < 0.12) target = s.t > (here.from + here.to) / 2 ? here.from + 0.04 : here.to - 0.04;
        s.mode = 'walk'; s.target = target; s.vel = 0;
        // Sometimes a saunter, sometimes a purposeful trot
        s.topSpeed = Math.random() < 0.4 ? rand(130, 160) : rand(85, 105);
        const p = pointAt(s.perch, s.t), dir = Math.sign(target - s.t) || 1;
        placeSide(p.x, p.y, p.dx * dir, p.dy * dir);
        setLegs(standFeet);
        setTorso(0, 0, 0, 0);
        showSeated(false);
      } else if (leapTo) {
        s.mode = 'leap';
        s.leap = { from: leapTo.from, to: leapTo.p, perch: leapTo.perch, t: leapTo.t, u: -CROUCH / LEAP_TIME };
        // Pose before revealing, so no stale frame from the previous move shows
        placeSide(leapTo.from.x, leapTo.from.y, leapTo.p.x - leapTo.from.x, 0);
        setLegs(standFeet);
        setTorso(0, 0, 0, 0);
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
        // Ease in, cruise, ease out so it arrives rather than stops dead
        const remaining = Math.abs(s.target - s.t) * L;
        const want = Math.min(s.topSpeed, Math.sqrt(2 * ACCEL * remaining));
        s.vel += Math.max(-ACCEL * dt, Math.min(ACCEL * dt, want - s.vel));
        const step = Math.max(s.vel, 6) * dt;
        s.t += (dir * step) / L;
        if ((dir > 0 && s.t >= s.target) || (dir < 0 && s.t <= s.target) || remaining < 0.5) {
          s.t = s.target;
          sitDown();
        } else {
          const p = pointAt(s.perch, s.t);
          placeSide(p.x, p.y, p.dx * dir, p.dy * dir);
          // Leg cycle is driven by distance, so planted paws don't skate
          s.phase += (Math.PI * (step / SCALE)) / (2 * STRIDE);
          const pace = Math.min(1.4, s.vel / 80);
          const bob = -4 * pace * Math.abs(Math.cos(s.phase));
          setLegs(gaitFeet(s.phase), bob);
          setTorso(bob, 1.6 * pace * Math.sin(s.phase), 2.2 * pace * Math.sin(2 * s.phase + 0.8),
            -6 * pace + 7 * Math.sin(s.phase * 0.5));
        }
      } else if (s.mode === 'leap') {
        const lp = s.leap;
        lp.u = Math.min(1, lp.u + dt / LEAP_TIME);
        if (lp.u < 0) {
          // Wind-up: crouch low, wiggle, eyes on the landing spot
          const c = smooth(1 + lp.u / (CROUCH / LEAP_TIME));
          placeSide(lp.from.x, lp.from.y, lp.to.x - lp.from.x, 0);
          setLegs(standFeet, 14 * c);
          setTorso(14 * c, -4 * c, 4 * c, 8 * Math.sin(now / 45) * c);
          raf = requestAnimationFrame(tick);
          return;
        }
        const u = lp.u;
        const h = 36 + Math.abs(lp.to.x - lp.from.x) * 0.15;
        const x = lp.from.x + (lp.to.x - lp.from.x) * u;
        const y = lp.from.y + (lp.to.y - lp.from.y) * u - h * 4 * u * (1 - u);
        const vx = (lp.to.x - lp.from.x);
        const vy = (lp.to.y - lp.from.y) - h * 4 * (1 - 2 * u);
        const vl = Math.hypot(vx, vy) || 1;
        placeSide(x, y, vx / vl, (vy / vl) * 0.6, 28);
        // Push off with the hind legs → stretch out → front paws reach for the landing
        const stretch = Math.sin(u * Math.PI);
        const tuck = 1 - stretch;
        setLegs([
          [-48 - 60 * stretch, -8 - 30 * tuck],
          [42 + 58 * stretch, -20 - 20 * stretch],
          [-40 - 56 * stretch, -4 - 30 * tuck],
          [50 + 62 * stretch, -14 - 22 * stretch],
        ]);
        setTorso(0, 0, -4 * stretch, 0);
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
            <SideCat legRefs={[leg0, leg1, leg2, leg3]} torsoRef={torso} headRef={head} tailRef={sideTail} leapTailRef={leapTail} />
          </g>
        </g>
      )}
    </g>
  );
}
