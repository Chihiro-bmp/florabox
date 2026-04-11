import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '../../context/TransitionContext';

const THUMB_H = 80;
const THUMB_W = 60;
const NATIVE_W = 300;
const NATIVE_H = 400;
const THUMB_SCALE = THUMB_H / NATIVE_H;

export default function CardPreviewStrip({ cards, selectedIndex, onSelect }) {
  const { transitionTo } = useTransition();
  const selectedCard = cards[selectedIndex];

  const handleUse = () => {
    transitionTo(`/card/new?preset=${selectedCard.id}`);
  };

  return (
    <AnimatePresence>
      {selectedIndex !== null && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            background: 'linear-gradient(to top, rgba(10,6,3,0.97) 0%, rgba(18,10,5,0.92) 100%)',
            borderTop: '0.5px solid rgba(245,237,224,0.12)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* CTA */}
          <button
            onClick={handleUse}
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              letterSpacing: '0.1em',
              color: '#f5ede0',
              background: '#3d2510',
              border: 'none',
              borderRadius: '4px',
              padding: '0 28px',
              height: '44px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Use this card
            <svg style={{ marginLeft: '8px', verticalAlign: 'middle' }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="#f5ede0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflowX: 'auto', maxWidth: '100%', padding: '4px 0' }}>
            {cards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => onSelect(i)}
                style={{
                  flexShrink: 0,
                  width: THUMB_W,
                  height: THUMB_H,
                  borderRadius: '3px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: i === selectedIndex
                    ? '1px solid rgba(245,237,224,0.7)'
                    : '1px solid rgba(245,237,224,0.15)',
                  padding: 0,
                  background: 'none',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: NATIVE_W,
                  height: NATIVE_H,
                  transformOrigin: 'top left',
                  transform: `scale(${THUMB_SCALE})`,
                  pointerEvents: 'none',
                }}>
                  <card.Component />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}