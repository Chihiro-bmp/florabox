import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTransition } from '../../context/TransitionContext';
import { CREAM, CHROME, CHROME_RULE, GOLD, GOLD_BORDER, ROSE, ROSE_BORDER } from './tokens';

const linkButton = {
  minHeight: 44,
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: "'Jost', sans-serif", fontSize: '0.6rem', fontWeight: 400,
  letterSpacing: '0.18em', textTransform: 'uppercase',
};

export default function SendSuccess({ cardId }) {
  const { transitionTo } = useTransition();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const link = `${window.location.origin}/view/${cardId}`;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back to selection
      inputRef.current?.select();
      document.execCommand?.('copy');
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}
    >
      <header>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: '0.6rem', fontWeight: 400,
          letterSpacing: '0.24em', textTransform: 'uppercase', color: CHROME,
        }}>
          sent
        </p>
        <h1 style={{
          marginTop: '0.6rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(2rem, 1.6rem + 1.6vw, 2.8rem)',
          lineHeight: 1.05, color: CREAM,
        }}>
          Your card is on its way
        </h1>
        <p style={{
          marginTop: '0.8rem', fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(245,237,224,0.6)',
        }}>
          Share this link with them — it opens your card, just as you wrote it.
        </p>
      </header>

      <div style={{
        display: 'flex', alignItems: 'stretch',
        border: `0.5px solid ${CHROME_RULE}`, borderRadius: '2px',
      }}>
        <input
          ref={inputRef}
          readOnly
          value={link}
          aria-label="Shareable link"
          onFocus={e => e.target.select()}
          style={{
            flex: 1, minWidth: 0, minHeight: 48, padding: '0 0.9rem',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.74rem',
            color: 'rgba(245,237,224,0.78)',
          }}
        />
        <button
          type="button"
          onClick={copy}
          style={{
            ...linkButton,
            padding: '0 1.1rem',
            borderLeft: `0.5px solid ${copied ? GOLD_BORDER : CHROME_RULE}`,
            color: copied ? GOLD : ROSE,
            transition: 'color 220ms ease, border-color 220ms ease',
          }}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.8rem' }}>
        <button
          type="button"
          onClick={() => transitionTo(`/view/${cardId}`)}
          style={{ ...linkButton, color: ROSE, borderBottom: `0.5px solid ${ROSE_BORDER}` }}
        >
          open it
        </button>
        <button
          type="button"
          onClick={() => transitionTo('/gallery')}
          style={{ ...linkButton, color: 'rgba(245,237,224,0.5)' }}
        >
          send another
        </button>
      </div>
    </motion.div>
  );
}
