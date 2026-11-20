export type InteriorStyle = {
  id: string;
  name: string;
  descriptor: string;
  materials: string[];
  /** Wall, floor, upholstery, accent — used for swatches. */
  swatches: [string, string, string, string];
  /** Basename in /public/media/interiors (`<image>-800.webp`, `<image>-1600.webp`). */
  image?: string;
};

/** The empty room every concept starts from (same camera, same framing). */
export const beforeImage = 'before';

export const interiorStyles: InteriorStyle[] = [
  {
    id: 'japandi',
    name: 'Japandi',
    descriptor: 'Quiet oak, paper light, nothing extra.',
    materials: ['White oak', 'Linen', 'Washi'],
    swatches: ['#EEE7DC', '#C9AE8A', '#D9D2C3', '#8A9A85'],
    image: 'japandi',
  },
  {
    id: 'wabi-sabi',
    name: 'Wabi-sabi',
    descriptor: 'Lime plaster, clay and honest wear.',
    materials: ['Lime plaster', 'Raw clay', 'Travertine'],
    swatches: ['#D8CBB8', '#B79D7C', '#E4DCCD', '#8D6E57'],
    image: 'wabi-sabi',
  },
  {
    id: 'mid-century',
    name: 'Mid-century',
    descriptor: 'Walnut curves and a warm, low horizon.',
    materials: ['Walnut', 'Velvet', 'Brass'],
    swatches: ['#EADBC8', '#B5793F', '#9A4B22', '#3F5A35'],
    image: 'mid-century',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    descriptor: 'Pale timber, soft wool, long northern light.',
    materials: ['Ash', 'Wool', 'Paper'],
    swatches: ['#F2EFEA', '#D8C4A4', '#B7B7B2', '#6B7458'],
    image: 'scandinavian',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    descriptor: 'Brick, blackened steel and cognac leather.',
    materials: ['Brick', 'Steel', 'Leather'],
    swatches: ['#9C5A3C', '#5E5A54', '#8E5A3E', '#1D1F1E'],
    image: 'industrial',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    descriptor: 'Sun-baked terracotta and whitewashed calm.',
    materials: ['Terracotta', 'Whitewash', 'Rattan'],
    swatches: ['#F1E9DC', '#B8653F', '#ECE3D3', '#22408A'],
    image: 'mediterranean',
  },
];

export const stylesWithImages = interiorStyles.filter((s): s is InteriorStyle & { image: string } => Boolean(s.image));
