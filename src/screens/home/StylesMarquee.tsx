import { useRef } from 'react';
import { Box } from '@mui/material';
import { interiorStyles } from '../../content/styles';
import { colors } from '../../theme/tokens';
import { useFrame } from '../../motion/useFrame';

/**
 * Decorative ticker of style names. Drifts on its own, speeds up and flips
 * direction with the scroll, and skews slightly with scroll velocity.
 * With reduced motion it is a static row.
 */
export function StylesMarquee() {
  const row = interiorStyles.map((s) => s.name);
  const track = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const dir = useRef(-1);

  useFrame(({ velocity, dt }) => {
    const el = track.current;
    if (!el) return;
    if (Math.abs(velocity) > 0.5) dir.current = velocity > 0 ? -1 : 1;
    const speed = (0.35 + Math.min(Math.abs(velocity) * 0.25, 9)) * (dt / 16);
    const half = el.scrollWidth / 2;
    x.current = (x.current + dir.current * speed) % half;
    if (x.current > 0) x.current -= half;
    const skew = Math.max(-8, Math.min(8, velocity * -0.25));
    el.style.transform = `translate3d(${x.current}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
  });

  return (
    <Box aria-hidden sx={{ borderBlock: `1px solid ${colors.line}`, overflow: 'hidden', py: { xs: 2.5, md: 3.5 } }}>
      <Box ref={track} sx={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
        {[0, 1].map((copy) => (
          <Box key={copy} sx={{ display: 'flex', alignItems: 'center' }}>
            {row.map((name, i) => (
              <Box key={`${copy}-${name}`} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    fontFamily: '"Fraunces", serif',
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                    fontWeight: 300,
                    fontStyle: i % 2 ? 'italic' : 'normal',
                    letterSpacing: '-0.02em',
                    px: { xs: 3, md: 5 },
                    whiteSpace: 'nowrap',
                  }}
                >
                  {name}
                </Box>
                <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.copper, flexShrink: 0 }} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
