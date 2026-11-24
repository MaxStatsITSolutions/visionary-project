import { useState } from 'react';
import { Form, Formik } from 'formik';
import { Alert, Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { DetailsStep } from '../features/studio/components/DetailsStep';
import { DraftSaver } from '../features/studio/components/DraftSaver';
import { PhotoStep } from '../features/studio/components/PhotoStep';
import { ReviewStep } from '../features/studio/components/ReviewStep';
import { StyleStep } from '../features/studio/components/StyleStep';
import { initialValues, steps } from '../features/studio/constants';
import { clearDraft, loadDraft } from '../features/studio/draft';
import type { StudioSaveHandler } from '../features/studio/saveProject';
import type { StudioDraft, StudioFormValues } from '../features/studio/types';
import { usePhotoSelection } from '../features/studio/usePhotoSelection';
import { fieldsByStep, validateStep } from '../features/studio/validation';

type StudioScreenProps = {
  // Ако не е подадена, екранът работи в демо режим (само печата в конзолата).
  onSave?: StudioSaveHandler;
};

export function StudioScreen({ onSave }: StudioScreenProps) {
  // Черновата се чете само веднъж, при отваряне на екрана.
  const [draft, setDraft] = useState<StudioDraft | null>(loadDraft);
  const [draftRestored, setDraftRestored] = useState(draft !== null);
  const [formKey, setFormKey] = useState(0);

  const [activeStep, setActiveStep] = useState(draft?.activeStep ?? 0);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    photo,
    photoError,
    photoConfirmed,
    setPhotoConfirmed,
    selectPhoto,
    removePhoto,
  } = usePhotoSelection();

  // Изчиства всичко: чернова, снимка и форма.
  function handleStartOver() {
    clearDraft();
    setDraft(null);
    setDraftRestored(false);
    removePhoto();
    setSaved(false);
    setSaveError(null);
    setActiveStep(0);
    setFormKey((key) => key + 1); // кара Formik да започне с празни полета
  }

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

      {draftRestored && !saved && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          onClose={() => setDraftRestored(false)}
          action={
            <Button
              type="button"
              color="inherit"
              size="small"
              sx={{ minHeight: 44 }}
              onClick={handleStartOver}
            >
              Започни отначало
            </Button>
          }
        >
          Възстановихме твоята чернова. Снимката не се пази, избери я отново, ако ти е нужна.
        </Alert>
      )}

      {saved ? (
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Alert severity="success" role="status">
            {onSave
              ? 'Проектът е запазен.'
              : 'Проектът е готов. Това е демо режим: нищо не е записано в Supabase.'}
          </Alert>
          <Button
            type="button"
            variant="contained"
            sx={{ minHeight: 44, justifySelf: 'start' }}
            onClick={handleStartOver}
          >
            Нов проект
          </Button>
        </Box>
      ) : (
        <Formik<StudioFormValues>
          key={formKey}
          initialValues={draft?.values ?? initialValues}
          validate={(values) => validateStep(values, activeStep)}
          onSubmit={async (values) => {
            setSaveError(null);
            // Снимката се изпраща само ако е изрично потвърдена.
            const photoToUpload = photo && photoConfirmed ? photo.file : null;
            try {
              if (onSave) {
                await onSave(values, photoToUpload);
              } else {
                console.log('Демо проект:', values, 'Снимка:', photoToUpload);
              }
              clearDraft(); // проектът е завършен, черновата вече не е нужна
              setSaved(true);
              setActiveStep(steps.length); // всички стъпки са "завършени"
            } catch (error) {
              console.error('Грешка при запазване на проекта:', error);
              setSaveError('Проектът не можа да се запази. Опитай отново.');
            }
          }}
        >
          {({ validateForm, setTouched, isSubmitting }) => (
            <Form>
              <DraftSaver activeStep={activeStep} />

              {saveError && (
                <Alert severity="error" role="alert" sx={{ mb: 3 }}>
                  {saveError}
                </Alert>
              )}

              {activeStep === 0 && <DetailsStep />}
              {activeStep === 1 && <StyleStep />}
              {activeStep === 2 && (
                <PhotoStep
                  photo={photo}
                  photoError={photoError}
                  onSelect={selectPhoto}
                  onRemove={removePhoto}
                />
              )}
              {activeStep === 3 && (
                <ReviewStep
                  photo={photo}
                  photoConfirmed={photoConfirmed}
                  onConfirmChange={setPhotoConfirmed}
                  onEditStep={setActiveStep}
                />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  key="back"
                  type="button"
                  disabled={activeStep === 0 || isSubmitting}
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
                  <Button
                    key="save"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || (Boolean(photo) && !photoConfirmed)}
                  >
                    {isSubmitting ? 'Запазване…' : 'Запази'}
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
}