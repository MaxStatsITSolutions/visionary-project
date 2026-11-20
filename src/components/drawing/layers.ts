export type Layers = { construction: boolean; linework: boolean; photo: boolean; notes: boolean; proposal: boolean };
export const ALL_LAYERS: Layers = { construction: true, linework: true, photo: true, notes: true, proposal: true };

export type Proposal = { image: string; name: string; rev: string };
