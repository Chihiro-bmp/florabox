import { CAT, SEATED, SIDE } from './catShapes';

function Blossom({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="0" cy="-4.2" rx="2.6" ry="3.9" transform={`rotate(${a})`}
          fill={CAT.petal} stroke={CAT.blush} strokeWidth=".6" />
      ))}
      <circle r="1.5" fill={CAT.blush} />
    </g>
  );
}

/**
 * Seated cat, in SEATED design coordinates. Optional refs let an animator drive
 * the tail, pupils and blink without re-rendering.
 */
export function SeatedCat({ rim = false, blink = false, tailRef, pupilRefs, openEyesRef, closedEyesRef }) {
  const edge = rim ? { stroke: 'rgba(245,237,224,.55)', strokeWidth: 1.1 } : {};
  return (
    <g>
      {/* Pivot at the tail root (bottom-left of its box) */}
      <g ref={tailRef} style={{ transformBox: 'fill-box', transformOrigin: '0% 97%' }} className="fb-cat-tail">
        {rim && <path d={SEATED.tail} fill="none" stroke="rgba(245,237,224,.55)" strokeWidth="9.2" strokeLinecap="round" />}
        <path d={SEATED.tail} fill="none" stroke={CAT.ink} strokeWidth="7" strokeLinecap="round" />
      </g>
      {rim && <path d={SEATED.body} fill={CAT.ink} {...edge} />}
      {rim && <path d={SEATED.head} fill={CAT.ink} {...edge} />}
      <path d={SEATED.body} fill={CAT.ink} />
      <path d={SEATED.head} fill={CAT.ink} />
      <path d="M92,178 C93,196 93,212 92,224" fill="none" stroke="rgba(245,237,224,.10)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M70,32 L82,46 L72,49 Z" fill={CAT.blush} opacity=".6" />
      <path d="M126,30 L114,45 L124,48 Z" fill={CAT.blush} opacity=".6" />

      <g ref={openEyesRef} className="fb-cat-eyes-open" style={blink ? { display: 'none' } : undefined}>
        <path d="M72,76 Q82,62 92,76 Q82,88 72,76 Z" fill={CAT.jade} />
        <path d="M104,76 Q114,62 124,76 Q114,88 104,76 Z" fill={CAT.jade} />
        {SEATED.eyes.map(([x, y], i) => (
          <g key={i} ref={pupilRefs?.[i]}>
            <ellipse cx={x + 1} cy={y} rx="2.6" ry="6" fill={CAT.ink} />
            <circle cx={x + 3} cy={y - 3.5} r="1.2" fill={CAT.cream} />
          </g>
        ))}
      </g>
      <g ref={closedEyesRef} className="fb-cat-eyes-closed" style={blink ? undefined : { display: 'none' }}
        stroke={CAT.jade} strokeWidth="2.3" strokeLinecap="round" fill="none">
        <path d="M73,76 Q82,81 91,76" />
        <path d="M105,76 Q114,81 123,76" />
      </g>

      <path d="M77,105 Q98,115 119,105" fill="none" stroke={CAT.blush} strokeWidth="2.6" strokeLinecap="round" />
      <Blossom x={98} y={114.5} />
    </g>
  );
}

/** Side-profile cat, facing +x, in SIDE design coordinates. Legs are drawn by the animator. */
export function SideCat({ legRefs, torsoRef, headRef, tailRef, leapTailRef }) {
  const leg = ([x, y], i) => (
    <path key={i} ref={legRefs?.[i]} d={`M${x},${y} L${x},0`} fill="none"
      stroke={i < 2 ? '#2a1a12' : CAT.ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <g>
      {SIDE.legs.slice(0, 2).map(leg)}
      <g ref={torsoRef}>
        {/* Pivot at the tail root (bottom-right of its box) */}
        <g ref={tailRef} style={{ transformBox: 'fill-box', transformOrigin: '100% 100%' }}>
          <path d={SIDE.tail} fill="none" stroke={CAT.ink} strokeWidth="7" strokeLinecap="round" />
        </g>
        <path ref={leapTailRef} d={SIDE.tailLeap} fill="none" stroke={CAT.ink} strokeWidth="7" strokeLinecap="round" style={{ display: 'none' }} />
        <path d={SIDE.body} fill={CAT.ink} />
        <ellipse cx="-46" cy="-80" rx="24" ry="19" fill={CAT.ink} />
        <ellipse cx="46" cy="-84" rx="17" ry="17" fill={CAT.ink} />
        <g ref={headRef}>
          <path d={SIDE.head} fill={CAT.ink} />
          <path d="M83,-160 L90,-151 L84,-149 Z" fill={CAT.blush} opacity=".6" />
          <path d="M97,-124 Q106,-133 115,-124 Q106,-117 97,-124 Z" fill={CAT.jade} />
          <ellipse cx="108" cy="-124" rx="2.1" ry="4.8" fill={CAT.ink} />
        </g>
        <path d="M62,-108 Q74,-99 88,-100" fill="none" stroke={CAT.blush} strokeWidth="3" strokeLinecap="round" />
        <Blossom x={76} y={-99} scale={0.75} />
      </g>
      {SIDE.legs.slice(2).map((l, i) => leg(l, i + 2))}
    </g>
  );
}
