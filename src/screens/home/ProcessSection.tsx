import { Box, Typography } from '@mui/material';
import { colors, fonts, layout } from '../../theme/tokens';
import { Reveal } from '../../components/common/Reveal';
import { SectionLabel } from '../../components/common/SectionLabel';
import { Section } from '../../components/layout/Section';
import { ScrollTitle } from '../../motion/ScrollTitle';
import { gridSx } from '../../components/layout/grid';
import { Parallax } from '../../motion/Parallax';

const STEPS = [
  {
    title: 'Choose a direction',
    body: 'Browse six material languages and compare them side by side on the same room before you commit to anything.',
  },
  {
    title: 'Add your room',
    body: 'Upload a photo of your space. It is stored privately in your account and only shown to you through short-lived links.',
  },
  {
    title: 'Keep it in a project',
    body: 'Name the room, set a budget range and notes. Projects stay private to you and can be edited or deleted at any time.',
  },
];

export function ProcessSection() {
  return (
    <Section labelledBy="process-title" sx={{ bgcolor: colors.white, py: { xs: 14, md: 22 } }}>
      <Box sx={{ ...gridSx, rowGap: 8 }}>
        <Box
          sx={{
            gridColumn: { xs: '1 / -1', md: '1 / span 5' },
            alignSelf: 'start',
            position: { md: 'sticky' },
            top: { md: layout.headerHeight + 48 },
            display: 'grid',
            gap: 4,
          }}
        >
          <SectionLabel index="06" label="How it works" />
          <ScrollTitle id="process-title" lines={['From a photo', 'to a plan,', 'calmly.']} />
        </Box>

        <Box component="ol" sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' }, listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 8, md: 14 } }}>
          {STEPS.map((step, i) => (
            <Reveal component="li" key={step.title} sx={{ display: 'grid', gap: 2.5, pt: 3, position: 'relative' }}>
              <Box aria-hidden className="vz-rule" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', bgcolor: colors.ink }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="h4" component="h3">
                  {step.title}
                </Typography>
                <Parallax speed={-0.1} aria-hidden>
                  <Typography
                    sx={{ fontFamily: fonts.mono, fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 400, lineHeight: 1, color: colors.limestone }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                </Parallax>
              </Box>
              <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
                {step.body}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
