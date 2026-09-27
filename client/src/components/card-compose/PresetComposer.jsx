import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTransition } from '../../context/TransitionContext';
import { createCard } from '../../lib/api';
import { messageFits } from '../../lib/wrapMessage';
import ScaledCard from './ScaledCard';
import MusicPicker from './MusicPicker';
import SendSuccess from './SendSuccess';
import {
  BG, CREAM, CHROME, CHROME_RULE, GOLD_BORDER,
  ROSE, ROSE_FULL, ROSE_BORDER, ERROR,
} from './tokens';

const NAME_MAX = 40;
const MESSAGE_MAX = 140;

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

function SectionLabel({ children, htmlFor, aside }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
      <label htmlFor={htmlFor} style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.6rem',
        fontWeight: 400,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: CHROME,
      }}>
        {children}
      </label>
      {aside}
    </div>
  );
}

const fieldStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `0.5px solid ${CHROME_RULE}`,
  borderRadius: 0,
  outline: 'none',
  color: CREAM,
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontStyle: 'italic',
  fontSize: 'clamp(1.05rem, 1rem + 0.3vw, 1.25rem)',
  padding: '0.55rem 0',
  minHeight: 44,
  transition: 'border-color 240ms ease',
};

export default function PresetComposer({ card }) {
  const { transitionTo } = useTransition();
  const [toName, setToName]     = useState('');
  const [fromName, setFromName] = useState('');
  const [message, setMessage]   = useState('');
  const [musicId, setMusicId]   = useState(null);
  const [status, setStatus]     = useState('idle'); // idle | sending | sent
  const [error, setError]       = useState('');
  const [sentId, setSentId]     = useState(null);

  const trimmed = message.trim();
  const fits = messageFits(trimmed, card.messageLayout);
  const canSend = trimmed.length > 0 && fits && status === 'idle';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setStatus('sending');
    setError('');
    try {
      const saved = await createCard({
        type: 'preset',
        preset_id: card.id,
        to_name: toName.trim() || null,
        from_name: fromName.trim() || null,
        message: trimmed,
        music_id: musicId,
        theme: card.theme,
      });
      setSentId(saved.id);
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="fc-page" style={{ background: BG, color: CREAM }}>
      <style>{`
        .fc-page {
          min-height: 100dvh;
          position: relative;
          background-image: radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.05), transparent 60%);
        }
        .fc-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          padding: clamp(4.5rem, 10vw, 5.5rem) 16px clamp(2rem, 6vw, 3rem);
          max-width: 1180px;
          margin: 0 auto;
        }
        .fc-preview { height: min(52dvh, 460px); display: flex; flex-direction: column; }
        .fc-panel { width: 100%; max-width: 440px; margin: 0 auto; }
        .fc-back { position: absolute; }
        .fc-page input:focus, .fc-page textarea:focus { border-bottom-color: ${GOLD_BORDER} !important; }
        .fc-page input::placeholder, .fc-page textarea::placeholder { color: rgba(245,237,224,0.22); }
        @media (min-width: 768px) {
          .fc-layout {
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            align-items: center;
            min-height: 100dvh;
            padding: 5rem clamp(2rem, 5vw, 4rem) 3rem;
          }
          .fc-preview { position: sticky; top: 5rem; height: min(78dvh, 680px); }
          .fc-panel { margin: 0; }
          .fc-back { position: fixed; }
        }
      `}</style>

      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px',
        opacity: 0.05, mixBlendMode: 'overlay',
      }} />

      {/* Back to gallery */}
      <button
        type="button"
        onClick={() => transitionTo('/gallery')}
        className="fc-back"
        style={{
          top: '1.1rem', left: 'clamp(16px, 3vw, 2rem)', zIndex: 20,
          minHeight: 44, display: 'flex', alignItems: 'center', gap: '0.55rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: "'Jost', sans-serif", fontSize: '0.58rem', fontWeight: 300,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,237,224,0.5)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M7 1.5L2.5 5L7 8.5M2.5 5H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        gallery
      </button>

      <div className="fc-layout" style={{ position: 'relative', zIndex: 1 }}>
        {/* Live preview */}
        <div className="fc-preview">
          <div style={{ flex: 1, minHeight: 0 }}>
            <ScaledCard card={card} toName={toName.trim()} fromName={fromName.trim()} message={trimmed} />
          </div>
          <p style={{
            marginTop: '1.1rem',
            textAlign: 'center',
            fontFamily: card.nameFont,
            fontStyle: card.nameItalic ? 'italic' : 'normal',
            fontSize: 'clamp(1.1rem, 1rem + 0.6vw, 1.5rem)',
            color: card.nameColor,
          }}>
            {card.name}
          </p>
        </div>

        {/* Form / success */}
        <div className="fc-panel">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <SendSuccess key="sent" cardId={sentId} />
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSend}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.4rem, 3vw, 1.9rem)' }}
              >
                <header>
                  <p style={{
                    fontFamily: "'Jost', sans-serif", fontSize: '0.6rem', fontWeight: 400,
                    letterSpacing: '0.24em', textTransform: 'uppercase', color: CHROME,
                  }}>
                    {card.occasion} · write your card
                  </p>
                  <h1 style={{
                    marginTop: '0.6rem',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic', fontWeight: 300,
                    fontSize: 'clamp(2rem, 1.6rem + 1.6vw, 2.8rem)',
                    lineHeight: 1.05, color: CREAM,
                  }}>
                    A few words, from the heart
                  </h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div>
                    <SectionLabel htmlFor="fc-to">To <span style={{ opacity: 0.6 }}>· optional</span></SectionLabel>
                    <input
                      id="fc-to" value={toName} maxLength={NAME_MAX} autoComplete="off"
                      placeholder="their name" onChange={e => setToName(e.target.value)}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <SectionLabel htmlFor="fc-from">From <span style={{ opacity: 0.6 }}>· optional</span></SectionLabel>
                    <input
                      id="fc-from" value={fromName} maxLength={NAME_MAX} autoComplete="off"
                      placeholder="your name" onChange={e => setFromName(e.target.value)}
                      style={fieldStyle}
                    />
                  </div>
                </div>

                <div>
                  <SectionLabel
                    htmlFor="fc-message"
                    aside={
                      <span style={{
                        fontFamily: "'Jost', sans-serif", fontSize: '0.62rem', fontWeight: 300,
                        letterSpacing: '0.06em', color: fits ? CHROME : ERROR,
                      }}>
                        {message.length} / {MESSAGE_MAX}
                      </span>
                    }
                  >
                    Message
                  </SectionLabel>
                  <textarea
                    id="fc-message"
                    value={message}
                    maxLength={MESSAGE_MAX}
                    rows={4}
                    placeholder="write something only you could say"
                    // The cards lay text out as wrapped lines, so keep it one paragraph
                    onChange={e => setMessage(e.target.value.replace(/\n/g, ' '))}
                    style={{ ...fieldStyle, resize: 'none', lineHeight: 1.5 }}
                  />
                  <AnimatePresence>
                    {!fits && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          marginTop: '0.55rem', fontFamily: "'Jost', sans-serif",
                          fontSize: '0.72rem', fontWeight: 300, color: ERROR,
                        }}
                      >
                        A little long for this card — the last words won't fit. Try trimming it.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <SectionLabel>Music</SectionLabel>
                  <MusicPicker value={musicId} onChange={setMusicId} />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!canSend}
                    style={{
                      width: '100%',
                      minHeight: 48,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      background: 'none',
                      border: `0.5px solid ${canSend ? ROSE_BORDER : 'rgba(245,237,224,0.12)'}`,
                      borderRadius: '2px',
                      cursor: canSend ? 'pointer' : 'default',
                      fontFamily: "'Jost', sans-serif", fontSize: '0.66rem', fontWeight: 400,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: canSend ? ROSE : 'rgba(245,237,224,0.3)',
                      transition: 'color 220ms ease, border-color 220ms ease, box-shadow 280ms ease',
                    }}
                    onMouseEnter={e => {
                      if (!canSend) return;
                      e.currentTarget.style.color = ROSE_FULL;
                      e.currentTarget.style.borderColor = ROSE_FULL;
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(196,149,106,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = canSend ? ROSE : 'rgba(245,237,224,0.3)';
                      e.currentTarget.style.borderColor = canSend ? ROSE_BORDER : 'rgba(245,237,224,0.12)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {status === 'sending' ? 'sending…' : 'Send this card'}
                    {status !== 'sending' && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                        <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  {error && (
                    <p role="alert" style={{
                      marginTop: '0.7rem', fontFamily: "'Jost', sans-serif",
                      fontSize: '0.74rem', fontWeight: 300, color: ERROR, textAlign: 'center',
                    }}>
                      {error}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
