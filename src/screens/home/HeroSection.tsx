import { useState } from 'react';
import { Box, Button, ButtonBase, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { colors, layout, motion } from '../../theme/tokens';
import { interiorStyles } from '../../content/styles';
import { RevealText, Reveal } from '../../components/common/Reveal';
import { BeforeAfterSlider } from '../../components/gallery/BeforeAfterSlider';
import { RoomIllustration } from '../../components/illustrations/RoomIllustration';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

export function HeroSection({ onNavigate }: { onNavigate: Navigate }) {
  const [styleId, setStyleId] = useState(interiorStyles[0]!.id);
  const style = interiorStyles.find((s) => s.id === styleId) ?? interiorStyles[0]!;

  return (
    <Section labelledBy="hero-title" sx={{ pt: `${layout.headerHeight + 40}px`, pb: { xs: 10, md: 14 } }}>
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

      <Reveal delay={350} sx={{ mt: { xs: 6, md: 10 } }}>
        <BeforeAfterSlider
          label="Compare the sketch with the styled concept"
          beforeLabel="Sketch"
          afterLabel={style.name}
          initial={42}
          aspectRatio="16 / 9"
          before={<RoomIllustration variant="sketch" palette={style.palette} title="Architectural sketch of a living room with a sofa, window and floor lamp" />}
          after={<RoomIllustration variant="render" palette={style.palette} title={`The same living room styled as ${style.name}: ${style.descriptor}`} />}
        />

        <Box
          sx={{
            mt: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'center' },
            gap: 2,
          }}
        >
          <Box role="radiogroup" aria-label="Interior style" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {interiorStyles.map((s) => {
              const active = s.id === styleId;
              return (
                <ButtonBase
                  key={s.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStyleId(s.id)}
                  sx={{
                    minHeight: 44,
                    px: 2,
                    gap: 1,
                    borderRadius: 999,
                    border: `1px solid ${active ? colors.ink : colors.line}`,
                    bgcolor: active ? colors.ink : 'transparent',
                    color: active ? colors.canvas : colors.ink,
                    fontSize: '0.9rem',
                    transition: `all ${motion.fast}ms ${motion.ease}`,
                    '&:hover': { borderColor: colors.ink },
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ width: 10, height: 10, borderRadius: '50%', background: `linear-gradient(135deg, ${s.palette.sofa} 50%, ${s.palette.floor} 50%)` }}
                  />
                  {s.name}
                </ButtonBase>
              );
            })}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 320 }}>
            Demo preview — an illustrative concept, not AI-generated from an upload.
          </Typography>
        </Box>
      </Reveal>
    </Section>
  );
}
