import MarbledRose from '../components/cards/birthday/MarbledRose';
import GoldenHour from '../components/cards/birthday/GoldenHour';
import MineralMoon from '../components/cards/birthday/MineralMoon';
import WisteriaCard from '../components/cards/love/WisteriaCard';

export const CARDS = [
  {
    id: 'birthday-marbled-rose',
    name: 'Marbled Rose',
    occasion: 'Birthday',
    theme: 'botanical',
    Component: MarbledRose,
    // Warm rose-brown — echoes the marbled cream and crimson of the card itself
    nameColor: 'rgba(90,55,25,0.82)',
    nameFont: '"Cormorant Garamond", Georgia, serif',
    nameItalic: true,
  },
  {
    id: 'birthday-golden-hour',
    name: 'Golden Hour',
    occasion: 'Birthday',
    theme: 'botanical',
    Component: GoldenHour,
    // Warm amber — echoes the honey watercolour wash and golden petals
    nameColor: 'rgba(160,100,35,0.82)',
    nameFont: '"Cormorant Garamond", Georgia, serif',
    nameItalic: true,
  },
  {
    id: 'birthday-mineral-moon',
    name: 'Mineral Moon',
    occasion: 'Birthday',
    theme: 'cosmic',
    Component: MineralMoon,
    // Steel blue — echoes the titanium highlights and star field
    nameColor: 'rgba(190,210,252,0.85)',
    nameFont: '"Share Tech Mono", monospace',
    nameItalic: false,
  },
  {
    id: 'love-wisteria',
    name: 'Wisteria',
    occasion: 'Love',
    theme: 'botanical',
    Component: WisteriaCard,
    // Lavender-plum — echoes the hanging cluster colour
    nameColor: 'rgba(130,90,140,0.82)',
    nameFont: '"Cormorant Garamond", Georgia, serif',
    nameItalic: true,
  },
];
