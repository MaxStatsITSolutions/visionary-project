import type { ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { useInView } from '../hooks/useInView';

/**
 * Wipes its content up from the bottom edge while the content settles from
 * a slight zoom: the "print coming out of the developer tray" reveal.
 * The observed element is an unclipped wrapper: IntersectionObserver treats
 * a target hidden by its own clip-path as not visible, so it would never fire.
 * Reduced motion: shown immediately (global CSS rule removes transitions).
 */
export function RevealMask({ children, sx, delay = 0 }: { children: ReactNode; sx?: SxProps<Theme>; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <Box ref={ref} sx={sx}>
      <Box
        sx={{
          overflow: 'hidden',
          clipPath: inView ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: `clip-path 1.4s cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms`,
        }}
      >
        <Box
          sx={{
            transform: inView ? 'none' : 'scale(1.18)',
            transition: `transform 1.8s var(--ease) ${delay}ms`,
            transformOrigin: '50% 100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
