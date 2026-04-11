import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'

export default function TransitionCurtain() {
  const { visible } = useTransition()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#080709',
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  )
}
