import MarbledRose from '../components/cards/birthday/MarbledRose';
import GoldenHour from '../components/cards/birthday/GoldenHour';
import MineralMoon from '../components/cards/birthday/MineralMoon';

export const CARDS = [
  {
    id: 'birthday-marbled-rose',
    name: 'Marbled Rose',
    occasion: 'Birthday',
    theme: 'botanical',
    src: '/cards/marbled-rose.jpg',
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
    src: '/cards/golden-hour.jpg',
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
    src: '/cards/mineral-moon.jpg',
    Component: MineralMoon,
    // Steel blue — echoes the titanium highlights and star field
    nameColor: 'rgba(190,210,252,0.85)',
    nameFont: '"Share Tech Mono", monospace',
    nameItalic: false,
  },
];
