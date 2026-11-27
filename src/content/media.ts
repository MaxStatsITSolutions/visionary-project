// BASE_URL keeps asset paths correct when the app is served from a sub-path.
export const interiorSrc = (name: string, width: 800 | 1600) =>
  `${import.meta.env.BASE_URL}media/interiors/${name}-${width}.webp`;
