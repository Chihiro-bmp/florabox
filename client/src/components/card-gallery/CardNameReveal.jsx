import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -8 },
};

export default function CardNameReveal({ name, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={name}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '24px 0 0',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px, 3vw, 34px)',
            color: 'rgba(201,168,76,0.9)',
            textAlign: 'center',
            letterSpacing: '0.04em',
            margin: 0,
          }}>
            {name}
          </p>

          {/* Gold hairline rule */}
          <motion.div
            variants={variants}
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(201,168,76,0.4)',
              marginTop: '0.55rem',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
