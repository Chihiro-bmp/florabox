import { motion } from 'framer-motion';

const INK   = '#1e1008';
const PAPER = '#efe2cb';
const INNER = '#e4d3b6';
const BLUSH = '#c97888';

const W = 340;
const H = 230;
const FLAP_H = 158;

// Five-petal ink blossom pressed into the wax seal
function SealMark() {
  return (
    <g stroke="rgba(245,237,224,0.85)" strokeWidth="0.8" fill="none">
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="0" cy="-5.2" rx="2.9" ry="4.6" transform={`rotate(${a})`} />
      ))}
      <circle r="1.4" fill="rgba(245,237,224,0.85)" stroke="none" />
    </g>
  );
}

/**
 * Sealed envelope. `opening` plays: seal lifts away → flap folds back →
 * the letter slides up out of the pocket. Calls onOpened when the letter is out.
 */
export default function EnvelopeReveal({ toName, opening, onOpen, onOpened }) {
  const ease = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.5, ease: 'easeIn' } }}
      transition={{ duration: 0.9, ease }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(1.4rem, 4vw, 2.2rem)' }}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label="Open your card"
        style={{
          background: 'none', border: 'none', padding: 0,
          cursor: opening ? 'default' : 'pointer',
          width: 'min(86vw, 420px)',
          perspective: 900,
        }}
      >
        <motion.div
          animate={opening ? { y: 0 } : { y: [0, -6, 0] }}
          transition={opening ? { duration: 0.3 } : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}` }}
        >
          {/* Back of the envelope + inner lining */}
          <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="3" fill={INNER} stroke={INK} strokeOpacity="0.55" strokeWidth="0.8" />
          </svg>

          {/* Letter — slides up out of the pocket */}
          <motion.div
            initial={false}
            animate={opening ? { y: '-58%' } : { y: '0%' }}
            transition={{ delay: 0.95, duration: 0.9, ease }}
            onAnimationComplete={() => opening && onOpened?.()}
            style={{
              position: 'absolute', left: '7%', right: '7%', top: '6%', height: '88%',
              background: '#f7efe1',
              border: `0.5px solid rgba(30,16,8,0.25)`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(30,16,8,0.08)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: '8%',
              zIndex: 1,
            }}
          >
            <svg width="54" height="16" viewBox="0 0 54 16" aria-hidden="true">
              <line x1="0" y1="8" x2="18" y2="8" stroke={INK} strokeOpacity="0.3" strokeWidth="0.5" />
              <circle cx="27" cy="8" r="2.2" fill="none" stroke={BLUSH} strokeWidth="0.7" />
              <line x1="36" y1="8" x2="54" y2="8" stroke={INK} strokeOpacity="0.3" strokeWidth="0.5" />
            </svg>
          </motion.div>

          {/* Front pocket — covers the lower part of the letter */}
          <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
            <path
              d={`M0.5 ${H - 0.5} L0.5 0.5 L${W / 2} 150 L${W - 0.5} 0.5 L${W - 0.5} ${H - 0.5} Z`}
              fill={PAPER} stroke={INK} strokeOpacity="0.55" strokeWidth="0.8" strokeLinejoin="round"
            />
            {/* side folds */}
            <path d={`M0.5 ${H - 0.5} L${W * 0.42} 138`} stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
            <path d={`M${W - 0.5} ${H - 0.5} L${W * 0.58} 138`} stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" />
            {/* botanical hairline sprig, bottom-right */}
            <g stroke={INK} strokeOpacity="0.35" strokeWidth="0.6" fill="none" strokeLinecap="round">
              <path d="M300 214 C 292 200, 286 192, 272 186" />
              <path d="M290 202 c -6 -2 -9 -7 -8 -12 c 5 1 8 6 8 12 Z" />
              <path d="M282 194 c -2 -6 0 -11 4 -13 c 2 5 0 10 -4 13 Z" />
              <circle cx="271" cy="185.5" r="2" stroke={BLUSH} strokeOpacity="0.8" />
            </g>
          </svg>

          {/* Top flap — folds back on open */}
          <motion.div
            initial={false}
            animate={opening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 2 }}
            transition={{
              delay: 0.3, duration: 0.75, ease: [0.65, 0, 0.35, 1],
              // Drop behind the letter once the flap passes vertical
              zIndex: { delay: opening ? 0.68 : 0, duration: 0 },
            }}
            style={{
              position: 'absolute', left: 0, top: 0, width: '100%', height: `${(FLAP_H / H) * 100}%`,
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg viewBox={`0 0 ${W} ${FLAP_H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}>
              <path
                d={`M0.5 0.5 L${W / 2} ${FLAP_H - 2} L${W - 0.5} 0.5 Z`}
                fill={PAPER} stroke={INK} strokeOpacity="0.55" strokeWidth="0.8" strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Wax seal */}
          <motion.div
            initial={false}
            animate={opening ? { opacity: 0, scale: 0.6, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'absolute', left: '50%', top: `${((FLAP_H - 4) / H) * 100}%`,
              width: '13%', aspectRatio: '1', translate: '-50% -50%', zIndex: 3,
            }}
          >
            <svg viewBox="-20 -20 40 40" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path
                d="M0 -17 C 9 -18, 17 -10, 17 -1 C 18 9, 9 17, 0 17 C -10 18, -17 9, -17 0 C -18 -9, -9 -17, 0 -17 Z"
                fill={BLUSH}
              />
              <circle r="12" fill="none" stroke="rgba(245,237,224,0.35)" strokeWidth="0.6" />
              <SealMark />
            </svg>
          </motion.div>
        </motion.div>
      </button>

      <motion.div
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center' }}
      >
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1.6rem, 1.3rem + 1.4vw, 2.4rem)', color: INK, lineHeight: 1.15,
        }}>
          {toName ? <>A card for {toName}</> : 'A card for you'}
        </p>
        <p style={{
          marginTop: '0.7rem',
          fontFamily: "'Jost', sans-serif", fontSize: '0.62rem', fontWeight: 400,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(61,37,16,0.6)',
        }}>
          tap to open
        </p>
      </motion.div>
    </motion.div>
  );
}
