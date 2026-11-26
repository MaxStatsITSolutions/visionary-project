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

// One row in the review: label, value and an "Edit" button.
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
        aria-label={`Edit: ${label}`}
      >
        Edit
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
        Review your project
      </Typography>

      <Box>
        <ReviewRow label="Project name" value={values.title} onEdit={() => onEditStep(0)} />
        <Divider />
        <ReviewRow label="Room type" value={values.roomType} onEdit={() => onEditStep(0)} />
        <Divider />
        <ReviewRow label="Style" value={values.interiorStyle} onEdit={() => onEditStep(1)} />
        <Divider />
        <ReviewRow
          label="Budget"
          value={values.budgetRange || 'Not specified'}
          onEdit={() => onEditStep(1)}
        />
        <Divider />
        <ReviewRow
          label="Notes"
          value={values.notes.trim() || 'No notes'}
          onEdit={() => onEditStep(1)}
        />
        <Divider />
        <ReviewRow
          label="Photo"
          value={photo ? photo.file.name : 'No photo selected'}
          onEdit={() => onEditStep(2)}
        />
      </Box>

      {photo && (
        <>
          <Box
            component="img"
            src={photo.previewUrl}
            alt="Selected photo of the room"
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
            label="I confirm this photo can be uploaded to the project."
          />
        </>
      )}
    </Box>
  );
}