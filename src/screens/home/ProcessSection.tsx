import { Box, Typography } from '@mui/material';
import { colors, layout } from '../../theme/tokens';
import { Reveal, RevealText } from '../../components/common/Reveal';
import { SectionLabel } from '../../components/common/SectionLabel';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

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
          <SectionLabel index="04" label="How it works" />
          <RevealText id="process-title" variant="h2" lines={['From a photo', 'to a plan,', <em key="c">calmly.</em>]} />
        </Box>

        <Box component="ol" sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' }, listStyle: 'none', m: 0, p: 0, display: 'grid', gap: { xs: 8, md: 14 } }}>
          {STEPS.map((step, i) => (
            <Reveal component="li" key={step.title} sx={{ display: 'grid', gap: 2.5, pt: 3, borderTop: `1px solid ${colors.ink}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="h4" component="h3">
                  {step.title}
                </Typography>
                <Typography
                  aria-hidden
                  sx={{ fontFamily: '"Fraunces", serif', fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 300, lineHeight: 1, color: colors.limestone }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
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
