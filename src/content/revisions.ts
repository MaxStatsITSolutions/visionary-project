import { stylesWithImages } from './styles';

/** On the drawing sheet, each interior direction is issued as a revision. */
export const revisions = stylesWithImages.map((s, i) => ({
  rev: String.fromCharCode(65 + i),
  id: s.id,
  image: s.image,
  name: s.name,
  descriptor: s.descriptor,
}));

export type Revision = (typeof revisions)[number];
