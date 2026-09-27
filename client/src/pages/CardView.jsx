import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTransition } from '../context/TransitionContext';
import { getCard } from '../lib/api';
import { getCardById } from '../data/cards';
import { MUSIC_TRACKS } from '../data/music';
import ScaledCard from '../components/card-compose/ScaledCard';
import EnvelopeReveal from '../components/card-viewer/EnvelopeReveal';
import RevealAnimation from '../components/card-viewer/RevealAnimation';

const INK        = '#1e1008';
const WARM_BROWN = '#3d2510';
const MUTED      = 'rgba(61,37,16,0.6)';

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Page({ children }) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '100dvh',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 38%, #f7f0e4 0%, #f5ede0 45%, #ede0cc 100%)',
      color: INK,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(4rem, 10vw, 5rem) 16px',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px',
        opacity: 0.07, mixBlendMode: 'multiply',
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function SendYourOwn({ delay = 0 }) {
  const { transitionTo } = useTransition();
  return (
    <motion.button
      type="button"
      onClick={() => transitionTo('/')}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        minHeight: 44, padding: '0 0.2rem',
        display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: '0.5px solid rgba(61,37,16,0.3)',
        fontFamily: "'Jost', sans-serif", fontSize: '0.62rem', fontWeight: 400,
        letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED,
      }}
      onMouseEnter={e => { e.currentTarget.style.color = WARM_BROWN; }}
      onMouseLeave={e => { e.currentTarget.style.color = MUTED; }}
    >
      Send your own Florabox
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path d="M1 8L8 1M8 1H2.5M8 1V6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.button>
  );
}

function Notice({ title, body }) {
  return (
    <Page>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 1.5rem + 1.4vw, 2.6rem)',
        }}>
          {title}
        </h1>
        <p style={{
          margin: '0.8rem 0 1.8rem', fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: '0.88rem', lineHeight: 1.6, color: MUTED,
        }}>
          {body}
        </p>
        <SendYourOwn />
      </div>
    </Page>
  );
}

function SoundToggle({ muted, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Play music' : 'Mute music'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{
        position: 'fixed', top: '1rem', right: 'clamp(16px, 3vw, 2rem)', zIndex: 40,
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: '0.5px solid rgba(61,37,16,0.25)', borderRadius: 2,
        color: WARM_BROWN, cursor: 'pointer',
      }}
    >
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1.5 5H4L7.5 2V12L4 9H1.5Z" />
        {muted ? (
          <path d="M10.5 5L14 9M14 5L10.5 9" />
        ) : (
          <>
            <path d="M10 4.5C11 5.5 11 8.5 10 9.5" />
            <path d="M12 3C14 5 14 9 12 11" />
          </>
        )}
      </svg>
    </motion.button>
  );
}

export default function CardView() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading' }); // loading | ready | missing | failed
  const [stage, setStage] = useState('sealed');              // sealed | opening | revealed
  const [animating, setAnimating] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getCard(id)
      .then(data => { if (!cancelled) setState({ status: 'ready', data }); })
      .catch(err => {
        if (cancelled) return;
        setState({ status: /not found/i.test(err.message) ? 'missing' : 'failed' });
      });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => () => audioRef.current?.pause(), []);

  if (state.status === 'loading') {
    return <Page><span aria-label="Loading" /></Page>;
  }
  if (state.status === 'missing') {
    return <Notice title="This card has drifted away" body="The link may be mistyped, or the card is no longer here." />;
  }
  if (state.status === 'failed') {
    return <Notice title="The card couldn't be opened" body="Something went wrong on our side. Please try the link again in a moment." />;
  }

  const saved = state.data;
  const card = saved.type === 'preset' ? getCardById(saved.preset_id) : null;
  if (!card) {
    return <Notice title="This card can't be shown yet" body="It was made with a design this page doesn't know how to draw." />;
  }

  const track = MUSIC_TRACKS.find(t => t.id && t.id === saved.music_id);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    // The tap is the user gesture browsers require before audio can play
    if (track?.src) {
      const audio = new Audio(track.src);
      audio.loop = true;
      audio.volume = 0.7;
      audio.play().catch(() => setMuted(true));
      audioRef.current = audio;
      setHasAudio(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) { audio.play().catch(() => {}); setMuted(false); }
    else { audio.pause(); setMuted(true); }
  };

  return (
    <Page>
      <AnimatePresence mode="wait">
        {stage !== 'revealed' ? (
          <EnvelopeReveal
            key="envelope"
            toName={saved.to_name}
            opening={stage === 'opening'}
            onOpen={handleOpen}
            onOpened={() => { setStage('revealed'); setAnimating(true); }}
          />
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'clamp(1.2rem, 3vw, 1.8rem)', width: '100%',
            }}
          >
            <div style={{ width: 'min(100%, 520px)', height: 'min(74dvh, 680px)' }}>
              <ScaledCard
                card={card}
                toName={saved.to_name ?? ''}
                fromName={saved.from_name ?? ''}
                message={saved.message ?? ''}
                shadow="0 0 0 0.5px rgba(30,16,8,0.18), 0 18px 50px rgba(61,37,16,0.18), 0 4px 12px rgba(61,37,16,0.08)"
              />
            </div>
            <SendYourOwn delay={1.8} />
          </motion.div>
        )}
      </AnimatePresence>

      {animating && <RevealAnimation theme={saved.theme} onDone={() => setAnimating(false)} />}
      {hasAudio && <SoundToggle muted={muted} onToggle={toggleMute} />}
    </Page>
  );
}
