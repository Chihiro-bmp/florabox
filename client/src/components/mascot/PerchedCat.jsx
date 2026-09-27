import { useEffect, useRef, useState } from 'react';
import { SEATED } from './catShapes';
import { SeatedCat } from './CatParts';

/**
 * Small-screen mascot: sits on top of an element (position it from the parent),
 * blinks and flicks its tail with CSS; a tap makes it hop.
 */
export default function PerchedCat({ height = 52, style }) {
  const [hopping, setHopping] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const hop = (e) => {
    e.stopPropagation();
    if (hopping) return;
    setHopping(true);
    timer.current = setTimeout(() => setHopping(false), 520);
  };

  const [, , w, h] = SEATED.viewBox.split(' ').map(Number);

  return (
    <div
      role="img"
      aria-label="Florabox cat"
      onClick={hop}
      onTouchStart={hop}
      className={`fb-perched-cat${hopping ? ' is-hopping' : ''}`}
      style={{ width: (height * w) / h, height, cursor: 'pointer', ...style }}
    >
      <style>{`
        .fb-perched-cat { transform-origin: 50% 100%; animation: fbCatIn 900ms cubic-bezier(.16,1,.3,1) both; }
        .fb-perched-cat.is-hopping { animation: fbCatHop 520ms cubic-bezier(.3,.7,.4,1); }
        .fb-perched-cat .fb-cat-tail { animation: fbCatTail 6s ease-in-out infinite; }
        .fb-perched-cat .fb-cat-eyes-open { animation: fbCatOpen 4.6s steps(1) infinite; }
        .fb-perched-cat .fb-cat-eyes-closed { display: inline !important; animation: fbCatClosed 4.6s steps(1) infinite; }
        .fb-perched-cat.is-hopping .fb-cat-eyes-open { opacity: 0 !important; animation: none; }
        .fb-perched-cat.is-hopping .fb-cat-eyes-closed { opacity: 1 !important; animation: none; }
        @keyframes fbCatIn   { from { opacity: 0; transform: translateY(8px) scale(.9); } to { opacity: 1; transform: none; } }
        @keyframes fbCatHop  { 0% { transform: none; } 18% { transform: scale(1.06,.9); } 50% { transform: translateY(-16px) scale(.96,1.05); } 82% { transform: scale(1.05,.93); } 100% { transform: none; } }
        @keyframes fbCatTail { 0%, 70%, 100% { transform: rotate(0deg); } 76% { transform: rotate(-9deg); } 82% { transform: rotate(5deg); } 88% { transform: rotate(-4deg); } }
        @keyframes fbCatOpen   { 0%, 93% { opacity: 1; } 94%, 97% { opacity: 0; } 98% { opacity: 1; } }
        @keyframes fbCatClosed { 0%, 93% { opacity: 0; } 94%, 97% { opacity: 1; } 98% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .fb-perched-cat, .fb-perched-cat .fb-cat-tail { animation: none !important; }
        }
      `}</style>
      <svg viewBox={SEATED.viewBox} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
        <SeatedCat />
      </svg>
    </div>
  );
}
