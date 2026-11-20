import { Box, Button, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { colors, layout } from '../../theme/tokens';
import { RevealText, Reveal } from '../../components/common/Reveal';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

export function HeroSection({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <Section labelledBy="hero-title" sx={{ pt: `${layout.headerHeight + 40}px`, pb: { xs: 6, md: 8 } }}>
      <Reveal sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="text.secondary">
          (01) AI home transformation
        </Typography>
        <Typography variant="overline" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Architectural calm × computational imagination
        </Typography>
      </Reveal>

      <Box sx={{ ...gridSx, alignItems: 'end', rowGap: 4 }}>
        <RevealText
          id="hero-title"
          component="h1"
          variant="h1"
          immediate
          delay={120}
          sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 9' } }}
          lines={[
            'See the room',
            <>
              <Box component="em" sx={{ fontStyle: 'italic', fontWeight: 300, color: colors.copper }}>
                before
              </Box>{' '}
              it exists.
            </>,
          ]}
        />
        <Reveal delay={500} sx={{ gridColumn: { xs: '1 / -1', md: '10 / -1' }, display: 'grid', gap: 3, pb: { md: 1.5 } }}>
          <Typography variant="subtitle1" color="text.secondary">
            A digital interior studio. Pick a direction, compare before and after, and shape a private project around your own room.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button variant="contained" size="large" onClick={() => onNavigate('studio')}>
              Start a project
            </Button>
            <Button variant="outlined" size="large" color="inherit" onClick={() => onNavigate('explore')}>
              Explore
            </Button>
          </Box>
        </Reveal>
      </Box>

    </Section>
  );
}
