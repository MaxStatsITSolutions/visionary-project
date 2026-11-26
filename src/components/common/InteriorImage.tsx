import { interiorSrc } from '../../content/media';

type InteriorImageProps = {
  /** Basename in /public/media/interiors. */
  name: string;
  alt: string;
  /** Layout width hint for the browser's srcset choice. */
  sizes?: string;
  priority?: boolean;
};

/**
 * Responsive, cover-fit interior photo (§6.3: WebP + responsive loading).
 * Intrinsic size is set so the browser reserves space (no layout shift).
 */
export function InteriorImage({ name, alt, sizes = '100vw', priority = false }: InteriorImageProps) {
  return (
    <img
      src={interiorSrc(name, 1600)}
      srcSet={`${interiorSrc(name, 800)} 800w, ${interiorSrc(name, 1600)} 1600w`}
      sizes={sizes}
      width={1600}
      height={1067}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
