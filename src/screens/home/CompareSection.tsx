import { useEffect, useState } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { colors, motion } from '../../theme/tokens';
import { beforeImage, stylesWithImages } from '../../content/styles';
import { interiorSrc } from '../../content/media';
import { Reveal } from '../../components/common/Reveal';
import { SectionLabel } from '../../components/common/SectionLabel';
import { InteriorImage } from '../../components/common/InteriorImage';
import { BeforeAfterSlider } from '../../components/gallery/BeforeAfterSlider';
import { Section } from '../../components/layout/Section';
import { ScrollTitle } from '../../motion/ScrollTitle';
import { RevealMask } from '../../motion/RevealMask';
import { gridSx } from '../../components/layout/grid';

const SLIDER_SIZES = '(min-width: 1440px) 1344px, calc(100vw - 40px)';

/** Hands-on comparison: drag between the empty room and any direction. */
export function CompareSection() {
  const [styleId, setStyleId] = useState(stylesWithImages[0]!.id);
  const style = stylesWithImages.find((s) => s.id === styleId) ?? stylesWithImages[0]!;

  // Warm the cache for the other concepts once the page is idle.
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
    <Section labelledBy="compare-title" sx={{ py: { xs: 14, md: 20 } }}>
      <Box sx={{ ...gridSx, rowGap: 3, mb: { xs: 5, md: 8 }, alignItems: 'end' }}>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 3' }, alignSelf: 'start', pt: { md: 2 } }}>
          <SectionLabel index="03" label="Compare" />
        </Box>
        <ScrollTitle id="compare-title" sx={{ gridColumn: { xs: '1 / -1', md: '4 / span 7' } }} lines={['Drag the wall', 'between then', 'and now.']} />
        <Reveal sx={{ gridColumn: { xs: '1 / -1', md: '10 / -1' } }}>
          <Typography color="text.secondary">Pick a direction, then drag or use the arrow keys to compare it with the empty room.</Typography>
        </Reveal>
      </Box>
      <RevealMask>
        <Box data-cursor="Drag">
          <BeforeAfterSlider
          label="Compare the empty room with the styled concept"
          beforeLabel="Before"
          afterLabel={style.name}
          initial={46}
          aspectRatio="3 / 2"
          before={
            <InteriorImage
              name={beforeImage}
              sizes={SLIDER_SIZES}
              alt="Empty living room before renovation: white walls, worn laminate floor, a large window and an arched doorway"
            />
          }
          after={
            <InteriorImage
              key={style.id}
              name={style.image}
              sizes={SLIDER_SIZES}
              alt={`The same living room as a ${style.name} concept: ${style.descriptor}`}
            />
          }
          />
        </Box>
      </RevealMask>
      <Reveal>

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
                    borderRadius: 0,
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
