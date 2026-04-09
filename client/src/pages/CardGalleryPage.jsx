import CardGallery from '../components/card-gallery/CardGallery';
import { CARDS } from '../data/cards';

export default function CardGalleryPage() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #1e1008 0%, #2a1410 100%)', minHeight: '100dvh' }}>
      <CardGallery cards={CARDS} />
    </div>
  );
}