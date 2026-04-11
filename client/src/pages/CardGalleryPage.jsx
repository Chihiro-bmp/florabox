import CardGallery from '../components/card-gallery/CardGallery';
import GalleryHero from '../components/card-gallery/GalleryHero';
import { CARDS } from '../data/cards';

/**
 * Layout: 200dvh tall wrapper.
 *
 *  ┌──────────────────────────────┐  ← scroll starts here
 *  │  Hero  (absolute, z:2)       │  100dvh — overlays gallery, scrolls away
 *  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
 *  │  Gallery (sticky top:0, z:1) │  100dvh — revealed as hero scrolls off
 *  └──────────────────────────────┘  ← scroll ends here (extra 100dvh travel)
 *
 * The gallery is always rendered but hidden behind the hero. As the user
 * scrolls, the hero slides up like a curtain, uncovering the gallery beneath.
 */
export default function CardGalleryPage() {
  return (
    <div style={{ position: 'relative', height: '200dvh', background: '#080709' }}>

      {/* Gallery — sticky so it stays in view while the hero scrolls away */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100dvh',
        zIndex: 1,
      }}>
        <CardGallery cards={CARDS} />
      </div>

      {/* Hero — absolute on top; scrolls naturally, revealing gallery beneath */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100dvh',
        zIndex: 2,
        pointerEvents: 'auto',
      }}>
        <GalleryHero />
      </div>

    </div>
  );
}
