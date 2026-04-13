import { useId } from 'react';

export default function WisteriaCard({ toName = '', fromName = '', message = '' }) {
  const uid = useId().replace(/:/g, '');
  const msgLines = message
    ? message.match(/.{1,28}(\s|$)/g)?.map(s => s.trim()).filter(Boolean).slice(0, 4) ?? []
    : [];

  // Renders one wisteria raceme (hanging cluster) at position (cx, topY)
  const raceme = (cx, topY, count, baseOpacity) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const y = topY + i * 7.8;
      const w = Math.max(2.0, 4.7 - i * 0.22);
      const h = w * 0.62;
      const a = Math.max(0.12, baseOpacity - i * 0.05);
      const xo = i % 2 === 0 ? 2.8 : -2.8;
      items.push(
        <ellipse key={`a${i}`} cx={cx + xo} cy={y}       rx={w}        ry={h}        fill={`url(#${uid}cg)`}  opacity={+a.toFixed(2)}/>,
        <ellipse key={`b${i}`} cx={cx - xo} cy={y + 3.6} rx={w * 0.80} ry={h * 0.76} fill={`url(#${uid}cg2)`} opacity={+(a * 0.80).toFixed(2)}/>
      );
    }
    return <g key={`rc-${cx}-${topY}`}>{items}</g>;
  };

  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        {/* Primary cluster gradient — deep lavender to pale blush */}
        <linearGradient id={`${uid}cg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#9878a8"/>
          <stop offset="55%"  stopColor="#c2a0c8"/>
          <stop offset="100%" stopColor="#dfc0d6"/>
        </linearGradient>
        {/* Secondary cluster gradient — warmer lavender-blush */}
        <linearGradient id={`${uid}cg2`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ae8cbc"/>
          <stop offset="100%" stopColor="#d6b6ca"/>
        </linearGradient>
        {/* Top atmospheric glow */}
        <radialGradient id={`${uid}glow`} cx="50%" cy="5%" r="68%" fx="50%" fy="5%">
          <stop offset="0%"   stopColor="rgba(235,228,248,0.58)"/>
          <stop offset="52%"  stopColor="rgba(230,222,242,0.25)"/>
          <stop offset="100%" stopColor="rgba(220,212,232,0)"/>
        </radialGradient>
        {/* Subtle vignette */}
        <radialGradient id={`${uid}vg`} cx="50%" cy="50%" r="72%">
          <stop offset="0%"   stopColor="rgba(70,40,15,0)"/>
          <stop offset="68%"  stopColor="rgba(60,35,10,.016)"/>
          <stop offset="100%" stopColor="rgba(45,25,6,.07)"/>
        </radialGradient>
      </defs>

      {/* BASE — warm parchment */}
      <rect width="300" height="400" fill="#f0e8d8"/>
      <rect width="300" height="400" fill={`url(#${uid}glow)`}/>

      {/* MIST — white ellipses dissolving into upper zone */}
      <ellipse cx="70"  cy="50" rx="92"  ry="68" fill="rgba(255,253,250,0.44)"/>
      <ellipse cx="195" cy="40" rx="116" ry="72" fill="rgba(255,253,250,0.36)"/>
      <ellipse cx="148" cy="82" rx="148" ry="80" fill="rgba(255,252,248,0.26)"/>
      <ellipse cx="44"  cy="26" rx="56"  ry="36" fill="rgba(255,254,252,0.50)"/>
      <ellipse cx="264" cy="60" rx="52"  ry="38" fill="rgba(255,253,250,0.34)"/>

      {/* LAVENDER-BLUSH WATERCOLOUR HAZE */}
      <ellipse cx="82"  cy="30" rx="90"  ry="58" fill="rgba(148,118,168,0.09)"  transform="rotate(-9,82,30)"/>
      <ellipse cx="195" cy="25" rx="100" ry="64" fill="rgba(148,118,168,0.075)" transform="rotate(5,195,25)"/>
      <ellipse cx="150" cy="70" rx="130" ry="70" fill="rgba(175,140,192,0.05)"/>

      {/* MAIN BRANCH — ink stroke arching across top */}
      <path d="M 8,50 C 58,26 118,15 180,18 C 226,20 261,28 292,47"
            fill="none" stroke="#2a1a0e" strokeWidth="1.2" strokeLinecap="round"/>

      {/* SUB-BRANCHES — gentle curves hanging down */}
      <path d="M 43,37 C 42,52 43,65 44,79"    fill="none" stroke="#2a1a0e" strokeWidth="0.82" strokeLinecap="round"/>
      <path d="M 92,22 C 91,40 91,58 92,77"    fill="none" stroke="#2a1a0e" strokeWidth="0.80" strokeLinecap="round"/>
      <path d="M 148,17 C 147,37 147,57 148,78" fill="none" stroke="#2a1a0e" strokeWidth="0.78" strokeLinecap="round"/>
      <path d="M 198,19 C 197,37 197,56 198,73" fill="none" stroke="#2a1a0e" strokeWidth="0.76" strokeLinecap="round"/>
      <path d="M 242,27 C 241,44 241,59 242,74" fill="none" stroke="#2a1a0e" strokeWidth="0.72" strokeLinecap="round"/>
      <path d="M 278,43 C 277,56 277,67 278,78" fill="none" stroke="#2a1a0e" strokeWidth="0.68" strokeLinecap="round"/>

      {/* PRIMARY RACEMES — main hanging clusters */}
      {raceme( 44,  79, 11, 0.74)}
      {raceme( 92,  77, 13, 0.78)}
      {raceme(148,  78, 12, 0.76)}
      {raceme(198,  73, 10, 0.72)}
      {raceme(242,  74,  8, 0.68)}
      {raceme(278,  78,  7, 0.62)}

      {/* SECONDARY RACEMES — fill density between primaries */}
      {raceme( 68,  87,  6, 0.54)}
      {raceme(120,  84,  7, 0.56)}
      {raceme(172,  85,  6, 0.50)}
      {raceme(220,  82,  5, 0.46)}

      {/* LEAVES — small oval leaves along branch */}
      <ellipse cx="30"  cy="32" rx="7.5" ry="4.5" fill="rgba(70,90,46,0.42)" transform="rotate(-28,30,32)"/>
      <ellipse cx="60"  cy="22" rx="7"   ry="4.2" fill="rgba(70,90,46,0.38)" transform="rotate(14,60,22)"/>
      <ellipse cx="112" cy="14" rx="7.5" ry="4.5" fill="rgba(70,90,46,0.42)" transform="rotate(-10,112,14)"/>
      <ellipse cx="138" cy="12" rx="6.5" ry="4"   fill="rgba(70,90,46,0.36)" transform="rotate(22,138,12)"/>
      <ellipse cx="166" cy="14" rx="7"   ry="4.2" fill="rgba(70,90,46,0.38)" transform="rotate(-16,166,14)"/>
      <ellipse cx="212" cy="17" rx="7.5" ry="4.5" fill="rgba(70,90,46,0.40)" transform="rotate(8,212,17)"/>
      <ellipse cx="256" cy="24" rx="6.5" ry="4"   fill="rgba(70,90,46,0.36)" transform="rotate(-20,256,24)"/>
      <ellipse cx="274" cy="36" rx="6"   ry="3.8" fill="rgba(70,90,46,0.34)" transform="rotate(14,274,36)"/>

      {/* HAIRLINE BORDER */}
      <rect x="9" y="9" width="282" height="382" fill="none" stroke="rgba(46,26,8,0.12)" strokeWidth=".5"/>

      {/* TO */}
      <text x="18" y="205" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(46,26,8,.46)">To,</text>
      {toName ? (
        <text x="38" y="205" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(46,26,8,.72)">{toName}</text>
      ) : null}
      <line x1="18" y1="220" x2="190" y2="220" stroke="rgba(46,26,8,.20)" strokeWidth=".5" strokeDasharray="3,4"/>

      {/* MESSAGE — centred under the cascade */}
      {msgLines.map((line, i) => (
        <text key={i} x="150" y={234 + i * 18}
              fontFamily="Cormorant Garamond,Georgia,serif" fontSize="11"
              fill="rgba(46,26,8,.65)" textAnchor="middle">{line}</text>
      ))}
      {!msgLines.length && (<>
        <line x1="38" y1="238" x2="262" y2="238" stroke="rgba(46,26,8,.17)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="50" y1="256" x2="252" y2="256" stroke="rgba(46,26,8,.15)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="60" y1="274" x2="242" y2="274" stroke="rgba(46,26,8,.14)" strokeWidth=".5" strokeDasharray="3,4"/>
      </>)}

      {/* FROM */}
      {fromName ? (
        <text x="18" y="347" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(46,26,8,.72)">{fromName}</text>
      ) : null}
      <text x="18" y="363" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(46,26,8,.46)">From,</text>
      <line x1="18" y1="371" x2="145" y2="371" stroke="rgba(46,26,8,.20)" strokeWidth=".5" strokeDasharray="3,4"/>

      {/* JAPANESE PHRASE — 想い (longing/feeling) — decorative, bottom-right */}
      <text x="282" y="386" fontFamily="Share Tech Mono,monospace" fontSize="10"
            fill="rgba(120,75,120,0.48)" textAnchor="end">「想い」</text>

      {/* VIGNETTE */}
      <rect width="300" height="400" fill={`url(#${uid}vg)`}/>
    </svg>
  );
}
