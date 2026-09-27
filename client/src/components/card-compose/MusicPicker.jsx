import { useEffect, useRef, useState } from 'react';
import { MUSIC_TRACKS } from '../../data/music';
import { GOLD, GOLD_BORDER, CHROME, CREAM } from './tokens';

function PlayIcon({ playing }) {
  return playing ? (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <line x1="3" y1="1.5" x2="3" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="1.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2.5 1.5L8.5 5L2.5 8.5Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    </svg>
  );
}

// Fine hairline sprig used as the selection mark
function SelectedMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="0.7"/>
      <circle cx="7" cy="7" r="2" fill="currentColor"/>
    </svg>
  );
}

export default function MusicPicker({ value, onChange }) {
  const audioRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const togglePreview = (track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(track.src);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  return (
    <div role="radiogroup" aria-label="Music" style={{ display: 'flex', flexDirection: 'column' }}>
      {MUSIC_TRACKS.map(track => {
        const selected = value === track.id;
        return (
          <div
            key={track.id ?? 'none'}
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '0.5px solid rgba(245,237,224,0.08)',
            }}
          >
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(track.id)}
              style={{
                flex: 1,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.4rem 0',
                textAlign: 'left',
                color: selected ? CREAM : 'rgba(245,237,224,0.62)',
              }}
            >
              <span style={{ width: 14, display: 'inline-flex', color: selected ? GOLD : 'rgba(245,237,224,0.18)' }}>
                {selected ? <SelectedMark /> : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="0.7"/>
                  </svg>
                )}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.1rem)',
                  lineHeight: 1.2,
                }}>
                  {track.title}
                </span>
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  color: CHROME,
                }}>
                  {track.mood}
                </span>
              </span>
            </button>
            {track.src && (
              <button
                type="button"
                aria-label={playingId === track.id ? `Pause ${track.title}` : `Preview ${track.title}`}
                onClick={() => togglePreview(track)}
                style={{
                  width: 44,
                  height: 44,
                  marginLeft: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: `0.5px solid ${playingId === track.id ? GOLD_BORDER : 'rgba(245,237,224,0.14)'}`,
                  borderRadius: '2px',
                  color: playingId === track.id ? GOLD : CHROME,
                  cursor: 'pointer',
                }}
              >
                <PlayIcon playing={playingId === track.id} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
