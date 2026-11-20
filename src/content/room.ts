// Survey of the demo room, traced from the "before" photo (source 1536×1024).
// Every concept image shares this camera, so the same linework fits them all.

export const SHEET = { w: 1536, h: 1024 } as const;

/** One-point perspective: vanishing point from the two floor/wall junctions. */
export const VP = { x: 814, y: 472 } as const;

export const BACK_WALL = { x0: 367, y0: 253, x1: 1196, y1: 703 } as const;

/** Where the room's edges leave the frame (lines from VP through the back corners). */
export const ROOM_EDGES = [
  { from: [367, 253], to: [0, 73] }, // ceiling / left wall
  { from: [1196, 253], to: [1536, 58] }, // ceiling / right wall
  { from: [367, 703], to: [0, 893] }, // floor / left wall
  { from: [1196, 703], to: [1536, 907] }, // floor / right wall
] as const;

export const WINDOW = { x0: 513, y0: 291, x1: 1057, y1: 571, mullions: [633, 933], transom: 360 } as const;
export const SILL = { x0: 505, y0: 571, x1: 1065, y1: 587 } as const;
export const RADIATOR = { x0: 596, y0: 591, x1: 973, y1: 691 } as const;
export const ARCH = { x0: 120, x1: 263, spring: 327, apex: 251, footLeft: 820, footRight: 767 } as const;
export const PENDANT = { x: 771, top: 104, bulbY: 200, r: 14 } as const;

/** Dimension strings in millimetres, as on a real drawing. */
export const DIMENSIONS = [
  // labelAt keeps the figures clear of the pendant in the middle of the wall.
  { id: 'wall', axis: 'x', at: 222, from: BACK_WALL.x0, to: BACK_WALL.x1, label: '4 800', labelAt: 1110 },
  { id: 'window', axis: 'x', at: 268, from: WINDOW.x0, to: WINDOW.x1, label: '1 900', labelAt: 620 },
  { id: 'height', axis: 'y', at: 1228, from: BACK_WALL.y0, to: BACK_WALL.y1, label: '2 600', labelAt: 478 },
] as const;

/** Renovation notes: target point, leader path, label anchor. */
export const NOTES = [
  { id: 'W1', text: 'W1  WINDOW — KEEP', dot: [860, 360], path: 'M860 360 L1040 190 H1400', label: [1046, 174] },
  { id: 'D1', text: 'D1  ARCH — KEEP', dot: [192, 480], path: 'M192 480 V150 H500', label: [200, 134] },
  { id: 'WL', text: 'WALLS — LIMEWASH', dot: [1350, 450], path: 'M1350 450 L1290 620 H1510', label: [1266, 604] },
  { id: 'R1', text: 'R1  RADIATOR — REMOVE', dot: [790, 640], path: 'M790 640 L620 800 H330', label: [336, 784] },
  { id: 'F1', text: 'F1  LAMINATE → OAK', dot: [980, 870], path: 'M980 870 L1120 950 H1490', label: [1126, 934] },
] as const;
