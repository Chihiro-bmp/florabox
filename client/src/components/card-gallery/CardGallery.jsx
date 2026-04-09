import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import CardItem from './CardItem';
import CardNameReveal from './CardNameReveal';
import CardPreviewStrip from './CardPreviewStrip';
import NavigationButtons from './NavigationButtons';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const CARD_GAP = 80;
const SECTION_PADDING = 160;
const NATIVE_H = 400;

export default function CardGallery({ cards }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [displayHeight, setDisplayHeight] = useState(520);
  const [isMobile, setIsMobile] = useState(false);
  const cardPositionsRef = useRef([]);
  const trackWidthRef = useRef(0);
  const scrollTriggerRef = useRef(null);

  // Responsive sizing
  useEffect(() => {
    function updateSize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        const h = Math.min(window.innerHeight * 0.68, 580);
        setDisplayHeight(Math.max(h, 360));
      } else {
        const h = Math.min(window.innerHeight * 0.62, 440);
        setDisplayHeight(Math.max(h, 320));
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // GSAP ScrollTrigger setup (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Wait a tick for layout
    const timer = setTimeout(() => {
      const cardScale = displayHeight / NATIVE_H;
      const cardW = 300 * cardScale;
      const totalCards = cards.length;
      const trackWidth = SECTION_PADDING * 2 + totalCards * cardW + (totalCards - 1) * CARD_GAP;
      trackWidthRef.current = trackWidth;

      // Store card centre positions
      cardPositionsRef.current = cards.map((_, i) =>
        SECTION_PADDING + i * (cardW + CARD_GAP) + cardW / 2
      );

      const scrollDistance = trackWidth - window.innerWidth;
      if (scrollDistance <= 0) return;

      const st = ScrollTrigger.create({
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: `+=${scrollDistance}`,
        onUpdate: (self) => {
          const currentX = -scrollDistance * self.progress;
          const vpCenter = window.innerWidth / 2;
          let closest = 0;
          let closestDist = Infinity;
          cardPositionsRef.current.forEach((pos, i) => {
            const cardCenter = pos + currentX;
            const dist = Math.abs(cardCenter - vpCenter);
            if (dist < closestDist) { closestDist = dist; closest = i; }
          });
          setCenteredIndex(closest);
        },
      });

      gsap.to(track, {
        x: () => -scrollDistance,
        ease: 'none',
        scrollTrigger: st,
      });

      scrollTriggerRef.current = st;
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile, displayHeight, cards]);

  const goToCard = useCallback((index) => {
    const st = scrollTriggerRef.current;
    if (!st || isMobile) return;
    const cardScale = displayHeight / NATIVE_H;
    const cardW = 300 * cardScale;
    const cardCentre = SECTION_PADDING + index * (cardW + CARD_GAP) + cardW / 2;
    const vpCenter = window.innerWidth / 2;
    const targetX = vpCenter - cardCentre;
    const scrollDistance = trackWidthRef.current - window.innerWidth;
    const progress = Math.max(0, Math.min(1, -targetX / scrollDistance));
    const sectionTop = sectionRef.current?.offsetTop ?? 0;
    const targetScroll = sectionTop + progress * scrollDistance;
    gsap.to(window, { scrollTo: targetScroll, duration: 0.7, ease: 'power2.inOut' });
  }, [isMobile, displayHeight]);

  const handlePrev = () => {
    if (isMobile) {
      // mobile: scroll the track element directly
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: -(300 * (displayHeight / NATIVE_H) + CARD_GAP), behavior: 'smooth' });
    } else {
      goToCard(Math.max(0, centeredIndex - 1));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: 300 * (displayHeight / NATIVE_H) + CARD_GAP, behavior: 'smooth' });
    } else {
      goToCard(Math.min(cards.length - 1, centeredIndex + 1));
    }
  };

  const handleSelect = (index) => {
    setSelectedIndex(prev => prev === index ? null : index);
  };

  const cardScale = displayHeight / NATIVE_H;
  const cardW = 300 * cardScale;

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: 'linear-gradient(135deg, #1e1008 0%, #2a1410 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: isMobile ? 'visible' : 'hidden',
      }}
    >
      {/* Eyebrow label */}
      <p style={{
        position: 'absolute',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: '"Jost", sans-serif',
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(245,237,224,0.28)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        Choose a card
      </p>

      {/* Card track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: `${CARD_GAP}px`,
          paddingLeft: isMobile ? '10vw' : `${SECTION_PADDING}px`,
          paddingRight: isMobile ? '10vw' : `${SECTION_PADDING}px`,
          willChange: 'transform',
          // Mobile: native horizontal scroll
          ...(isMobile ? {
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
          } : {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
          }),
        }}
      >
        {cards.map((card, i) => (
          <CardItem
            key={card.id}
            card={card}
            displayHeight={displayHeight}
            isSelected={selectedIndex === i}
            onSelect={() => handleSelect(i)}
            onCenter={isMobile ? () => setCenteredIndex(i) : undefined}
          />
        ))}
      </div>

      {/* Card name reveal */}
      <div style={{
        position: 'absolute',
        bottom: selectedIndex !== null ? '160px' : '48px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transition: 'bottom 0.3s ease',
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        <CardNameReveal
          name={cards[centeredIndex]?.name ?? ''}
          visible={selectedIndex === null}
        />
      </div>

      {/* Selected card name when strip open */}
      {selectedIndex !== null && (
        <div style={{
          position: 'absolute',
          bottom: '160px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            color: 'rgba(245,237,224,0.65)',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            {cards[selectedIndex]?.name}
          </p>
        </div>
      )}

      {/* Navigation + buttons — hidden on mobile */}
      {!isMobile && (
        <NavigationButtons onPrev={handlePrev} onNext={handleNext} />
      )}

      {/* Preview strip + CTA */}
      <CardPreviewStrip
        cards={cards}
        selectedIndex={selectedIndex}
        onSelect={(i) => { setSelectedIndex(i); if (!isMobile) goToCard(i); }}
      />
    </div>
  );
}