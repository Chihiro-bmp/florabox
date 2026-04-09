import { motion, AnimatePresence } from 'framer-motion';

export default function CardNameReveal({ name, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          key={name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(22px, 3vw, 34px)',
            color: 'rgba(245,237,224,0.82)',
            margin: '24px 0 0',
            textAlign: 'center',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {name}
        </motion.p>
      )}
    </AnimatePresence>
  );
}