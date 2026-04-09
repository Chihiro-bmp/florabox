import { useId } from 'react';

export default function GoldenHour({ toName = '', fromName = '', message = '' }) {
  const uid = useId().replace(/:/g, '');
  const msgLines = message ? message.match(/.{1,28}(\s|$)/g)?.map(s => s.trim()).filter(Boolean).slice(0, 3) ?? [] : [];

  return (
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`${uid}goldenGlow`} cx="85%" cy="5%" r="78%" fx="85%" fy="5%">
          <stop offset="0%" stopColor="rgba(220,165,55,.15)"/>
          <stop offset="45%" stopColor="rgba(210,155,48,.07)"/>
          <stop offset="100%" stopColor="rgba(195,140,40,0)"/>
        </radialGradient>
        <radialGradient id={`${uid}vignette`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(110,70,15,0)"/>
          <stop offset="65%" stopColor="rgba(100,65,15,.025)"/>
          <stop offset="100%" stopColor="rgba(85,50,8,.09)"/>
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="#f5e8d0"/>
      <rect width="300" height="400" fill={`url(#${uid}goldenGlow)`}/>

      {/* WARM AMBER WATERCOLOR WASH */}
      <ellipse cx="150" cy="200" rx="195" ry="235" fill="rgba(195,148,55,0.045)"/>
      <ellipse cx="150" cy="200" rx="155" ry="190" fill="rgba(188,140,48,0.04)"/>
      <ellipse cx="90" cy="80" rx="130" ry="105" fill="rgba(210,168,72,0.05)" transform="rotate(-12,90,80)"/>
      <ellipse cx="200" cy="60" rx="110" ry="90" fill="rgba(205,162,65,0.048)" transform="rotate(8,200,60)"/>
      <ellipse cx="148" cy="195" rx="140" ry="155" fill="rgba(192,145,52,0.042)"/>
      <ellipse cx="100" cy="320" rx="130" ry="100" fill="rgba(185,138,45,0.055)" transform="rotate(6,100,320)"/>
      <ellipse cx="210" cy="340" rx="120" ry="90" fill="rgba(190,142,50,0.05)" transform="rotate(-10,210,340)"/>
      <ellipse cx="240" cy="90" rx="85" ry="100" fill="rgba(200,120,100,0.038)" transform="rotate(14,240,90)"/>
      <ellipse cx="155" cy="392" rx="155" ry="24" fill="rgba(185,138,45,0.065)"/>

      {/* PARCHMENT TEXTURE LINES */}
      <line x1="0" y1="54" x2="300" y2="55" stroke="rgba(160,128,80,.08)" strokeWidth=".5"/>
      <line x1="0" y1="108" x2="300" y2="107" stroke="rgba(160,128,80,.06)" strokeWidth=".5"/>
      <line x1="0" y1="162" x2="300" y2="163" stroke="rgba(160,128,80,.055)" strokeWidth=".5"/>
      <line x1="0" y1="216" x2="300" y2="215" stroke="rgba(160,128,80,.055)" strokeWidth=".5"/>
      <line x1="0" y1="270" x2="300" y2="271" stroke="rgba(160,128,80,.055)" strokeWidth=".5"/>
      <line x1="0" y1="324" x2="300" y2="323" stroke="rgba(160,128,80,.06)" strokeWidth=".5"/>
      <rect x="9" y="9" width="282" height="382" fill="none" stroke="rgba(100,72,30,.14)" strokeWidth=".5"/>
      <rect x="16" y="16" width="268" height="368" fill="none" stroke="rgba(100,72,30,.22)" strokeWidth="2" strokeDasharray="0 6.1" strokeLinecap="round"/>

      {/* SCATTERED PETALS */}
      <path d="M38,28 C41,22 48,22 50,28 C48,34 40,35 38,28Z" fill="rgba(205,132,102,.05)" stroke="rgba(160,60,60,.28)" strokeWidth=".7" transform="rotate(-25,44,28)"/>
      <path d="M82,18 C85,12 92,13 93,19 C91,25 83,25 82,18Z" fill="rgba(205,132,102,.04)" stroke="rgba(160,60,60,.22)" strokeWidth=".6" transform="rotate(15,87,18)"/>
      <path d="M140,32 C143,26 150,26 152,32 C150,38 142,38 140,32Z" fill="rgba(205,132,102,.045)" stroke="rgba(145,55,55,.25)" strokeWidth=".65" transform="rotate(-10,146,32)"/>
      <path d="M195,22 C198,16 205,17 206,23 C204,29 196,29 195,22Z" fill="rgba(205,132,102,.04)" stroke="rgba(160,60,60,.2)" strokeWidth=".6" transform="rotate(20,200,22)"/>
      <path d="M248,35 C251,29 258,29 260,35 C258,41 250,42 248,35Z" fill="rgba(205,132,102,.045)" stroke="rgba(145,55,55,.24)" strokeWidth=".65" transform="rotate(-30,254,35)"/>
      <path d="M18,88 C21,82 28,82 30,88 C28,94 20,95 18,88Z" fill="rgba(205,132,102,.04)" stroke="rgba(155,58,58,.22)" strokeWidth=".6" transform="rotate(35,24,88)"/>
      <path d="M65,72 C68,66 75,67 76,73 C74,79 66,79 65,72Z" fill="rgba(205,132,102,.04)" stroke="rgba(160,60,60,.2)" strokeWidth=".6" transform="rotate(-18,70,72)"/>
      <path d="M118,55 C121,49 128,49 130,55 C128,61 120,62 118,55Z" fill="rgba(205,132,102,.045)" stroke="rgba(148,56,56,.26)" strokeWidth=".65" transform="rotate(12,124,55)"/>
      <path d="M172,48 C175,42 182,42 184,48 C182,54 174,55 172,48Z" fill="rgba(205,132,102,.04)" stroke="rgba(155,58,58,.21)" strokeWidth=".6" transform="rotate(-22,178,48)"/>
      <path d="M228,62 C231,56 238,56 240,62 C238,68 230,69 228,62Z" fill="rgba(205,132,102,.045)" stroke="rgba(160,60,60,.23)" strokeWidth=".65" transform="rotate(28,234,62)"/>
      <path d="M28,148 C31,142 38,143 39,149 C37,155 29,155 28,148Z" fill="rgba(205,132,102,.038)" stroke="rgba(155,58,58,.19)" strokeWidth=".58" transform="rotate(-32,33,148)"/>
      <path d="M72,162 C75,156 82,156 84,162 C82,168 74,169 72,162Z" fill="rgba(205,132,102,.04)" stroke="rgba(160,60,60,.21)" strokeWidth=".6" transform="rotate(18,78,162)"/>
      <path d="M108,138 C111,132 118,132 120,138 C118,144 110,145 108,138Z" fill="rgba(205,132,102,.038)" stroke="rgba(148,56,56,.2)" strokeWidth=".58" transform="rotate(-8,114,138)"/>
      <path d="M258,142 C261,136 268,136 270,142 C268,148 260,149 258,142Z" fill="rgba(205,132,102,.04)" stroke="rgba(155,58,58,.22)" strokeWidth=".6" transform="rotate(24,264,142)"/>
      <path d="M42,225 C45,219 52,219 54,225 C52,231 44,232 42,225Z" fill="rgba(205,132,102,.036)" stroke="rgba(160,60,60,.18)" strokeWidth=".58" transform="rotate(-14,48,225)"/>
      <path d="M88,248 C91,242 98,242 100,248 C98,254 90,255 88,248Z" fill="rgba(205,132,102,.038)" stroke="rgba(148,55,55,.2)" strokeWidth=".58" transform="rotate(30,94,248)"/>
      <path d="M268,218 C271,212 278,212 280,218 C278,224 270,225 268,218Z" fill="rgba(205,132,102,.038)" stroke="rgba(155,58,58,.2)" strokeWidth=".6" transform="rotate(-20,274,218)"/>
      <path d="M22,305 C25,299 32,299 34,305 C32,311 24,312 22,305Z" fill="rgba(205,132,102,.034)" stroke="rgba(148,55,55,.17)" strokeWidth=".55" transform="rotate(22,28,305)"/>
      <path d="M68,328 C71,322 78,322 80,328 C78,334 70,335 68,328Z" fill="rgba(205,132,102,.036)" stroke="rgba(155,58,58,.18)" strokeWidth=".55" transform="rotate(-25,74,328)"/>
      <path d="M118,352 C121,346 128,346 130,352 C128,358 120,359 118,352Z" fill="rgba(205,132,102,.034)" stroke="rgba(148,55,55,.17)" strokeWidth=".55" transform="rotate(12,124,352)"/>
      <path d="M240,355 C243,349 250,349 252,355 C250,361 242,362 240,355Z" fill="rgba(205,132,102,.034)" stroke="rgba(148,55,55,.16)" strokeWidth=".55" transform="rotate(18,246,355)"/>

      {/* BOTTOM-RIGHT BOTANICAL */}
      <g opacity="0.68">
        <path d="M291,398 C278,380 262,360 250,340 C238,320 228,302 218,284" fill="none" stroke="#6e4010" strokeWidth="1.05" strokeLinecap="round"/>
        <path d="M258,352 C268,342 276,335 282,325" fill="none" stroke="#6e4010" strokeWidth=".72" strokeLinecap="round"/>
        <path d="M240,322 C230,312 224,306 218,298" fill="none" stroke="#6e4010" strokeWidth=".72" strokeLinecap="round"/>
        <path d="M250,340 C242,332 236,328 230,322" fill="none" stroke="#6e4010" strokeWidth=".65" strokeLinecap="round"/>
        <path d="M262,358 C256,350 255,342 260,340 C266,341 267,351 262,358Z" fill="none" stroke="rgba(72,96,48,.52)" strokeWidth=".72"/>
        <path d="M235,314 C242,308 246,302 243,297 C238,296 233,305 235,314Z" fill="none" stroke="rgba(72,96,48,.48)" strokeWidth=".68"/>
        <g transform="translate(282,324)">
          <path d="M0,0 C-2,-6 -5,-9 -3,-12 C0,-14 3,-11 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.5)" strokeWidth=".88"/>
          <path d="M0,0 C4,-4 9,-6 10,-3 C11,0 8,4 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.5)" strokeWidth=".88"/>
          <path d="M0,0 C3,5 2,9 0,10 C-2,9 -3,5 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.5)" strokeWidth=".88"/>
          <path d="M0,0 C-5,3 -9,2 -10,-1 C-9,-4 -5,-4 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.5)" strokeWidth=".88"/>
          <path d="M0,0 C-1,-3 2,-7 5,-5 C7,-2 5,2 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.46)" strokeWidth=".85"/>
          <circle cx="0" cy="0" r="1.8" fill="none" stroke="rgba(140,95,28,.55)" strokeWidth=".72"/>
        </g>
        <g transform="translate(218,283)">
          <path d="M0,0 C-2,-5 -4,-8 -3,-10 C0,-12 3,-9 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.44)" strokeWidth=".82"/>
          <path d="M0,0 C4,-3 7,-5 8,-2 C9,1 6,3 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.44)" strokeWidth=".82"/>
          <path d="M0,0 C3,4 2,8 0,9 C-2,7 -3,4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.44)" strokeWidth=".82"/>
          <path d="M0,0 C-4,3 -7,2 -8,-1 C-7,-3 -4,-4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.44)" strokeWidth=".82"/>
          <circle cx="0" cy="0" r="1.6" fill="none" stroke="rgba(140,95,28,.5)" strokeWidth=".65"/>
        </g>
      </g>

      {/* TOP-LEFT BOTANICAL */}
      <g opacity="0.62">
        <path d="M12,14 C22,26 34,40 44,54 C54,68 62,80 70,94" fill="none" stroke="#6e4010" strokeWidth=".95" strokeLinecap="round"/>
        <path d="M30,36 C22,30 16,26 12,20" fill="none" stroke="#6e4010" strokeWidth=".65" strokeLinecap="round"/>
        <path d="M50,62 C58,56 64,50 66,42" fill="none" stroke="#6e4010" strokeWidth=".65" strokeLinecap="round"/>
        <path d="M38,46 C32,40 32,34 37,33 C42,34 42,42 38,46Z" fill="none" stroke="rgba(72,96,48,.48)" strokeWidth=".68"/>
        <path d="M58,74 C52,68 52,62 57,61 C62,62 62,70 58,74Z" fill="none" stroke="rgba(72,96,48,.44)" strokeWidth=".65"/>
        <g transform="translate(12,19)">
          <path d="M0,0 C-2,-5 -4,-8 -2,-10 C1,-12 3,-9 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.46)" strokeWidth=".82"/>
          <path d="M0,0 C4,-3 7,-4 8,-1 C8,2 5,4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.46)" strokeWidth=".82"/>
          <path d="M0,0 C3,4 2,7 0,8 C-2,7 -3,3 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.46)" strokeWidth=".82"/>
          <path d="M0,0 C-4,2 -7,1 -7,-2 C-6,-4 -3,-4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.46)" strokeWidth=".82"/>
          <circle cx="0" cy="0" r="1.6" fill="none" stroke="rgba(140,95,28,.5)" strokeWidth=".65"/>
        </g>
        <g transform="translate(66,41)">
          <path d="M0,0 C-2,-5 -4,-7 -2,-10 C1,-11 4,-8 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.42)" strokeWidth=".8"/>
          <path d="M0,0 C4,-3 7,-4 7,-1 C8,2 5,3 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.42)" strokeWidth=".8"/>
          <path d="M0,0 C2,4 1,7 0,8 C-2,6 -2,3 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.42)" strokeWidth=".8"/>
          <path d="M0,0 C-3,2 -6,1 -6,-2 C-5,-4 -2,-4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.42)" strokeWidth=".8"/>
          <circle cx="0" cy="0" r="1.5" fill="none" stroke="rgba(140,95,28,.45)" strokeWidth=".6"/>
        </g>
      </g>

      {/* SCATTERED BLOSSOMS */}
      <g transform="translate(52,105)">
        <path d="M0,0 C-2,-7 -6,-10 -4,-14 C-1,-16 3,-13 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.42)" strokeWidth=".85"/>
        <path d="M0,0 C5,-5 10,-7 12,-4 C13,-0 9,4 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.42)" strokeWidth=".85"/>
        <path d="M0,0 C4,5 3,10 0,12 C-3,10 -4,5 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.42)" strokeWidth=".85"/>
        <path d="M0,0 C-6,3 -11,2 -12,-1 C-11,-5 -6,-5 0,0Z" fill="rgba(200,128,100,.065)" stroke="rgba(148,55,55,.42)" strokeWidth=".85"/>
        <path d="M0,0 C-2,-4 2,-8 5,-6 C8,-3 6,1 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <circle cx="0" cy="0" r="2" fill="none" stroke="rgba(130,88,30,.52)" strokeWidth=".72"/>
      </g>
      <g transform="translate(258,178)">
        <path d="M0,0 C-2,-6 -5,-9 -3,-12 C0,-14 3,-11 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C4,-4 9,-6 10,-3 C11,0 8,4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C3,5 2,9 0,10 C-2,9 -3,5 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C-5,3 -9,2 -10,-1 C-9,-4 -5,-4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C-1,-3 2,-7 5,-5 C7,-2 5,2 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <circle cx="0" cy="0" r="1.8" fill="none" stroke="rgba(130,88,30,.48)" strokeWidth=".68"/>
      </g>
      <g transform="translate(155,338)">
        <path d="M0,0 C-2,-6 -5,-9 -3,-12 C0,-14 3,-11 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C4,-4 9,-6 10,-3 C11,0 8,4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C3,5 2,9 0,10 C-2,9 -3,5 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C-5,3 -9,2 -10,-1 C-9,-4 -5,-4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C-1,-3 2,-7 5,-5 C7,-2 5,2 0,0Z" fill="rgba(200,128,100,.05)" stroke="rgba(148,55,55,.36)" strokeWidth=".78"/>
        <circle cx="0" cy="0" r="1.8" fill="none" stroke="rgba(130,88,30,.44)" strokeWidth=".65"/>
      </g>
      <g transform="translate(42,295)">
        <path d="M0,0 C-2,-6 -5,-9 -3,-12 C0,-14 3,-11 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C4,-4 9,-6 10,-3 C11,0 8,4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C3,5 2,9 0,10 C-2,9 -3,5 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C-5,3 -9,2 -10,-1 C-9,-4 -5,-4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C-1,-3 2,-7 5,-5 C7,-2 5,2 0,0Z" fill="rgba(200,128,100,.05)" stroke="rgba(148,55,55,.36)" strokeWidth=".78"/>
        <circle cx="0" cy="0" r="1.8" fill="none" stroke="rgba(130,88,30,.44)" strokeWidth=".65"/>
      </g>
      <g transform="translate(150,72)">
        <path d="M0,0 C-2,-7 -6,-10 -4,-14 C-1,-16 3,-13 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C5,-5 10,-7 12,-4 C13,0 9,4 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C4,5 3,10 0,12 C-3,10 -4,5 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C-6,3 -11,2 -12,-1 C-11,-5 -6,-5 0,0Z" fill="rgba(200,128,100,.06)" stroke="rgba(148,55,55,.4)" strokeWidth=".82"/>
        <path d="M0,0 C-2,-4 2,-8 5,-6 C8,-3 6,1 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <circle cx="0" cy="0" r="2" fill="none" stroke="rgba(130,88,30,.48)" strokeWidth=".7"/>
      </g>
      <g transform="translate(272,255)">
        <path d="M0,0 C-2,-5 -4,-8 -3,-10 C0,-12 3,-9 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C4,-3 7,-5 8,-2 C9,1 6,3 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C3,4 2,8 0,9 C-2,7 -3,4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <path d="M0,0 C-4,3 -7,2 -8,-1 C-7,-3 -4,-4 0,0Z" fill="rgba(200,128,100,.055)" stroke="rgba(148,55,55,.38)" strokeWidth=".8"/>
        <circle cx="0" cy="0" r="1.6" fill="none" stroke="rgba(130,88,30,.44)" strokeWidth=".62"/>
      </g>

      {/* GHOST BOTANICAL WATERMARK */}
      <g opacity="0.048" transform="translate(150,228)">
        <path d="M0,30 C-18,12 -42,-4 -64,-16" fill="none" stroke="#6e4010" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M0,30 C18,12 42,-4 64,-16" fill="none" stroke="#6e4010" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M0,30 C-2,8 -2,-16 0,-34" fill="none" stroke="#6e4010" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M-32,4 C-40,-6 -38,-19 -31,-21 C-24,-19 -25,-8 -32,4Z" fill="rgba(62,86,38,1)" stroke="none"/>
        <path d="M-55,-9 C-62,-19 -58,-31 -51,-32 C-44,-30 -46,-19 -55,-9Z" fill="rgba(62,86,38,1)" stroke="none"/>
        <path d="M32,4 C40,-6 38,-19 31,-21 C24,-19 25,-8 32,4Z" fill="rgba(62,86,38,1)" stroke="none"/>
        <path d="M55,-9 C62,-19 58,-31 51,-32 C44,-30 46,-19 55,-9Z" fill="rgba(62,86,38,1)" stroke="none"/>
        <g transform="translate(-64,-16)">
          <path d="M0,0 C-3,-5 -2,-9 1,-10 C4,-8 3,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C4,-2 8,0 8,3 C6,5 3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C3,4 2,8 0,9 C-2,7 -3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C-4,2 -7,0 -7,-3 C-5,-5 -2,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <circle cx="0" cy="0" r="2.2" fill="rgba(140,95,28,1)"/>
        </g>
        <g transform="translate(64,-16)">
          <path d="M0,0 C-3,-5 -2,-9 1,-10 C4,-8 3,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C4,-2 8,0 8,3 C6,5 3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C3,4 2,8 0,9 C-2,7 -3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C-4,2 -7,0 -7,-3 C-5,-5 -2,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <circle cx="0" cy="0" r="2.2" fill="rgba(140,95,28,1)"/>
        </g>
        <g transform="translate(0,-34)">
          <path d="M0,0 C-3,-5 -2,-9 1,-10 C4,-8 3,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C4,-2 8,0 8,3 C6,5 3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C3,4 2,8 0,9 C-2,7 -3,4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <path d="M0,0 C-4,2 -7,0 -7,-3 C-5,-5 -2,-4 0,0Z" fill="rgba(148,55,55,1)" stroke="none"/>
          <circle cx="0" cy="0" r="2.2" fill="rgba(140,95,28,1)"/>
        </g>
      </g>

      {/* TEXT */}
      <text x="150" y="158" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="11.5" fontStyle="italic" fill="rgba(100,62,18,.56)" textAnchor="middle" letterSpacing=".2em">happy birthday</text>
      <line x1="66" y1="164" x2="110" y2="164" stroke="rgba(100,62,18,.3)" strokeWidth=".5"/>
      <line x1="190" y1="164" x2="234" y2="164" stroke="rgba(100,62,18,.3)" strokeWidth=".5"/>

      {/* TO / FROM AREA */}
      <text x="22" y="198" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(80,50,16,.52)">To,</text>
      {toName ? (
        <text x="44" y="198" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(80,50,16,.8)">{toName}</text>
      ) : null}
      <line x1="22" y1="214" x2="188" y2="214" stroke="rgba(80,50,16,.26)" strokeWidth=".5" strokeDasharray="3,4"/>
      {msgLines.map((line, i) => (
        <text key={i} x="22" y={212 + i * 19} fontFamily="Cormorant Garamond,Georgia,serif" fontSize="11" fill="rgba(80,50,16,.65)">{line}</text>
      ))}
      {!msgLines.length && (<>
        <line x1="22" y1="232" x2="192" y2="232" stroke="rgba(80,50,16,.22)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="22" y1="250" x2="182" y2="250" stroke="rgba(80,50,16,.22)" strokeWidth=".5" strokeDasharray="3,4"/>
        <line x1="22" y1="268" x2="188" y2="268" stroke="rgba(80,50,16,.2)" strokeWidth=".5" strokeDasharray="3,4"/>
      </>)}
      <text x="22" y="352" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="13" fontStyle="italic" fill="rgba(80,50,16,.52)">From,</text>
      {fromName ? (
        <text x="58" y="352" fontFamily="Cormorant Garamond,Georgia,serif" fontSize="12" fontStyle="italic" fill="rgba(80,50,16,.8)">{fromName}</text>
      ) : null}
      <line x1="22" y1="368" x2="130" y2="368" stroke="rgba(80,50,16,.26)" strokeWidth=".5" strokeDasharray="3,4"/>
      <text x="150" y="391" fontFamily="Georgia,serif" fontSize="7.5" fill="rgba(100,65,18,.42)" fontStyle="italic" textAnchor="middle" letterSpacing=".05em">for you, with joy</text>

      <rect width="300" height="400" fill={`url(#${uid}vignette)`}/>
    </svg>
  );
}
