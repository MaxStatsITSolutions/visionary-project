import { useState } from 'react';
import { Box, Button, Typography, type SxProps, type Theme } from '@mui/material';
import { colors, fonts } from '../theme/tokens';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { getMotionPref, setMotionPref, systemPrefersReduced } from './preference';

/** "Motion on / off" switch. Overrides the OS setting for this browser. */
export function MotionToggle({ sx }: { sx?: SxProps<Theme> }) {
  const reduced = usePrefersReducedMotion();
  return (
    <Button
      variant="text"
      color="inherit"
      size="small"
      aria-pressed={!reduced}
      onClick={() => setMotionPref(reduced ? 'on' : 'off')}
      sx={[{ gap: 1, px: 1.5 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 8, height: 8, border: `1px solid ${colors.ink}`, bgcolor: reduced ? 'transparent' : colors.copper }}
      />
      Motion {reduced ? 'off' : 'on'}
    </Button>
  );
}

const DISMISS_KEY = 'vz-motion-notice';

function wasDismissed() {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Shown once when the operating system asks for reduced motion and the
 * visitor has not chosen yet: explains why nothing moves, and offers a switch.
 */
export function MotionNotice() {
  const reduced = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(wasDismissed);
  if (hidden || !reduced || !systemPrefersReduced() || getMotionPref() !== 'system') return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  return (
    <Box
      role="region"
      aria-label="Animation setting"
      sx={{
        position: 'fixed',
        zIndex: 1500,
        left: { xs: 12, md: 24 },
        right: { xs: 12, sm: 'auto' },
        bottom: { xs: 12, md: 24 },
        maxWidth: 420,
        p: 2,
        display: 'grid',
        gap: 1.5,
        bgcolor: colors.ink,
        color: colors.canvas,
        boxShadow: '0 20px 50px rgba(25,27,26,0.35)',
      }}
    >
      <Typography sx={{ fontFamily: fonts.mono, fontSize: '0.75rem', letterSpacing: '0.04em', lineHeight: 1.5 }}>
        Your computer asks websites to reduce motion, so the drawing and scroll animations are paused.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => setMotionPref('on')}
          sx={{ bgcolor: colors.canvas, color: colors.ink, '&:hover': { bgcolor: colors.copper, color: colors.ink } }}
        >
          Turn animations on
        </Button>
        <Button size="small" variant="outlined" onClick={dismiss} sx={{ color: colors.canvas, borderColor: 'rgba(244,241,234,0.5)' }}>
          Keep them off
        </Button>
      </Box>
    </Box>
  );
}
