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
    event.target.value = ''; // позволява да избереш същия файл отново
    if (file) onSelect(file);
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Снимка на помещението (по желание)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          JPEG, PNG или WebP, до 10 MB. Снимката още не се качва никъде.
          Ще се качи само след твоето потвърждение в последната стъпка.
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
            alt="Преглед на избраната снимка"
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
              Смени снимката
            </Button>
            <Button
              type="button"
              color="error"
              sx={{ minHeight: 44 }}
              onClick={onRemove}
            >
              Премахни
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
          Избери снимка
        </Button>
      )}
    </Box>
  );
}