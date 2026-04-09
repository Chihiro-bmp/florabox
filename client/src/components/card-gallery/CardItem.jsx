import { useRef, useEffect } from 'react';

const NATIVE_W = 300;
const NATIVE_H = 400;

export default function CardItem({ card, displayHeight, isSelected, onSelect, onCenter }) {
  const wrapRef = useRef(null);
  const scale = displayHeight / NATIVE_H;
  const displayWidth = NATIVE_W * scale;

  // IntersectionObserver for mobile snap-centre detection
  useEffect(() => {
    if (!wrapRef.current || !onCenter) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.intersectionRatio > 0.6) onCenter(); },
      { threshold: 0.6 }
    );
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [onCenter]);

  return (
    <div
      ref={wrapRef}
      onClick={onSelect}
      style={{
        flexShrink: 0,
        width: displayWidth,
        height: displayHeight,
        cursor: 'pointer',
        position: 'relative',
        scrollSnapAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
        boxShadow: isSelected
          ? '0 0 0 1.5px rgba(245,237,224,0.55), 0 32px 80px rgba(0,0,0,0.7)'
          : '0 24px 60px rgba(0,0,0,0.5)',
        borderRadius: '4px',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {/* Native 300×400 card, scaled via CSS */}
      <div
        style={{
          width: NATIVE_W,
          height: NATIVE_H,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
        }}
      >
        <card.Component />
      </div>
    </div>
  );
}