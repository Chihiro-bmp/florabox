import { useEffect, useRef, useState } from 'react';

const NATIVE_W = 300;
const NATIVE_H = 400;

// Renders a card at its native 300×400 and scales it to fit the parent box
export default function ScaledCard({ card, toName, fromName, message }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const { width, height } = box.getBoundingClientRect();
      setScale(Math.max(0.1, Math.min(width / NATIVE_W, height / NATIVE_H)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const { Component } = card;

  return (
    <div ref={boxRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: NATIVE_W * scale,
        height: NATIVE_H * scale,
        transform: 'translate(-50%, -50%)',
        borderRadius: '2px',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(245,237,224,0.08), 0 0 60px 10px rgba(201,168,76,0.06), 0 30px 70px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width: NATIVE_W,
          height: NATIVE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}>
          <Component toName={toName} fromName={fromName} message={message} />
        </div>
      </div>
    </div>
  );
}
