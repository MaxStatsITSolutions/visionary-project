import { useFormikContext } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from '@mui/material';
import type { PhotoSelection, StudioFormValues } from '../types';

// Един ред в прегледа: етикет, стойност и бутон "Промени".
function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        py: 1.5,
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography>
      </Box>
      <Button
        type="button"
        size="small"
        onClick={onEdit}
        sx={{ minHeight: 44, flexShrink: 0 }}
        aria-label={`Промени: ${label}`}
      >
        Промени
      </Button>
    </Box>
  );
}

type ReviewStepProps = {
  photo: PhotoSelection | null;
  photoConfirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  onEditStep: (step: number) => void;
};

export function ReviewStep({
  photo,
  photoConfirmed,
  onConfirmChange,
  onEditStep,
}: ReviewStepProps) {
  const { values } = useFormikContext<StudioFormValues>();

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h6" component="h2">
        Преглед на проекта
      </Typography>

      <Box>
        <ReviewRow label="Име на проекта" value={values.title} onEdit={() => onEditStep(0)} />
        <Divider />
        <ReviewRow label="Помещение" value={values.roomType} onEdit={() => onEditStep(0)} />
        <Divider />
        <ReviewRow label="Стил" value={values.interiorStyle} onEdit={() => onEditStep(1)} />
        <Divider />
        <ReviewRow
          label="Бюджет"
          value={values.budgetRange || 'Не е посочен'}
          onEdit={() => onEditStep(1)}
        />
        <Divider />
        <ReviewRow
          label="Бележки"
          value={values.notes.trim() || 'Няма бележки'}
          onEdit={() => onEditStep(1)}
        />
        <Divider />
        <ReviewRow
          label="Снимка"
          value={photo ? photo.file.name : 'Не е избрана'}
          onEdit={() => onEditStep(2)}
        />
      </Box>

      {photo && (
        <>
          <Box
            component="img"
            src={photo.previewUrl}
            alt="Избраната снимка на помещението"
            sx={{
              width: '100%',
              maxHeight: 280,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={photoConfirmed}
                onChange={(event) => onConfirmChange(event.target.checked)}
              />
            }
            label="Потвърждавам, че тази снимка може да бъде качена към проекта."
          />
        </>
      )}
    </Box>
  );
}