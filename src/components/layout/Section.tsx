import type { ReactNode } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { layout } from '../../theme/tokens';

type SectionProps = {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  component?: 'section' | 'div' | 'footer';
  sx?: SxProps<Theme>;
  innerSx?: SxProps<Theme>;
};

/** Full-bleed section with a centred, gutter-padded content column. */
export function Section({ children, id, labelledBy, component = 'section', sx, innerSx }: SectionProps) {
  return (
    <Box component={component} id={id} aria-labelledby={labelledBy} sx={sx}>
      <Box
        sx={[
          {
            maxWidth: layout.maxWidth,
            mx: 'auto',
            px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` },
          },
          ...(Array.isArray(innerSx) ? innerSx : [innerSx]),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
}
