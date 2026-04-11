import MarbledRose from '../components/cards/birthday/MarbledRose';
import GoldenHour from '../components/cards/birthday/GoldenHour';
import MineralMoon from '../components/cards/birthday/MineralMoon';

export const CARDS = [
  {
    id: 'birthday-marbled-rose',
    name: 'Marbled Rose',
    occasion: 'Birthday',
    theme: 'botanical',
    Component: MarbledRose,
  },
  {
    id: 'birthday-golden-hour',
    name: 'Golden Hour',
    occasion: 'Birthday',
    theme: 'botanical',
    Component: GoldenHour,
  },
  {
    id: 'birthday-mineral-moon',
    name: 'Mineral Moon',
    occasion: 'Birthday',
    theme: 'cosmic',
    Component: MineralMoon,
  },
];