// Design tokens from §6.1 of the project spec. Every colour, font and motion
// value used in the UI comes from here, so the brand stays in one place.

export const colors = {
  ink: '#191B1A',
  canvas: '#F4F1EA',
  limestone: '#D9D4C8',
  sage: '#8A9A85',
  copper: '#B87957',
  white: '#FFFFFF',
  // Derived tones (not in the spec table, built from it for contrast/states).
  inkSoft: '#4A4F4B', // secondary text, 8.1:1 on canvas
  copperDeep: '#8E5A3E', // copper text/hover, 4.9:1 on canvas
  line: 'rgba(25, 27, 26, 0.14)',
} as const;

// Drawing-set direction: one variable grotesk (Archivo, with a width axis)
// for display and text, plus a mono for annotations, like a drawing sheet.
export const fonts = {
  display: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  body: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
} as const;

/** font-variation-settings for Archivo's width axis (62 = condensed, 125 = expanded). */
export const width = (wdth: number) => `"wdth" ${wdth}`;

// Motion: a single, calm curve family used everywhere.
export const motion = {
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)', // ease-out-quint
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  fast: 240,
  base: 600,
  slow: 1100,
} as const;

export const layout = {
  maxWidth: 1440,
  // Side gutters: mobile / tablet / desktop.
  gutter: { xs: 20, sm: 32, md: 48 },
  headerHeight: 76,
} as const;
