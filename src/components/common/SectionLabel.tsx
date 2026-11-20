import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { colors } from '../../theme/tokens';

type SectionLabelProps = {
  index: string;
  label: string;
  tone?: 'dark' | 'light';
  sx?: SxProps<Theme>;
};

/** "(02) — Styles" editorial section marker. */
export function SectionLabel({ index, label, tone = 'dark', sx }: SectionLabelProps) {
  const color = tone === 'dark' ? colors.inkSoft : 'rgba(244, 241, 234, 0.72)';
  return (
    <Box sx={[{ display: 'flex', alignItems: 'center', gap: 1.5, color }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Typography variant="overline" component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        ({index})
      </Typography>
      <Box component="span" aria-hidden sx={{ width: 32, height: '1px', bgcolor: 'currentColor', opacity: 0.6 }} />
      <Typography variant="overline" component="span">
        {label}
      </Typography>
    </Box>
  );
}
