import { useId } from 'react';

export default function MarbledRose({ toName = '', fromName = '', message = '' }) {
  const uid = useId().replace(/:/g, '');
  const msgLines = message ? message.match(/.{1,28}(\s|$)/g)?.map(s => s.trim()).filter(Boolean).slice(0, 5) ?? [] : [];

  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`${uid}leafLight`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(120,150,90,0.68)"/>
          <stop offset="100%" stopColor="rgba(50,70,30,0.68)"/>
        </linearGradient>
        <linearGradient id={`${uid}leafLight2`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(125,155,88,0.66)"/>
          <stop offset="100%" stopColor="rgba(48,68,28,0.66)"/>
        </linearGradient>
        <linearGradient id={`${uid}stemLight`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a4a1a"/>
          <stop offset="100%" stopColor="#3e1f07"/>
        </linearGradient>
        <linearGradient id={`${uid}leafMid`} x1="5%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="rgba(110,146,80,0.64)"/>
          <stop offset="100%" stopColor="rgba(45,65,25,0.64)"/>
        </linearGradient>
        <filter id={`${uid}leafNoise`} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.05" numOctaves="3" seed="29" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      <rect width="300" height="400" fill="#f2e4cc"/>

      {/* MARBLED TEXTURE */}
      <ellipse cx="60" cy="80" rx="55" ry="48" fill="rgba(168,178,195,0.18)" transform="rotate(-12,60,80)"/>
      <ellipse cx="155" cy="55" rx="62" ry="42" fill="rgba(165,175,192,0.15)" transform="rotate(8,155,55)"/>
      <ellipse cx="255" cy="95" rx="50" ry="44" fill="rgba(168,178,195,0.16)" transform="rotate(-18,255,95)"/>
      <ellipse cx="30" cy="175" rx="48" ry="55" fill="rgba(162,172,190,0.14)" transform="rotate(6,30,175)"/>
      <ellipse cx="130" cy="160" rx="58" ry="45" fill="rgba(168,178,195,0.13)" transform="rotate(-8,130,160)"/>
      <ellipse cx="238" cy="188" rx="52" ry="48" fill="rgba(165,175,192,0.15)" transform="rotate(14,238,188)"/>
      <ellipse cx="72" cy="275" rx="55" ry="50" fill="rgba(162,172,190,0.14)" transform="rotate(-10,72,275)"/>
      <ellipse cx="185" cy="295" rx="60" ry="46" fill="rgba(165,175,192,0.12)" transform="rotate(7,185,295)"/>
      <ellipse cx="38" cy="350" rx="50" ry="42" fill="rgba(168,178,195,0.13)" transform="rotate(-5,38,350)"/>
      <ellipse cx="150" cy="368" rx="65" ry="40" fill="rgba(162,172,190,0.11)" transform="rotate(11,150,368)"/>
      <ellipse cx="268" cy="340" rx="45" ry="52" fill="rgba(165,175,192,0.14)" transform="rotate(-16,268,340)"/>
      <ellipse cx="42" cy="52" rx="32" ry="28" fill="rgba(214,162,158,0.32)" transform="rotate(-8,42,52)"/>
      <ellipse cx="118" cy="38" rx="28" ry="24" fill="rgba(210,155,152,0.28)" transform="rotate(14,118,38)"/>
      <ellipse cx="220" cy="28" rx="24" ry="20" fill="rgba(218,165,160,0.3)" transform="rotate(-20,220,28)"/>
      <ellipse cx="275" cy="62" rx="22" ry="26" fill="rgba(212,158,155,0.26)" transform="rotate(9,275,62)"/>
      <ellipse cx="18" cy="128" rx="28" ry="32" fill="rgba(215,162,158,0.28)" transform="rotate(-14,18,128)"/>
      <ellipse cx="95" cy="115" rx="30" ry="26" fill="rgba(210,155,150,0.25)" transform="rotate(18,95,115)"/>
      <ellipse cx="195" cy="105" rx="26" ry="30" fill="rgba(218,165,160,0.27)" transform="rotate(-6,195,105)"/>
      <ellipse cx="48" cy="215" rx="30" ry="28" fill="rgba(215,162,158,0.26)" transform="rotate(-18,48,215)"/>
      <ellipse cx="155" cy="230" rx="28" ry="24" fill="rgba(210,155,150,0.22)" transform="rotate(10,155,230)"/>
      <ellipse cx="22" cy="305" rx="28" ry="24" fill="rgba(212,158,155,0.24)" transform="rotate(16,22,305)"/>
      <ellipse cx="108" cy="328" rx="32" ry="26" fill="rgba(215,162,158,0.22)" transform="rotate(-12,108,328)"/>
      <ellipse cx="205" cy="355" rx="26" ry="22" fill="rgba(210,155,150,0.2)" transform="rotate(8,205,355)"/>
      <ellipse cx="28" cy="38" rx="16" ry="14" fill="rgba(178,58,72,0.38)" transform="rotate(-10,28,38)"/>
      <ellipse cx="255" cy="48" rx="18" ry="15" fill="rgba(182,62,76,0.42)" transform="rotate(16,255,48)"/>
      <ellipse cx="272" cy="72" rx="14" ry="16" fill="rgba(175,55,68,0.36)" transform="rotate(-8,272,72)"/>
      <ellipse cx="12" cy="195" rx="15" ry="18" fill="rgba(178,58,72,0.32)" transform="rotate(12,12,195)"/>
      <ellipse cx="280" cy="195" rx="16" ry="14" fill="rgba(182,62,76,0.35)" transform="rotate(-18,280,195)"/>
      <ellipse cx="32" cy="258" rx="14" ry="16" fill="rgba(175,55,68,0.3)" transform="rotate(8,32,258)"/>
      <ellipse cx="280" cy="295" rx="16" ry="13" fill="rgba(178,58,72,0.33)" transform="rotate(-14,280,295)"/>
      <ellipse cx="18" cy="368" rx="15" ry="12" fill="rgba(182,62,76,0.28)" transform="rotate(20,18,368)"/>
      <ellipse cx="248" cy="372" rx="14" ry="16" fill="rgba(175,55,68,0.3)" transform="rotate(-10,248,372)"/>
      <circle cx="88" cy="22" r="1.4" fill="rgba(80,35,20,0.45)"/>
      <circle cx="172" cy="18" r="1" fill="rgba(80,35,20,0.38)"/>
      <circle cx="238" cy="14" r="1.6" fill="rgba(80,35,20,0.42)"/>
      <circle cx="15" cy="62" r="1.2" fill="rgba(80,35,20,0.36)"/>
      <circle cx="62" cy="145" r="1.4" fill="rgba(80,35,20,0.4)"/>
      <circle cx="185" cy="72" r="1.3" fill="rgba(80,35,20,0.38)"/>
      <circle cx="35" cy="172" r="1.5" fill="rgba(80,35,20,0.4)"/>
      <circle cx="285" cy="168" r="1.3" fill="rgba(80,35,20,0.38)"/>
      <circle cx="78" cy="238" r="1.4" fill="rgba(80,35,20,0.36)"/>
      <circle cx="22" cy="335" r="1.3" fill="rgba(80,35,20,0.35)"/>
      <circle cx="138" cy="358" r="1.4" fill="rgba(80,35,20,0.33)"/>
      <rect x="9" y="9" width="282" height="382" fill="none" stroke="rgba(90,55,25,.16)" strokeWidth=".5"/>

      {/* MAIN STEM */}
      <path d="M282,400 C278,378 270,352 260,326 C250,300 238,276 226,254 C216,236 204,218 194,200 C184,182 176,164 170,148 C166,138 164,128 164,118"
            fill="none" stroke={`url(#${uid}stemLight)`} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M256,328 C260,321 263,317" fill="none" stroke="#5a2a0a" strokeWidth=".75" strokeLinecap="round"/>
      <path d="M240,284 C236,276 233,272" fill="none" stroke="#5a2a0a" strokeWidth=".7" strokeLinecap="round"/>
      <path d="M228,258 C232,251 234,247" fill="none" stroke="#5a2a0a" strokeWidth=".68" strokeLinecap="round"/>
      <path d="M210,218 C214,211 216,207" fill="none" stroke="#5a2a0a" strokeWidth=".65" strokeLinecap="round"/>
      <path d="M248,308 C245,300 243,296" fill="none" stroke="#5a2a0a" strokeWidth=".65" strokeLinecap="round"/>

      {/* LEAF GROUP 1 */}
      <g transform="translate(10,33) rotate(-8 194 155)">
        <path d="M182,162 C190,162 200,153 207,148" fill="none" stroke={`url(#${uid}stemLight)`} strokeWidth=".85" strokeLinecap="round"/>
        <g filter={`url(#${uid}leafNoise)`}>
          <path d="M207,148 C215,137 220,121 216,111 C212,107 205,110 201,120 C198,132 198,143 207,148Z" fill={`url(#${uid}leafLight)`}/>
          <path d="M207,148 C215,137 220,121 216,111 C212,107 205,110 201,120 C198,132 198,143 207,148Z" fill="none" stroke="#2e1a08" strokeWidth=".7"/>
          <path d="M212,136 C209,133 206,132" stroke="rgba(255,255,255,0.16)" strokeWidth=".36" fill="none" strokeLinecap="round"/>
          <path d="M212,136 C215,133 218,131" stroke="rgba(255,255,255,0.13)" strokeWidth=".34" fill="none" strokeLinecap="round"/>
          <path d="M214,122 C211,119 208,118" stroke="rgba(255,255,255,0.14)" strokeWidth=".33" fill="none" strokeLinecap="round"/>
          <path d="M214,122 C217,119 220,117" stroke="rgba(255,255,255,0.11)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M207,148 C214,139 220,132 225,127 C222,121 215,122 211,130 C208,137 207,146 207,148Z" fill={`url(#${uid}leafLight)`} opacity="0.90"/>
          <path d="M207,148 C214,139 220,132 225,127 C222,121 215,122 211,130 C208,137 207,146 207,148Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
          <path d="M207,148 C213,139 219,131 222,127" stroke="rgba(255,255,255,0.16)" strokeWidth=".38" fill="none" strokeLinecap="round"/>
          <path d="M213,139 C216,137 219,135" stroke="rgba(255,255,255,0.12)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M207,148 C216,150 225,149 229,143 C226,135 216,134 212,141 C209,146 208,148 207,148Z" fill={`url(#${uid}leafLight)`} opacity="0.87"/>
          <path d="M207,148 C216,150 225,149 229,143 C226,135 216,134 212,141 C209,146 208,148 207,148Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
          <path d="M207,148 C215,148 223,144" stroke="rgba(255,255,255,0.14)" strokeWidth=".37" fill="none" strokeLinecap="round"/>
        </g>
        <ellipse cx="207" cy="160" rx="20" ry="5" fill="rgba(0,0,0,0.07)"/>
      </g>

      {/* LEAF GROUP 2 */}
      <g transform="rotate(6 188 228)">
        <path d="M218,238 C208,233 198,229 188,225" fill="none" stroke={`url(#${uid}stemLight)`} strokeWidth=".9" strokeLinecap="round"/>
        <g filter={`url(#${uid}leafNoise)`}>
          <path d="M188,225 C176,218 163,216 155,220 C153,228 161,237 175,238 C183,238 188,232 188,225Z" fill={`url(#${uid}leafLight2)`}/>
          <path d="M188,225 C176,218 163,216 155,220 C153,228 161,237 175,238 C183,238 188,232 188,225Z" fill="none" stroke="#2e1a08" strokeWidth=".75"/>
          <path d="M188,225 C174,220 162,218 155,220" stroke="rgba(255,255,255,0.18)" strokeWidth=".45" fill="none" strokeLinecap="round"/>
          <path d="M174,220 C172,217 171,215" stroke="rgba(255,255,255,0.14)" strokeWidth=".33" fill="none" strokeLinecap="round"/>
          <path d="M174,220 C172,223 171,225" stroke="rgba(255,255,255,0.12)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M163,218 C162,215 161,213" stroke="rgba(255,255,255,0.12)" strokeWidth=".30" fill="none" strokeLinecap="round"/>
          <path d="M188,225 C183,213 177,205 169,202 C163,204 163,212 170,219 C178,225 187,225 188,225Z" fill={`url(#${uid}leafLight2)`} opacity="0.91"/>
          <path d="M188,225 C183,213 177,205 169,202 C163,204 163,212 170,219 C178,225 187,225 188,225Z" fill="none" stroke="#2e1a08" strokeWidth=".68"/>
          <path d="M188,225 C182,214 175,207 169,202" stroke="rgba(255,255,255,0.15)" strokeWidth=".38" fill="none" strokeLinecap="round"/>
          <path d="M177,205 C174,207 172,209" stroke="rgba(255,255,255,0.12)" strokeWidth=".30" fill="none" strokeLinecap="round"/>
          <path d="M188,225 C183,236 177,243 169,243 C163,241 163,232 170,228 C178,226 187,226 188,225Z" fill={`url(#${uid}leafLight2)`} opacity="0.88"/>
          <path d="M188,225 C183,236 177,243 169,243 C163,241 163,232 170,228 C178,226 187,226 188,225Z" fill="none" stroke="#2e1a08" strokeWidth=".68"/>
          <path d="M155,220 C144,213 132,210 124,215 C121,223 130,232 144,232 C152,232 155,227 155,220Z" fill={`url(#${uid}leafMid)`} opacity="0.94"/>
          <path d="M155,220 C144,213 132,210 124,215 C121,223 130,232 144,232 C152,232 155,227 155,220Z" fill="none" stroke="#2e1a08" strokeWidth=".72"/>
          <path d="M155,220 C143,215 131,212 124,215" stroke="rgba(255,255,255,0.17)" strokeWidth=".43" fill="none" strokeLinecap="round"/>
          <path d="M143,215 C141,212 140,210" stroke="rgba(255,255,255,0.13)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M143,215 C141,218 140,220" stroke="rgba(255,255,255,0.11)" strokeWidth=".29" fill="none" strokeLinecap="round"/>
          <path d="M132,212 C131,210 130,208" stroke="rgba(255,255,255,0.11)" strokeWidth=".29" fill="none" strokeLinecap="round"/>
          <path d="M155,220 C151,210 145,204 139,203 C135,207 137,216 145,220 C151,223 155,222 155,220Z" fill={`url(#${uid}leafLight2)`} opacity="0.85"/>
          <path d="M155,220 C151,210 145,204 139,203 C135,207 137,216 145,220 C151,223 155,222 155,220Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
        </g>
        <ellipse cx="165" cy="244" rx="28" ry="5.5" fill="rgba(0,0,0,0.07)"/>
      </g>

      {/* LEAF GROUP 3 */}
      <g transform="translate(-8,0)rotate(-10 256 256)">
        <path d="M240,272 C249,266 257,260 265,254" fill="none" stroke={`url(#${uid}stemLight)`} strokeWidth=".85" strokeLinecap="round"/>
        <g filter={`url(#${uid}leafNoise)`}>
          <path d="M265,254 C270,241 274,227 271,219 C267,215 260,218 257,230 C254,241 257,251 265,254Z" fill={`url(#${uid}leafLight)`}/>
          <path d="M265,254 C270,241 274,227 271,219 C267,215 260,218 257,230 C254,241 257,251 265,254Z" fill="none" stroke="#2e1a08" strokeWidth=".72"/>
          <path d="M265,254 C269,240 272,226 271,219" stroke="rgba(255,255,255,0.2)" strokeWidth=".45" fill="none" strokeLinecap="round"/>
          <path d="M269,241 C266,238 263,237" stroke="rgba(255,255,255,0.15)" strokeWidth=".34" fill="none" strokeLinecap="round"/>
          <path d="M269,241 C272,238 275,236" stroke="rgba(255,255,255,0.13)" strokeWidth=".32" fill="none" strokeLinecap="round"/>
          <path d="M272,227 C269,224 266,223" stroke="rgba(255,255,255,0.13)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M272,227 C275,224 277,222" stroke="rgba(255,255,255,0.11)" strokeWidth=".29" fill="none" strokeLinecap="round"/>
          <path d="M265,254 C272,246 278,237 281,231 C279,225 271,227 267,236 C264,243 264,252 265,254Z" fill={`url(#${uid}leafLight)`} opacity="0.90"/>
          <path d="M265,254 C272,246 278,237 281,231 C279,225 271,227 267,236 C264,243 264,252 265,254Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
          <path d="M265,254 C271,246 276,237 279,231" stroke="rgba(255,255,255,0.15)" strokeWidth=".37" fill="none" strokeLinecap="round"/>
          <path d="M272,246 C274,243 276,241" stroke="rgba(255,255,255,0.11)" strokeWidth=".29" fill="none" strokeLinecap="round"/>
          <path d="M265,254 C274,254 281,251 285,245 C282,237 273,237 269,244 C266,249 265,253 265,254Z" fill={`url(#${uid}leafLight)`} opacity="0.87"/>
          <path d="M265,254 C274,254 281,251 285,245 C282,237 273,237 269,244 C266,249 265,253 265,254Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
        </g>
        <ellipse cx="264" cy="266" rx="20" ry="5" fill="rgba(0,0,0,0.07)"/>
      </g>

      {/* LEAF GROUP 4 */}
      <g transform="rotate(8 210 298)">
        <path d="M252,308 C241,303 231,299 221,295" fill="none" stroke={`url(#${uid}stemLight)`} strokeWidth=".82" strokeLinecap="round"/>
        <g filter={`url(#${uid}leafNoise)`}>
          <path d="M221,295 C210,287 198,284 190,288 C187,296 196,305 209,306 C217,306 221,301 221,295Z" fill={`url(#${uid}leafLight2)`}/>
          <path d="M221,295 C210,287 198,284 190,288 C187,296 196,305 209,306 C217,306 221,301 221,295Z" fill="none" stroke="#2e1a08" strokeWidth=".72"/>
          <path d="M221,295 C208,289 196,286 190,288" stroke="rgba(255,255,255,0.17)" strokeWidth=".42" fill="none" strokeLinecap="round"/>
          <path d="M208,289 C206,286 204,285" stroke="rgba(255,255,255,0.13)" strokeWidth=".31" fill="none" strokeLinecap="round"/>
          <path d="M208,289 C206,292 205,294" stroke="rgba(255,255,255,0.11)" strokeWidth=".29" fill="none" strokeLinecap="round"/>
          <path d="M221,295 C216,283 210,274 202,272 C197,275 198,284 206,290 C213,294 220,295 221,295Z" fill={`url(#${uid}leafLight2)`} opacity="0.91"/>
          <path d="M221,295 C216,283 210,274 202,272 C197,275 198,284 206,290 C213,294 220,295 221,295Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
          <path d="M216,283 C213,280 211,279" stroke="rgba(255,255,255,0.12)" strokeWidth=".30" fill="none" strokeLinecap="round"/>
          <path d="M221,295 C216,306 210,314 202,315 C197,312 198,304 206,300 C213,297 220,296 221,295Z" fill={`url(#${uid}leafLight2)`} opacity="0.88"/>
          <path d="M221,295 C216,306 210,314 202,315 C197,312 198,304 206,300 C213,297 220,296 221,295Z" fill="none" stroke="#2e1a08" strokeWidth=".65"/>
          <path d="M190,288 C178,283 166,281 159,284" stroke="rgba(255,255,255,0.15)" strokeWidth=".38" fill="none" strokeLinecap="round"/>
          <path d="M178,283 C176,280 174,279" stroke="rgba(255,255,255,0.12)" strokeWidth=".30" fill="none" strokeLinecap="round"/>
          <path d="M178,283 C176,286 175,288" stroke="rgba(255,255,255,0.10)" strokeWidth=".28" fill="none" strokeLinecap="round"/>
        </g>
        <ellipse cx="196" cy="310" rx="28" ry="5" fill="rgba(0,0,0,0.06)"/>
      </g>

      {/* BLOOM */}
      <path d="M164,118 C152,90 148,66 158,54 C170,54 177,78 164,118Z" fill="rgba(200,125,138,0.30)"/>
      <path d="M164,118 C183,92 200,76 212,78 C218,91 206,112 164,118Z" fill="rgba(196,118,132,0.27)"/>
      <path d="M164,118 C190,115 210,124 216,138 C210,150 190,148 164,118Z" fill="rgba(202,128,140,0.27)"/>
      <path d="M164,118 C182,142 188,164 179,175 C168,179 157,164 164,118Z" fill="rgba(198,122,136,0.29)"/>
      <path d="M164,118 C147,142 140,164 149,175 C160,179 170,164 164,118Z" fill="rgba(200,125,138,0.28)"/>
      <path d="M164,118 C140,113 121,119 118,134 C121,148 142,149 164,118Z" fill="rgba(202,128,140,0.27)"/>
      <path d="M164,118 C146,94 133,78 121,80 C116,93 127,112 164,118Z" fill="rgba(196,118,132,0.28)"/>
      <path d="M164,118 C152,100 150,80 160,70 C168,75 170,95 164,118Z" fill="rgba(255,255,255,0.10)"/>
      <path d="M164,118 C152,90 148,66 158,54 C170,54 177,78 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C183,92 200,76 212,78 C218,91 206,112 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C190,115 210,124 216,138 C210,150 190,148 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C182,142 188,164 179,175 C168,179 157,164 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C147,142 140,164 149,175 C160,179 170,164 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C140,113 121,119 118,134 C121,148 142,149 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C146,94 133,78 121,80 C116,93 127,112 164,118Z" fill="none" stroke="#2e1a08" strokeWidth="0.3"/>
      <path d="M164,118 C160,100 157,82" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C176,102 188,88" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C180,122 194,128" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C172,134 175,152" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C155,134 152,152" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C149,120 135,126" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <path d="M164,118 C152,102 140,90" fill="none" stroke="#2e1a08" strokeWidth=".34" strokeLinecap="round"/>
      <circle cx="164" cy="118" r="5" fill="rgba(235,200,115,0.72)" stroke="#2e1a08" strokeWidth=".85"/>
      <circle cx="164" cy="111" r="1.3" fill="#2e1a08"/>
      <circle cx="170" cy="113" r="1.2" fill="#2e1a08"/>
      <circle cx="172" cy="119" r="1.3" fill="#2e1a08"/>
      <circle cx="169" cy="125" r="1.2" fill="#2e1a08"/>
      <circle cx="163" cy="127" r="1.3" fill="#2e1a08"/>
      <circle cx="157" cy="125" r="1.2" fill="#2e1a08"/>
      <circle cx="155" cy="119" r="1.3" fill="#2e1a08"/>
      <circle cx="158" cy="113" r="1.2" fill="#2e1a08"/>
      <path d="M164,118 C159,138 153,152 149,158" fill="none" stroke="#2e1a08" strokeWidth=".75" strokeLinecap="round"/>
      <path d="M164,118 C169,138 175,150 180,156" fill="none" stroke="#2e1a08" strokeWidth=".75" strokeLinecap="round"/>
      <path d="M164,118 C163,140 163,155" fill="none" stroke="#2e1a08" strokeWidth=".75" strokeLinecap="round"/>
      <path d="M216,158 C223,149 229,143 231,137" stroke="rgba(255,255,255,0.18)" strokeWidth=".4" fill="none" strokeLinecap="round"/>
      <path d="M223,149 C220,147 218,146" stroke="rgba(255,255,255,0.13)" strokeWidth=".31" fill="none" strokeLinecap="round"/>

      {/* MESSAGE AREA */}
      <text x="18" y="38" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(46,26,8,.46)">To,</text>
      {toName ? (
        <text x="38" y="38" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(46,26,8,.72)">{toName}</text>
      ) : null}
      <line x1="18" y1="56" x2="156" y2="56" stroke="rgba(46,26,8,.22)" strokeWidth=".5" strokeDasharray="3,4"/>
      {msgLines.map((line, i) => (
        <text key={i} x="18" y={72 + i * 20} fontFamily="Cormorant Garamond,Georgia,serif" fontSize="11" fill="rgba(46,26,8,.65)">{line}</text>
      ))}
      {!msgLines.length && (<>
        <line x1="18" y1="76" x2="160" y2="76" stroke="rgba(46,26,8,.18)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="18" y1="96" x2="152" y2="96" stroke="rgba(46,26,8,.18)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="18" y1="116" x2="110" y2="116" stroke="rgba(46,26,8,.16)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="18" y1="136" x2="104" y2="136" stroke="rgba(46,26,8,.16)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="18" y1="156" x2="108" y2="156" stroke="rgba(46,26,8,.15)" strokeWidth=".5" strokeDasharray="3,4"/>
      </>)}
      <line x1="18" y1="356" x2="145" y2="356" stroke="rgba(46,26,8,.22)" strokeWidth=".5" strokeDasharray="3,4"/>
      {fromName ? (
        <text x="18" y="352" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(46,26,8,.72)">{fromName}</text>
      ) : null}
      <text x="18" y="372" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(46,26,8,.46)">From,</text>
      <text x="150" y="392" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="9" fill="rgba(46,26,8,.38)" textAnchor="middle" letterSpacing=".08em">Rosa canina</text>
    </svg>
  );
}
