import { useFormikContext } from 'formik';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormHelperText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { budgetRanges, interiorStyles } from '../constants';
import type { StudioFormValues } from '../types';

export function StyleStep() {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext<StudioFormValues>();

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Избери стил
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {interiorStyles.map((style) => {
            const selected = values.interiorStyle === style.name;
            return (
              <Card
                key={style.name}
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  borderColor: selected ? 'primary.main' : 'divider',
                }}
              >
                <CardActionArea
                  aria-pressed={selected}
                  onClick={() => setFieldValue('interiorStyle', style.name)}
                  sx={{ minHeight: 44 }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" component="h3">
                      {style.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {style.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
        {touched.interiorStyle && errors.interiorStyle && (
          <FormHelperText error>{errors.interiorStyle}</FormHelperText>
        )}
      </Box>

      <TextField
        select
        name="budgetRange"
        label="Бюджет (по желание)"
        fullWidth
        value={values.budgetRange}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        <MenuItem value="">Не искам да посочвам</MenuItem>
        {budgetRanges.map((range) => (
          <MenuItem key={range} value={range}>
            {range}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="notes"
        label="Бележки (по желание)"
        fullWidth
        multiline
        minRows={3}
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Box>
  );
}