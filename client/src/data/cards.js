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
  },
  {
    id: 'birthday-golden-hour',
    name: 'Golden Hour',
    occasion: 'Birthday',
    theme: 'botanical',
    src: '/cards/golden-hour.jpg',
    Component: GoldenHour,
  },
  {
    id: 'birthday-mineral-moon',
    name: 'Mineral Moon',
    occasion: 'Birthday',
    theme: 'cosmic',
    src: '/cards/mineral-moon.jpg',
    Component: MineralMoon,
  },
];