export default function NavigationButtons({ onPrev, onNext }) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous card"
        style={{
          position: 'fixed',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px',
          opacity: 0.45,
          transition: 'opacity 0.2s',
          zIndex: 20,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="14" y1="2" x2="14" y2="26" stroke="#f5ede0" strokeWidth="0.75" strokeLinecap="round"/>
          <line x1="2" y1="14" x2="26" y2="14" stroke="#f5ede0" strokeWidth="0.75" strokeLinecap="round"/>
        </svg>
      </button>
      <button
        onClick={onNext}
        aria-label="Next card"
        style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px',
          opacity: 0.45,
          transition: 'opacity 0.2s',
          zIndex: 20,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="14" y1="2" x2="14" y2="26" stroke="#f5ede0" strokeWidth="0.75" strokeLinecap="round"/>
          <line x1="2" y1="14" x2="26" y2="14" stroke="#f5ede0" strokeWidth="0.75" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  );
}