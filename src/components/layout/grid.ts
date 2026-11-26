/** 4 / 8 / 12 column grid from §6.2. Children place themselves with gridColumn. */
export const gridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(4, minmax(0, 1fr))', sm: 'repeat(8, minmax(0, 1fr))', md: 'repeat(12, minmax(0, 1fr))' },
  columnGap: { xs: 2, md: 3 },
} as const;
