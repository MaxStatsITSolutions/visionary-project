import { useRef, type ElementType } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { colors, fonts } from '../theme/tokens';
import { clamp, lerp, reducedMotion } from './engine';
import { useFrame } from './useFrame';
import { useFitText } from './useFitText';

type ScrollTitleProps = {
  lines: string[];
  id?: string;
  component?: ElementType;
  variant?: 'h1' | 'h2';
  /** Draw a live dimension line over the first line, reading its width in mm. */
  measure?: boolean;
  sx?: SxProps<Theme>;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const WIDE = 125;
const NARROW = 62;

/** px → "mm" on our 1:50 sheet, grouped like a drawing ("4 832"). */
const toMm = (px: number) => String(Math.round(px * 8)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/**
 * Scroll-scrubbed title. Each line enters at Archivo's widest setting and
 * condenses into place as you scroll (variable width axis), while its letters
 * rise in sequence through a mask. A dimension line above measures the first
 * line live, so the figure counts down as the type compresses.
 * Progress follows the scroll both ways; reduced motion shows the final state.
 */
export function ScrollTitle({ lines, id, component = 'h2', variant = 'h2', measure = true, sx }: ScrollTitleProps) {
  const root = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const charRefs = useRef<HTMLSpanElement[][]>([]);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = reducedMotion();
  useFitText(root, lines);

  useFrame(({ viewport }) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > viewport.h + 200) return;
    // 0 when the title's top meets the bottom of the screen, 1 at ~25% from the top.
    const p = clamp((viewport.h - r.top) / (viewport.h * 0.75));
    lines.forEach((_, i) => {
      const li = easeOut(clamp((p - i * 0.12) / 0.7));
      const line = lineRefs.current[i];
      if (!line) return;
      line.style.fontVariationSettings = `"wdth" ${lerp(WIDE, NARROW, li).toFixed(1)}`;
      const chars = charRefs.current[i] ?? [];
      const n = chars.length || 1;
      chars.forEach((c, j) => {
        const cj = easeOut(clamp(li * 1.4 - (j / n) * 0.4));
        c.style.transform = `translate3d(0, ${((1 - cj) * 110).toFixed(1)}%, 0)`;
      });
    });
    const first = lineRefs.current[0];
    if (measure && first && ruleRef.current && labelRef.current) {
      const w = first.getBoundingClientRect().width;
      ruleRef.current.style.width = `${Math.min(w, el.clientWidth)}px`;
      ruleRef.current.style.opacity = String(clamp(p * 1.6));
      labelRef.current.textContent = toMm(w);
    }
  });

  return (
    <Box
      ref={root}
      id={id}
      component={component}
      aria-label={lines.join(' ')}
      sx={[
        // contain: inline-size keeps the wide (wdth 125) lines from widening the layout.
        (theme) => ({ ...theme.typography[variant], m: 0, position: 'relative', overflowX: 'clip', contain: 'inline-size', minWidth: 0, pt: measure ? '26px' : 0 }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {measure && (
        <Box
          component="span"
          ref={ruleRef}
          aria-hidden
          sx={{
            position: 'absolute',
            top: 6,
            left: 0,
            height: 14,
            opacity: reduced ? 1 : 0,
            borderLeft: `1px solid ${colors.ink}`,
            borderRight: `1px solid ${colors.ink}`,
            '&::before': { content: '""', position: 'absolute', left: 0, right: 0, top: '50%', borderTop: `1px solid ${colors.ink}` },
          }}
        >
          <Box
            component="span"
            ref={labelRef}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              px: 1,
              bgcolor: colors.canvas,
              fontFamily: fonts.mono,
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              lineHeight: 1,
              fontVariationSettings: 'normal',
              textTransform: 'none',
            }}
          />
        </Box>
      )}
      {lines.map((line, i) => (
        <Box component="span" key={i} aria-hidden sx={{ display: 'block', overflow: 'hidden', pb: '0.06em', mb: '-0.06em' }}>
          <Box
            component="span"
            ref={(el: HTMLSpanElement | null) => {
              lineRefs.current[i] = el;
            }}
            sx={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            style={reduced ? undefined : { fontVariationSettings: `"wdth" ${WIDE}` }}
          >
            {Array.from(line).map((ch, j) => (
              <span
                key={j}
                ref={(el) => {
                  if (!charRefs.current[i]) charRefs.current[i] = [];
                  if (el) charRefs.current[i]![j] = el;
                }}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  transform: reduced ? undefined : 'translate3d(0, 110%, 0)',
                  willChange: reduced ? undefined : 'transform',
                }}
              >
                {ch}
              </span>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
