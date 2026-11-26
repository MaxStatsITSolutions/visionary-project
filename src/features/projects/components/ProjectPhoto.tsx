import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '../../../theme/tokens';
import { useSignedPhoto } from '../useSignedPhoto';

/** A project's private photo in a 3:2 frame, with honest empty/failed states. */
export function ProjectPhoto({ path, alt, eager = false }: { path: string | null; alt: string; eager?: boolean }) {
  const photo = useSignedPhoto(path);
  return (
    <Box
      className="vz-paper"
      sx={{ position: 'relative', aspectRatio: '3 / 2', overflow: 'hidden', outline: `1px solid ${colors.ink}`, display: 'grid', placeItems: 'center' }}
    >
      {photo.status === 'ready' && photo.url && (
        <Box
          component="img"
          src={photo.url}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {photo.status === 'loading' && <CircularProgress size={22} thickness={3} aria-label="Loading photo" sx={{ color: colors.copper }} />}
      {(photo.status === 'none' || photo.status === 'failed') && (
        <Typography variant="overline" color="text.secondary">
          {photo.status === 'none' ? 'No photo' : 'Photo unavailable'}
        </Typography>
      )}
    </Box>
  );
}
