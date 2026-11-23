import { useFormikContext } from 'formik';
import { Box, MenuItem, TextField } from '@mui/material';
import { roomTypes } from '../constants';
import type { StudioFormValues } from '../types';

export function DetailsStep() {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<StudioFormValues>();

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <TextField
        name="title"
        label="Име на проекта"
        fullWidth
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(touched.title && errors.title)}
        helperText={touched.title && errors.title}
      />
      <TextField
        select
        name="roomType"
        label="Помещение"
        fullWidth
        value={values.roomType}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(touched.roomType && errors.roomType)}
        helperText={touched.roomType && errors.roomType}
      >
        {roomTypes.map((room) => (
          <MenuItem key={room} value={room}>
            {room}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}