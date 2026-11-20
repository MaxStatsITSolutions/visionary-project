import { stylesWithImages } from './styles';
import type { NoteTexts } from './room';

/** Renovation notes for each direction (kept short: they sit on the drawing). */
const NOTES_BY_STYLE: Record<string, NoteTexts> = {
  japandi: {
    W1: 'W1  WINDOW — KEEP',
    D1: 'D1  ARCH — KEEP',
    WL: 'WALLS — WARM WHITE',
    R1: 'R1  RADIATOR — REMOVE',
    F1: 'F1  FLOOR → WHITE OAK',
  },
  'wabi-sabi': {
    W1: 'W1  KEEP · LINEN SHEER',
    D1: 'D1  ARCH — LIME RENDER',
    WL: 'WALLS — CLAY PLASTER',
    R1: 'R1  RADIATOR — REMOVE',
    F1: 'F1  FLOOR → LIMED OAK',
  },
  'mid-century': {
    W1: 'W1  KEEP · OLIVE VELVET',
    D1: 'D1  ARCH — KEEP',
    WL: 'WALLS — WARM PLASTER',
    R1: 'R1  → WALNUT CREDENZA',
    F1: 'F1  FLOOR → HONEY OAK',
  },
  scandinavian: {
    W1: 'W1  KEEP · OAT LINEN',
    D1: 'D1  ARCH — KEEP',
    WL: 'WALLS — MATTE WHITE',
    R1: 'R1  → ASH SIDEBOARD',
    F1: 'F1  FLOOR → PALE ASH',
  },
  industrial: {
    W1: 'W1  KEEP · BLACKOUT',
    D1: 'D1  ARCH — KEEP',
    WL: 'WALL — BRICK SLIP',
    R1: 'R1  RADIATOR — REMOVE',
    F1: 'F1  FLOOR → CONCRETE',
  },
  mediterranean: {
    W1: 'W1  WINDOW — KEEP',
    D1: 'D1  ARCH — WHITEWASH',
    WL: 'WALLS — LIMEWASH',
    R1: 'R1  → OAK CONSOLE',
    F1: 'F1  FLOOR → TERRACOTTA',
  },
};

/** On the drawing sheet, each interior direction is issued as a revision. */
export const revisions = stylesWithImages.map((s, i) => ({
  rev: String.fromCharCode(65 + i),
  id: s.id,
  image: s.image,
  name: s.name,
  descriptor: s.descriptor,
  notes: NOTES_BY_STYLE[s.id]!,
}));

export type Revision = (typeof revisions)[number];
