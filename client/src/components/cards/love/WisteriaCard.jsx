import { useMemo } from 'react';

export default function WisteriaCard({
  toName = '',
  fromName = '',
  message = '',
  // optional position overrides for fine tuning per-card
  toPos = { left: '42%', top: '16%' },
  messageTop = '62%',
  fromPos = { left: '8%', bottom: '12%' },
}) {
  const msgLines = useMemo(() => {
    if (!message) return [];
    return message.match(/.{1,32}(\s|$)/g)?.map(s => s.trim()).filter(Boolean).slice(0, 5) ?? [];
  }, [message]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '4px',
        fontFamily: '"Cormorant Garamond", "Noto Serif JP", Georgia, serif',
      }}
    >
      {/* ══════ BACKGROUND IMAGE — full bleed ══════ */}
      <img
        src="/cards/wisteria-bg.jpg"
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* ══════ CONTENT LAYER ══════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          padding: 'clamp(16px, 5%, 28px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Position the To label on the building beam (absolute, transparent background) */}
        <div
          aria-hidden
          style={{
              position: 'absolute',
              zIndex: 3,
              pointerEvents: 'none',
              left: toPos.left,
              top: toPos.top,
            }}
        >
          <span
            style={{
              fontSize: 'clamp(12px, 3.2vw, 14px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(46, 26, 8, 0.9)',
              letterSpacing: '0.02em',
              background: 'transparent',
            }}
          >
            To,
          </span>
          {toName && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: 'clamp(12px, 3.2vw, 14px)',
                fontStyle: 'italic',
                color: 'rgba(46, 26, 8, 0.95)',
                letterSpacing: '0.02em',
                background: 'transparent',
              }}
            >
              {toName}
            </span>
          )}
        </div>

        {/* Message: placed below the flowers, centered */}
        <div
          style={{
              position: 'absolute',
              left: '50%',
              top: messageTop,
              transform: 'translateX(-50%)',
              width: '72%',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'none',
            }}
        >
          {msgLines.length > 0
            ? msgLines.map((line, i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    fontWeight: 300,
                    color: 'rgba(46, 26, 8, 0.92)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    letterSpacing: '0.01em',
                    background: 'transparent',
                  }}
                >
                  {line}
                </span>
              ))
            : [0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    height: '0.5px',
                    width: `${80 - i * 10}%`,
                    marginTop: i === 0 ? '6px' : '12px',
                    background:
                      'repeating-linear-gradient(to right, rgba(46,26,8,0.12) 0, rgba(46,26,8,0.12) 3px, transparent 3px, transparent 7px)',
                  }}
                />
              ))}
        </div>

        {/* From: placed bottom-right, above the quote */}
        <div
          style={{
              position: 'absolute',
              zIndex: 4,
              pointerEvents: 'none',
              left: fromPos.left,
              bottom: fromPos.bottom,
              textAlign: 'left',
            }}
        >
          <span
            style={{
              fontSize: 'clamp(12px, 3.2vw, 14px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(46, 26, 8, 0.9)',
              letterSpacing: '0.02em',
              background: 'transparent',
            }}
          >
            From,
          </span>
          {fromName && (
            <span
              style={{
                display: 'inline-block',
                marginLeft: '8px',
                fontSize: 'clamp(12px, 3.2vw, 14px)',
                fontStyle: 'italic',
                color: 'rgba(46, 26, 8, 0.95)',
                letterSpacing: '0.02em',
                background: 'transparent',
              }}
            >
              {fromName}
            </span>
          )}
        </div>

        {/* ── Bottom — 「想い」 ── (keep this as visual anchor)
             It's slightly behind the From text because From should sit above the quote */}
        <div
          style={{
            position: 'absolute',
            right: '6%',
            bottom: '4%',
            zIndex: 2,
            padding: '4px 8px',
            background: 'transparent',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '2px',
          }}
        >
          <span
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 'clamp(9px, 2.4vw, 11px)',
              color: 'rgba(110, 68, 120, 0.50)',
              letterSpacing: '0.04em',
            }}
          >
            「想い」
          </span>
        </div>
      </div>

      {/* ══════ HAIRLINE BORDER ══════ */}
      <div
        style={{
          position: 'absolute',
          inset: '2%',
          border: '0.5px solid rgba(46, 26, 8, 0.08)',
          borderRadius: '2px',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </div>
  );
}
