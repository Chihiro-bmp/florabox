import { useSearchParams } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';
import { getCardById } from '../data/cards';
import PresetComposer from '../components/card-compose/PresetComposer';
import { BG, CREAM, CHROME, ROSE, ROSE_BORDER } from '../components/card-compose/tokens';

// Shown for the craftsman builder (no preset yet) or an unknown preset id
function Notice({ title, body }) {
  const { transitionTo } = useTransition();
  return (
    <div style={{
      minHeight: '100dvh', background: BG, color: CREAM,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 1.5rem + 1.4vw, 2.6rem)',
        }}>
          {title}
        </h1>
        <p style={{
          marginTop: '0.8rem', fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: '0.88rem', lineHeight: 1.6, color: CHROME,
        }}>
          {body}
        </p>
        <button
          type="button"
          onClick={() => transitionTo('/gallery')}
          style={{
            marginTop: '1.8rem', minHeight: 44, padding: '0 1.3rem',
            background: 'none', border: `0.5px solid ${ROSE_BORDER}`, borderRadius: '2px',
            cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '0.62rem',
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ROSE,
          }}
        >
          back to the gallery
        </button>
      </div>
    </div>
  );
}

export default function CardBuilder() {
  const [params] = useSearchParams();
  const presetId = params.get('preset');

  if (!presetId) {
    return (
      <Notice
        title="The craftsman's table is being set"
        body="Soon you'll be able to design a card from scratch. For now, choose one from the gallery."
      />
    );
  }

  const card = getCardById(presetId);
  if (!card) {
    return (
      <Notice
        title="We couldn't find that card"
        body="It may have been moved. Pick another from the gallery."
      />
    );
  }

  return <PresetComposer key={card.id} card={card} />;
}
