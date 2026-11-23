import { useState } from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormHelperText,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

const steps = ['Детайли', 'Стил', 'Снимка', 'Преглед'];
const roomTypes = ['Хол', 'Спалня', 'Кухня', 'Баня', 'Офис'];

const interiorStyles = [
  { name: 'Скандинавски', description: 'Светло, уютно, естествено дърво' },
  { name: 'Модерен', description: 'Чисти линии и прости форми' },
  { name: 'Минималистичен', description: 'Малко мебели, много въздух' },
  { name: 'Класически', description: 'Елегантни детайли и симетрия' },
  { name: 'Индустриален', description: 'Тухла, метал и суров бетон' },
  { name: 'Бохо', description: 'Цветно, меко и с много растения' },
];

const budgetRanges = [
  'До 2 000 €',
  '2 000 – 5 000 €',
  '5 000 – 10 000 €',
  'Над 10 000 €',
];

type StudioFormValues = {
  title: string;
  roomType: string;
  interiorStyle: string;
  budgetRange: string;
  notes: string;
};

const initialValues: StudioFormValues = {
  title: '',
  roomType: '',
  interiorStyle: '',
  budgetRange: '',
  notes: '',
};

// Кои полета принадлежат на коя стъпка (за "touched" при грешка).
const fieldsByStep: Record<number, (keyof StudioFormValues)[]> = {
  0: ['title', 'roomType'],
  1: ['interiorStyle'],
};

// Проверява само полетата на текущата стъпка.
function validateStep(values: StudioFormValues, step: number) {
  const errors: Partial<Record<keyof StudioFormValues, string>> = {};
  if (step === 0) {
    if (!values.title.trim()) errors.title = 'Въведи име на проекта';
    if (!values.roomType) errors.roomType = 'Избери помещение';
  }
  if (step === 1) {
    if (!values.interiorStyle) errors.interiorStyle = 'Избери интериорен стил';
  }
  return errors;
}

export function StudioScreen() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Studio
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik<StudioFormValues>
        initialValues={initialValues}
        validate={(values) => validateStep(values, activeStep)}
        onSubmit={(values) => {
          // Засега само показваме данните в конзолата. Supabase идва по-късно.
          console.log('Проект:', values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          validateForm,
          setTouched,
          setFieldValue,
        }) => (
          <Form>
            {activeStep === 0 && (
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
            )}

            {activeStep === 1 && (
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
            )}

            {activeStep > 1 && (
              <Typography>Стъпка „{steps[activeStep]}“ ще я направим следващата.</Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                key="back"
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => s - 1)}
              >
                Назад
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  key="next"
                  type="button"
                  variant="contained"
                  onClick={async () => {
                    const stepErrors = await validateForm();
                    if (Object.keys(stepErrors).length === 0) {
                      setActiveStep((s) => s + 1);
                    } else {
                      const toTouch = fieldsByStep[activeStep] ?? [];
                      setTouched(
                        Object.fromEntries(toTouch.map((field) => [field, true])),
                      );
                    }
                  }}
                >
                  Напред
                </Button>
              ) : (
                <Button key="save" type="submit" variant="contained">
                  Запази
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}