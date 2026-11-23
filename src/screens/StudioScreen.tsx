import { useState } from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

const steps = ['Детайли', 'Стил', 'Снимка', 'Преглед'];
const roomTypes = ['Хол', 'Спалня', 'Кухня', 'Баня', 'Офис'];

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

// Проверява само полетата на текущата стъпка.
function validateStep(values: StudioFormValues, step: number) {
  const errors: Partial<Record<keyof StudioFormValues, string>> = {};
  if (step === 0) {
    if (!values.title.trim()) errors.title = 'Въведи име на проекта';
    if (!values.roomType) errors.roomType = 'Избери помещение';
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

            {activeStep > 0 && (
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
                      setTouched({ title: true, roomType: true });
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