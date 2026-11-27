import type { ExploreConcept } from '../types/explore';

export function getFallbackMedia(
  title: string,
  variant: 'before' | 'after',
): string {
  const label = variant === 'before' ? 'Before' : 'Demo preview';
  const color = variant === 'before' ? '#D9D4C8' : '#B87957';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${color}"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="#191B1A">${label}</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#191B1A">${title}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const EXPLORE_CONCEPTS: ExploreConcept[] = [
  {
    id: 'living-japandi-01',
    title: 'Quiet Limestone Living Room',
    roomType: 'Living Room',
    interiorStyle: 'Japandi',
    summary: 'Warm oak, lime plaster walls, and soft natural light.',
    palette: ['#F4F1EA', '#D9D4C8', '#8A9A85', '#191B1A'],
    materials: ['White Oak', 'Lime Plaster'],
    estimatedTier: '€4,500 – €7,000',
    beforeImage: getFallbackMedia('Quiet Limestone Living Room', 'before'),
    afterImage: getFallbackMedia('Quiet Limestone Living Room', 'after'),
    beforeAlt: 'Living room before redesign',
    afterAlt: 'Demo preview of living room in Japandi style',
    featured: true,
  },
  {
    id: 'bedroom-warm-min-02',
    title: 'Terracotta & Linen Sanctuary',
    roomType: 'Bedroom',
    interiorStyle: 'Warm Minimalism',
    summary: 'Calm bedroom with warm copper accents and linen textiles.',
    palette: ['#F4F1EA', '#B87957', '#D9D4C8', '#191B1A'],
    materials: ['Brushed Copper', 'Washed Linen'],
    estimatedTier: '€3,200 – €5,400',
    beforeImage: getFallbackMedia('Terracotta & Linen Sanctuary', 'before'),
    afterImage: getFallbackMedia('Terracotta & Linen Sanctuary', 'after'),
    beforeAlt: 'Bedroom before redesign',
    afterAlt: 'Demo preview of bedroom in Warm Minimalism style',
    featured: true,
  },
  {
    id: 'kitchen-scandi-03',
    title: 'Nordic Stone & Sage Kitchen',
    roomType: 'Kitchen',
    interiorStyle: 'Scandinavian',
    summary: 'Bright kitchen with sage cabinets and light stone surfaces.',
    palette: ['#FFFFFF', '#8A9A85', '#D9D4C8', '#191B1A'],
    materials: ['Limestone', 'Birch'],
    estimatedTier: '€8,000 – €12,500',
    beforeImage: getFallbackMedia('Nordic Stone & Sage Kitchen', 'before'),
    afterImage: getFallbackMedia('Nordic Stone & Sage Kitchen', 'after'),
    beforeAlt: 'Kitchen before redesign',
    afterAlt: 'Demo preview of kitchen in Scandinavian style',
    featured: true,
  },
];