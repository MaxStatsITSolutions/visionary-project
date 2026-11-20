import { Box } from '@mui/material';
import { colors } from '../../theme/tokens';

export function SkipLink({ targetId = 'main' }: { targetId?: string }) {
  return (
    <Box
      component="a"
      href={`#${targetId}`}
      sx={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 2000,
        px: 2.5,
        py: 1.5,
        borderRadius: 999,
        bgcolor: colors.ink,
        color: colors.canvas,
        textDecoration: 'none',
        fontWeight: 500,
        transform: 'translateY(-160%)',
        transition: 'transform 200ms',
        '&:focus': { transform: 'none' },
      }}
    >
      Skip to content
    </Box>
  );
}
