import { Box } from '@mui/material';
import { interiorStyles } from '../../content/styles';
import { colors } from '../../theme/tokens';

/** Decorative ticker of style names. Paused on hover; static with reduced motion. */
export function StylesMarquee() {
  const row = interiorStyles.map((s) => s.name);
  return (
    <Box
      aria-hidden
      sx={{
        borderBlock: `1px solid ${colors.line}`,
        overflow: 'hidden',
        py: { xs: 2.5, md: 3.5 },
        '&:hover > div': { animationPlayState: 'paused' },
      }}
    >
      <Box sx={{ display: 'flex', width: 'max-content', animation: 'vz-marquee 48s linear infinite' }}>
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
