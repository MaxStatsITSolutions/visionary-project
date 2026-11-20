import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { colors, layout, motion } from '../../theme/tokens';
import { beforeImage, stylesWithImages } from '../../content/styles';
import { RevealText, Reveal } from '../../components/common/Reveal';
import { InteriorImage } from '../../components/common/InteriorImage';
import { interiorSrc } from '../../content/media';
import { BeforeAfterSlider } from '../../components/gallery/BeforeAfterSlider';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

const SLIDER_SIZES = '(min-width: 1440px) 1344px, calc(100vw - 40px)';

export function HeroSection({ onNavigate }: { onNavigate: Navigate }) {
  const [styleId, setStyleId] = useState(stylesWithImages[0]!.id);
  const style = stylesWithImages.find((s) => s.id === styleId) ?? stylesWithImages[0]!;

  // Warm the cache for the other concepts once the page is idle, so switching
  // styles is instant without competing with the first paint.
  useEffect(() => {
    const warm = () => {
      const w = window.innerWidth * window.devicePixelRatio > 900 ? 1600 : 800;
      stylesWithImages.forEach((s) => {
        const img = new Image();
        img.src = interiorSrc(s.image, w);
      });
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(warm, 2500);
    return () => globalThis.clearTimeout(t);
  }, []);

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
          label="Compare the empty room with the styled concept"
          beforeLabel="Before"
          afterLabel={style.name}
          initial={46}
          aspectRatio="3 / 2"
          before={
            <InteriorImage
              name={beforeImage}
              priority
              sizes={SLIDER_SIZES}
              alt="Empty living room before renovation: white walls, worn laminate floor, a large window and an arched doorway"
            />
          }
          after={
            <InteriorImage
              key={style.id}
              name={style.image}
              priority
              sizes={SLIDER_SIZES}
              alt={`The same living room as a ${style.name} concept: ${style.descriptor}`}
            />
          }
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
            {stylesWithImages.map((s) => {
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
                    sx={{ width: 10, height: 10, borderRadius: '50%', background: `linear-gradient(135deg, ${s.swatches[2]} 50%, ${s.swatches[1]} 50%)` }}
                  />
                  {s.name}
                </ButtonBase>
              );
            })}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 340 }}>
            Demo preview — illustrative AI concept images, not generated from your upload.
          </Typography>
        </Box>
      </Reveal>
    </Section>
  );
}
