import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
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

// Правила за снимката (раздел 12.4 от спецификацията).
const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxPhotoSize = 10 * 1024 * 1024; // 10 MB

type PhotoSelection = { file: File; previewUrl: string };

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

// ---------- Локална чернова (само в този браузър) ----------

const DRAFT_KEY = 'visionary:studio-draft';

type StudioDraft = { values: StudioFormValues; activeStep: number };

function loadDraft(): StudioDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StudioDraft>;
    if (!data.values || typeof data.activeStep !== 'number') return null;
    return {
      values: { ...initialValues, ...data.values },
      activeStep: Math.min(Math.max(data.activeStep, 0), steps.length - 1),
    };
  } catch {
    return null; // повредена чернова или недостъпно хранилище
  }
}

function saveDraft(draft: StudioDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ако браузърът не позволява запис, просто продължаваме без чернова.
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // нищо за правене
  }
}

// Невидим компонент: при всяка промяна запазва черновата.
function DraftSaver({ activeStep }: { activeStep: number }) {
  const { values } = useFormikContext<StudioFormValues>();
  useEffect(() => {
    saveDraft({ values, activeStep });
  }, [values, activeStep]);
  return null;
}

// ---------- Валидация ----------

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

export function StudioScreen() {
  // Черновата се чете само веднъж, при отваряне на екрана.
  const [draft, setDraft] = useState<StudioDraft | null>(loadDraft);
  const [draftRestored, setDraftRestored] = useState(draft !== null);
  const [formKey, setFormKey] = useState(0);

  const [activeStep, setActiveStep] = useState(draft?.activeStep ?? 0);
  const [saved, setSaved] = useState(false);

  // Снимката се държи отделно от Formik, като обикновен File обект.
  const [photo, setPhoto] = useState<PhotoSelection | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Когато излезем от екрана, освобождаваме паметта на preview адреса.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // позволява да избереш същия файл отново
    if (!file) return;

    if (!allowedPhotoTypes.includes(file.type)) {
      setPhotoError('Позволени формати: JPEG, PNG или WebP.');
      return;
    }
    if (file.size > maxPhotoSize) {
      setPhotoError('Снимката е твърде голяма. Максимумът е 10 MB.');
      return;
    }

    setPhotoError(null);
    setPhotoConfirmed(false); // нова снимка = ново потвърждение
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setPhoto({ file, previewUrl });
  }

  function handleRemovePhoto() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPhoto(null);
    setPhotoError(null);
    setPhotoConfirmed(false);
  }

  // Изчиства всичко: чернова, снимка и форма.
  function handleStartOver() {
    clearDraft();
    setDraft(null);
    setDraftRestored(false);
    handleRemovePhoto();
    setSaved(false);
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
            Проектът е готов. Засега е само преглед: запазването в Supabase
            ще се добави по-късно.
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
          onSubmit={(values) => {
            // Засега само показваме данните в конзолата. Supabase идва по-късно.
            console.log('Проект:', values, 'Снимка:', photo?.file);
            clearDraft(); // проектът е завършен, черновата вече не е нужна
            setSaved(true);
            setActiveStep(steps.length); // всички стъпки са "завършени"
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
              <DraftSaver activeStep={activeStep} />

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

              {activeStep === 2 && (
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
                    onChange={handlePhotoChange}
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
                          onClick={handleRemovePhoto}
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
              )}

              {activeStep === 3 && (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Typography variant="h6" component="h2">
                    Преглед на проекта
                  </Typography>

                  <Box>
                    <ReviewRow
                      label="Име на проекта"
                      value={values.title}
                      onEdit={() => setActiveStep(0)}
                    />
                    <Divider />
                    <ReviewRow
                      label="Помещение"
                      value={values.roomType}
                      onEdit={() => setActiveStep(0)}
                    />
                    <Divider />
                    <ReviewRow
                      label="Стил"
                      value={values.interiorStyle}
                      onEdit={() => setActiveStep(1)}
                    />
                    <Divider />
                    <ReviewRow
                      label="Бюджет"
                      value={values.budgetRange || 'Не е посочен'}
                      onEdit={() => setActiveStep(1)}
                    />
                    <Divider />
                    <ReviewRow
                      label="Бележки"
                      value={values.notes.trim() || 'Няма бележки'}
                      onEdit={() => setActiveStep(1)}
                    />
                    <Divider />
                    <ReviewRow
                      label="Снимка"
                      value={photo ? photo.file.name : 'Не е избрана'}
                      onEdit={() => setActiveStep(2)}
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
                            onChange={(event) => setPhotoConfirmed(event.target.checked)}
                          />
                        }
                        label="Потвърждавам, че тази снимка може да бъде качена към проекта."
                      />
                    </>
                  )}
                </Box>
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
                  <Button
                    key="save"
                    type="submit"
                    variant="contained"
                    disabled={Boolean(photo) && !photoConfirmed}
                  >
                    Запази
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