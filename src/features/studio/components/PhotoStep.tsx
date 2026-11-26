import { useRef, type ChangeEvent } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import type { PhotoSelection } from '../types';

type PhotoStepProps = {
  photo: PhotoSelection | null;
  photoError: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export function PhotoStep({ photo, photoError, onSelect, onRemove }: PhotoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // lets the user pick the same file again
    if (file) onSelect(file);
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Photo of the room (optional)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          JPEG, PNG or WebP, up to 10 MB. The photo is not uploaded yet. It will only be
          uploaded after you confirm it in the last step.
        </Typography>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleChange}
      />

      {photoError && (
        <Alert severity="error" role="alert">
          {photoError}
        </Alert>
      )}

      {photo ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box
            component="img"
            src={photo.previewUrl}
            alt="Preview of the selected photo"
            sx={{
              width: '100%',
              maxHeight: 360,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          <Typography variant="body2">
            {photo.file.name} ({(photo.file.size / (1024 * 1024)).toFixed(2)} MB)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="outlined"
              sx={{ minHeight: 44 }}
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </Button>
            <Button
              type="button"
              color="error"
              sx={{ minHeight: 44 }}
              onClick={onRemove}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          type="button"
          variant="outlined"
          sx={{ minHeight: 44, justifySelf: 'start' }}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose a photo
        </Button>
      )}
    </Box>
  );
}