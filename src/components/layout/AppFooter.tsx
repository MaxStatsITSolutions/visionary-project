import { Box, Button, ButtonBase, Typography } from '@mui/material';
import type { Navigate, NavigableScreen } from '../../types/navigation';
import { colors, fonts, motion, width } from '../../theme/tokens';
import { RevealText } from '../common/Reveal';
import { SectionLabel } from '../common/SectionLabel';
import { Section } from './Section';
import { useInView } from '../../hooks/useInView';
import { gridSx } from './grid';

const LINKS: { screen: NavigableScreen; label: string }[] = [
  { screen: 'explore', label: 'Explore' },
  { screen: 'how-it-works', label: 'How it works' },
  { screen: 'studio', label: 'Studio' },
  { screen: 'privacy', label: 'Privacy' },
];

/** Giant outline wordmark whose letters rise one by one when it enters. */
function WordmarkLetters() {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  return (
    <Box component="span" ref={ref} sx={{ display: 'inline-flex', overflow: 'hidden', pb: '0.06em' }}>
      {Array.from('VISIONARY').map((ch, i) => (
        <Box
          component="span"
          key={i}
          sx={{
            display: 'inline-block',
            transform: inView ? 'none' : 'translateY(100%)',
            transition: `transform 1.3s var(--ease) ${i * 70}ms`,
          }}
        >
          {ch}
        </Box>
      ))}
    </Box>
  );
}

export function AppFooter({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <Section
      component="footer"
      sx={{ bgcolor: colors.ink, color: colors.canvas, pt: { xs: 12, md: 18 }, overflow: 'hidden' }}
    >
      <SectionLabel index="07" label="Begin" tone="light" />
      <Box sx={{ ...gridSx, mt: { xs: 4, md: 6 }, rowGap: 6, alignItems: 'end' }}>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 8' } }}>
          <RevealText
            variant="h2"
            lines={[
              'Your room is',
              <>
                <Box component="span" sx={{ color: colors.copper }}>
                  waiting
                </Box>{' '}
                to be seen.
              </>,
            ]}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '9 / -1' }, display: 'grid', gap: 3, justifyItems: 'start' }}>
          <Typography sx={{ color: 'rgba(244,241,234,0.72)', maxWidth: 360 }}>
            Upload a photo, choose a direction and keep every idea in one private project.
          </Typography>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={() => onNavigate('studio')}
            sx={{ color: colors.ink, bgcolor: colors.canvas, '&:hover': { bgcolor: colors.copper, color: colors.ink } }}
          >
            Start a project
          </Button>
        </Box>
      </Box>

      <Box
        component="nav"
        aria-label="Footer"
        sx={{
          mt: { xs: 12, md: 16 },
          pt: 3,
          borderTop: '1px solid rgba(244,241,234,0.16)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 4 }, listStyle: 'none', m: 0, p: 0 }}>
          {LINKS.map((l) => (
            <li key={l.screen}>
              <ButtonBase
                onClick={() => onNavigate(l.screen)}
                sx={{
                  minHeight: 44,
                  px: 0.5,
                  color: 'rgba(244,241,234,0.72)',
                  transition: `color ${motion.fast}ms`,
                  '&:hover, &:focus-visible': { color: colors.canvas },
                }}
              >
                {l.label}
              </ButtonBase>
            </li>
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(244,241,234,0.56)', alignSelf: 'center' }}>
          Visuals are illustrative AI concept images — not generated from your upload.
        </Typography>
      </Box>

      <Box
        aria-hidden
        sx={{
          mt: { xs: 4, md: 6 },
          mb: { xs: -1.5, md: -4 },
          fontFamily: fonts.display,
          fontVariationSettings: width(62),
          fontWeight: 300,
          fontSize: 'clamp(4rem, 17.5vw, 17rem)',
          lineHeight: 0.8,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(244,241,234,0.32)',
          userSelect: 'none',
        }}
      >
        <WordmarkLetters />
      </Box>
    </Section>
  );
}
