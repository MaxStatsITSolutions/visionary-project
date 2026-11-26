import { useRef, type ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { damp } from './engine';
import { useFrame } from './useFrame';

type ParallaxProps = {
  children: ReactNode;
  /**
   * Scroll depth. 0 = moves with the page, positive = travels faster than
   * the page (feels closer), negative = lags behind it (feels further away).
   * 0.15 is a calm default.
   */
  speed?: number;
  /** Extra pointer drift in px at the viewport edge (mouse only). */
  pointer?: number;
  /** Rotate slightly with pointer, in degrees. */
  tilt?: number;
  /**
   * 'center': offset is zero when the element sits mid-viewport (sections).
   * 'top': offset is zero at the top of the page (above-the-fold elements),
   * so the first frame matches the static layout.
   */
  anchor?: 'center' | 'top';
  sx?: SxProps<Theme>;
  'aria-hidden'?: boolean;
};

/**
 * Moves its content against the scroll (and optionally the pointer), with
 * smoothing. Offsets are measured from the element's resting position in the
 * viewport centre, so layout is unchanged when the effect is off.
 */
export function Parallax({ children, speed = 0.15, pointer = 0, tilt = 0, anchor = 'center', sx, ...rest }: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const current = useRef({ y: 0, px: 0, py: 0 });

  useFrame(({ viewport, pointer: p, dt, scrollY }) => {
    const el = outer.current;
    const target = inner.current;
    if (!el || !target) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < -viewport.h * 0.5 || rect.top > viewport.h * 1.5) return;
    const centre = anchor === 'top' ? -scrollY : rect.top + rect.height / 2 - viewport.h / 2;
    const c = current.current;
    const k = damp(9, dt);
    c.y += (centre * speed - c.y) * k;
    c.px += (p.x * pointer - c.px) * k;
    c.py += (p.y * pointer - c.py) * k;
    target.style.transform = `translate3d(${c.px.toFixed(2)}px, ${(c.y + c.py).toFixed(2)}px, 0)${
      tilt ? ` rotate(${(p.x * tilt).toFixed(3)}deg)` : ''
    }`;
  });

  return (
    <Box ref={outer} sx={sx} {...rest}>
      <Box ref={inner} sx={{ willChange: 'transform', height: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
