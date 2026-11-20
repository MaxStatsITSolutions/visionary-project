import { useRef, useState, type PointerEvent } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { interiorStyles } from '../../content/styles';
import { colors, motion } from '../../theme/tokens';
import { RevealText, Reveal } from '../../components/common/Reveal';
import { SectionLabel } from '../../components/common/SectionLabel';
import { RoomIllustration } from '../../components/illustrations/RoomIllustration';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

/**
 * Editorial index of styles. On fine pointers a preview card trails the
 * cursor (transform only, written to the DOM without re-rendering); on touch
 * each row carries its own inline thumbnail instead.
 */
export function StylesIndexSection({ onNavigate }: { onNavigate: Navigate }) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent) => {
    const list = listRef.current?.getBoundingClientRect();
    const el = previewRef.current;
    if (!list || !el || e.pointerType !== 'mouse') return;
    el.style.transform = `translate3d(${e.clientX - list.left}px, ${e.clientY - list.top}px, 0) translate(-50%, -50%)`;
  };

  return (
    <Section labelledBy="styles-title" sx={{ pb: { xs: 14, md: 22 } }}>
      <Box sx={{ ...gridSx, rowGap: 3, mb: { xs: 6, md: 10 }, alignItems: 'end' }}>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 3' }, alignSelf: 'start', pt: { md: 2 } }}>
          <SectionLabel index="03" label="Directions" />
        </Box>
        <RevealText
          id="styles-title"
          variant="h2"
          sx={{ gridColumn: { xs: '1 / -1', md: '4 / span 6' } }}
          lines={['Six directions,', 'one room.']}
        />
        <Reveal sx={{ gridColumn: { xs: '1 / -1', md: '10 / -1' } }}>
          <Typography color="text.secondary">
            Each direction is a complete material language — palette, timber, textile and light — applied to the same space.
          </Typography>
        </Reveal>
      </Box>

      <Box
        ref={listRef}
        component="ul"
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
        sx={{ position: 'relative', listStyle: 'none', m: 0, p: 0, borderTop: `1px solid ${colors.line}` }}
      >
        {interiorStyles.map((s, i) => {
          const isActive = active === s.id;
          const dim = active !== null && !isActive;
          return (
            <Box component="li" key={s.id} sx={{ borderBottom: `1px solid ${colors.line}` }}>
              <ButtonBase
                onPointerEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onBlur={() => setActive(null)}
                onClick={() => onNavigate('explore')}
                aria-label={`${s.name}: ${s.descriptor} Explore this direction`}
                sx={{
                  width: '100%',
                  ...gridSx,
                  alignItems: 'center',
                  textAlign: 'left',
                  py: { xs: 2.5, md: 3.5 },
                  transition: `opacity ${motion.base}ms ${motion.ease}`,
                  opacity: dim ? 0.32 : 1,
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ gridColumn: { xs: '1 / span 1', md: '1 / span 1' } }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  variant="h3"
                  component="span"
                  sx={{
                    gridColumn: { xs: '2 / span 3', sm: '2 / span 4', md: '2 / span 5' },
                    transition: `transform ${motion.base}ms ${motion.ease}, font-style 0ms`,
                    transform: isActive ? 'translateX(12px)' : 'none',
                    fontStyle: isActive ? 'italic' : 'normal',
                  }}
                >
                  {s.name}
                </Typography>
                <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, gridColumn: { sm: '6 / span 3', md: '7 / span 4' } }}>
                  {s.descriptor}
                </Typography>
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    gridColumn: '11 / -1',
                    justifyContent: 'flex-end',
                    gap: 0.75,
                  }}
                >
                  {[s.palette.wall, s.palette.floor, s.palette.sofa, s.palette.cushion].map((c) => (
                    <Box key={c} component="span" sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: c, boxShadow: `inset 0 0 0 1px ${colors.line}` }} />
                  ))}
                </Box>
                {/* Touch / small screens: inline thumbnail */}
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    gridColumn: { xs: '2 / -1', sm: '2 / span 4' },
                    mt: 2,
                    aspectRatio: '16 / 9',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <RoomIllustration variant="render" palette={s.palette} title="" />
                </Box>
              </ButtonBase>
            </Box>
          );
        })}

        {/* Cursor-following preview (desktop) */}
        <Box
          ref={previewRef}
          aria-hidden
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              aspectRatio: '4 / 3',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 30px 60px -20px rgba(25,27,26,0.4)',
              transition: `opacity ${motion.fast}ms ${motion.ease}, transform ${motion.base}ms ${motion.ease}`,
              opacity: active ? 1 : 0,
              transform: active ? 'scale(1) rotate(-2deg)' : 'scale(0.85) rotate(0deg)',
              position: 'relative',
            }}
          >
            {interiorStyles.map((s) => (
              <Box key={s.id} sx={{ position: 'absolute', inset: 0, opacity: active === s.id ? 1 : 0, transition: `opacity ${motion.fast}ms` }}>
                <RoomIllustration variant="render" palette={s.palette} title="" />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
