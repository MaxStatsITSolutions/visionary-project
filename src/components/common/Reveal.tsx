import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { useInView } from '../../hooks/useInView';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  component?: ElementType;
  sx?: SxProps<Theme>;
};

/** Fades and lifts its content in once, when scrolled into view. */
export function Reveal({ children, delay = 0, component = 'div', sx }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Box
      ref={ref}
      component={component}
      className={`vz-reveal${inView ? ' is-in' : ''}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
      sx={sx}
    >
      {children}
    </Box>
  );
}

type RevealTextProps = {
  /** Each entry is one visual line; a line may contain inline markup. */
  lines: ReactNode[];
  component?: ElementType;
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  delay?: number;
  stagger?: number;
  /** Reveal immediately on mount instead of on scroll (used above the fold). */
  immediate?: boolean;
  sx?: SxProps<Theme>;
  id?: string;
};

/**
 * Editorial masked line reveal. The text stays real, selectable text in the
 * DOM; only the transform animates, so layout never shifts (CLS-safe).
 */
export function RevealText({
  lines,
  component = 'h2',
  variant = 'h2',
  delay = 0,
  stagger = 90,
  immediate = false,
  sx,
  id,
}: RevealTextProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });
  const shown = immediate || inView;
  return (
    <Box
      ref={ref}
      id={id}
      component={component}
      className={shown ? 'is-in' : undefined}
      sx={[(theme) => ({ ...theme.typography[variant], m: 0 }), ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {lines.map((line, i) => (
        <span className="vz-line" key={i}>
          <span style={{ '--d': `${delay + i * stagger}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Box>
  );
}
