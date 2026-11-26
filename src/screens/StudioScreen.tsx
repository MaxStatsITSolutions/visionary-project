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
import { saveStudioProject } from '../features/studio/saveProject';
import type { StudioDraft, StudioFormValues } from '../features/studio/types';
import { usePhotoSelection } from '../features/studio/usePhotoSelection';
import { fieldsByStep, validateStep } from '../features/studio/validation';
import { useAppSelector } from '../store/hooks';

export function StudioScreen() {
  const user = useAppSelector((state) => state.auth.user);

  // The draft is read only once, when the screen opens.
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

  // Clears everything: draft, photo and form.
  function handleStartOver() {
    clearDraft();
    setDraft(null);
    setDraftRestored(false);
    removePhoto();
    setSaved(false);
    setSaveError(null);
    setActiveStep(0);
    setFormKey((key) => key + 1); // makes Formik start with empty fields
  }

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 720, mx: 'auto' }}>
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
              Start over
            </Button>
          }
        >
          We restored your draft. Photos are not kept in drafts, so choose it again if you need one.
        </Alert>
      )}

      {saved ? (
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Alert severity="success" role="status">
            Your project has been saved.
          </Alert>
          <Button
            type="button"
            variant="contained"
            sx={{ minHeight: 44, justifySelf: 'start' }}
            onClick={handleStartOver}
          >
            New project
          </Button>
        </Box>
      ) : (
        <Formik<StudioFormValues>
          key={formKey}
          initialValues={draft?.values ?? initialValues}
          validate={(values) => validateStep(values, activeStep)}
          onSubmit={async (values) => {
            setSaveError(null);
            if (!user) {
              setSaveError('Please sign in to save your project.');
              return;
            }
            // The photo is sent only if the user explicitly confirmed it.
            const photoToUpload = photo && photoConfirmed ? photo.file : null;
            try {
              await saveStudioProject(user.id, values, photoToUpload);
              clearDraft(); // the project is saved, the draft is no longer needed
              setSaved(true);
              setActiveStep(steps.length); // marks every step as completed
            } catch (error) {
              setSaveError(
                error instanceof Error
                  ? error.message
                  : 'We could not save your project. Please try again.',
              );
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

              {isLastStep && !user && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Sign in to save your project. Your draft stays on this device.
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  key="back"
                  type="button"
                  disabled={activeStep === 0 || isSubmitting}
                  onClick={() => setActiveStep((s) => s - 1)}
                >
                  Back
                </Button>

                {!isLastStep ? (
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
                    Next
                  </Button>
                ) : (
                  <Button
                    key="save"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !user || (Boolean(photo) && !photoConfirmed)}
                  >
                    {isSubmitting ? 'Saving…' : 'Save'}
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