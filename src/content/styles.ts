import type { RoomPalette } from '../components/illustrations/RoomIllustration';

export type InteriorStyle = {
  id: string;
  name: string;
  descriptor: string;
  materials: string[];
  palette: RoomPalette;
};

export const interiorStyles: InteriorStyle[] = [
  {
    id: 'japandi',
    name: 'Japandi',
    descriptor: 'Quiet oak, paper light, nothing extra.',
    materials: ['White oak', 'Linen', 'Washi'],
    palette: {
      wall: '#E7E1D5', wallLight: '#F3EFE6', sideWall: '#DCD5C7', ceiling: '#EEEAE1',
      floor: '#C9AE8A', floorLight: '#B89A74', sofa: '#D9D2C3', sofaShade: '#C8C0AF',
      cushion: '#8A9A85', wood: '#A9825A', metal: '#2B2D2B', rug: '#E9E3D6',
      art: ['#F2EEE6', '#191B1A'], plant: '#6F8468', pot: '#B9A58D', doorway: '#C9C1B1',
    },
  },
  {
    id: 'wabi-sabi',
    name: 'Wabi-sabi',
    descriptor: 'Lime plaster, clay and honest wear.',
    materials: ['Lime plaster', 'Raw clay', 'Travertine'],
    palette: {
      wall: '#D8CBB8', wallLight: '#E7DCCB', sideWall: '#CBBCA6', ceiling: '#E1D7C8',
      floor: '#A99C88', floorLight: '#97897A', sofa: '#CFC3AF', sofaShade: '#BBAE98',
      cushion: '#9A7B62', wood: '#6E5644', metal: '#3A3530', rug: '#C7B9A2',
      art: ['#B9A78F', '#5E4C3F'], plant: '#77806A', pot: '#8D6E57', doorway: '#B5A690',
    },
  },
  {
    id: 'mid-century',
    name: 'Mid-century',
    descriptor: 'Walnut curves and a warm, low horizon.',
    materials: ['Walnut', 'Bouclé', 'Brass'],
    palette: {
      wall: '#E4D8C4', wallLight: '#F0E7D8', sideWall: '#D6C7AE', ceiling: '#ECE4D6',
      floor: '#8C5E3C', floorLight: '#7A4F31', sofa: '#B87957', sofaShade: '#A0654A',
      cushion: '#3F5A4E', wood: '#5C3A22', metal: '#B08D57', rug: '#D9C9A8',
      art: ['#3F5A4E', '#E3A55F'], plant: '#4E6B4C', pot: '#E7DCC8', doorway: '#C9B898',
    },
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    descriptor: 'Pale timber, soft wool, long northern light.',
    materials: ['Ash', 'Wool', 'Matte white'],
    palette: {
      wall: '#EEEDE8', wallLight: '#FAF9F6', sideWall: '#E3E2DC', ceiling: '#F4F3EF',
      floor: '#D8C4A4', floorLight: '#C9B38F', sofa: '#B7BDB8', sofaShade: '#A3AAA5',
      cushion: '#D9D4C8', wood: '#C9A97C', metal: '#202322', rug: '#F2F0EA',
      art: ['#FFFFFF', '#8A9A85'], plant: '#5F7A5A', pot: '#FFFFFF', doorway: '#DEDCD5',
    },
  },
  {
    id: 'industrial',
    name: 'Industrial',
    descriptor: 'Concrete, blackened steel and cognac leather.',
    materials: ['Concrete', 'Steel', 'Leather'],
    palette: {
      wall: '#B9B6AF', wallLight: '#CBC8C1', sideWall: '#A9A69F', ceiling: '#C2BFB8',
      floor: '#6E6A63', floorLight: '#5E5A54', sofa: '#8E5A3E', sofaShade: '#774A33',
      cushion: '#D9D4C8', wood: '#4A3A2E', metal: '#1D1F1E', rug: '#3E3F3C',
      art: ['#D9D4C8', '#B87957'], plant: '#5C6E55', pot: '#2B2D2B', doorway: '#8F8C86',
    },
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    descriptor: 'Sun-baked terracotta and whitewashed calm.',
    materials: ['Terracotta', 'Whitewash', 'Rattan'],
    palette: {
      wall: '#F1E9DC', wallLight: '#FBF6EE', sideWall: '#E6DCCB', ceiling: '#F5EFE5',
      floor: '#C07A55', floorLight: '#AA6845', sofa: '#ECE3D3', sofaShade: '#DCD0BC',
      cushion: '#3D5A80', wood: '#B08A5B', metal: '#6B4E36', rug: '#E2D3B8',
      art: ['#3D5A80', '#E8C07D'], plant: '#617A4F', pot: '#C07A55', doorway: '#D9CDB8',
    },
  },
];

export const defaultStyle = interiorStyles[0]!;
