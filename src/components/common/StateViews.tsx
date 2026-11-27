import type { ReactNode } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { colors } from '../../theme/tokens';

type BaseProps = { title: string; description?: string; action?: ReactNode };

function Frame({ children, role, live }: { children: ReactNode; role?: string; live?: 'polite' | 'assertive' }) {
  return (
    <Box
      role={role}
      aria-live={live}
      sx={{
        display: 'grid',
        justifyItems: 'center',
        textAlign: 'center',
        gap: 2,
        py: { xs: 8, md: 12 },
        px: 3,
        border: `1px dashed ${colors.limestone}`,
        borderRadius: 1,
      }}
    >
      {children}
    </Box>
  );
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <Frame role="status" live="polite">
      <CircularProgress size={28} thickness={3} sx={{ color: colors.copper }} aria-hidden />
      <Typography variant="overline" color="text.secondary">
        {label}…
      </Typography>
    </Frame>
  );
}

export function EmptyState({ title, description, action }: BaseProps) {
  return (
    <Frame>
      <Typography variant="h4" component="p">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          {description}
        </Typography>
      )}
      {action}
    </Frame>
  );
}

export function ErrorState({ title, description, onRetry }: Omit<BaseProps, 'action'> & { onRetry?: () => void }) {
  return (
    <Frame role="alert">
      <Typography variant="h4" component="p">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          {description}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Frame>
  );
}
