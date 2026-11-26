import { Box, Button, Typography } from '@mui/material';
import type { Navigate } from '../types/navigation';
import { layout } from '../theme/tokens';
import { RevealText } from '../components/common/Reveal';
import { Section } from '../components/layout/Section';

/** Temporary screen for sections owned by other milestones/branches. */
export function PlaceholderScreen({ title, onNavigate }: { title: string; onNavigate: Navigate }) {
  return (
    <Section sx={{ pt: `${layout.headerHeight + 96}px`, pb: 16, minHeight: '70vh' }}>
      <Box sx={{ display: 'grid', gap: 4, justifyItems: 'start' }}>
        <Typography variant="overline" color="text.secondary">
          In progress
        </Typography>
        <RevealText component="h1" variant="h2" immediate lines={[title]} />
        <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
          This screen is being built in its own milestone.
        </Typography>
        <Button variant="outlined" color="inherit" onClick={() => onNavigate('home')}>
          Back to home
        </Button>
      </Box>
    </Section>
  );
}
