import { Form, Formik } from 'formik';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { budgetRanges } from '../../studio/constants';
import { updateProject, type Project, type ProjectEdit } from '../projectsService';

type Values = { title: string; budgetRange: string; notes: string };

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Enter a project name';
  else if (title.length > 120) errors.title = 'The name can be up to 120 characters';
  if (values.notes.length > 2000) errors.notes = 'Notes can be up to 2000 characters';
  return errors;
}

type Props = { project: Project; open: boolean; onClose: () => void; onSaved: (project: Project) => void };

/** Edit name, budget and notes (room type and style come from the Studio flow). */
export function EditProjectDialog({ project, open, onClose, onSaved }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="edit-project-title">
      <Formik<Values>
        initialValues={{ title: project.title, budgetRange: project.budget_range ?? '', notes: project.notes ?? '' }}
        validate={validate}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(null);
          const changes: ProjectEdit = {
            title: values.title.trim(),
            budget_range: values.budgetRange || null,
            notes: values.notes.trim() || null,
          };
          try {
            onSaved(await updateProject(project.id, changes));
          } catch (err) {
            helpers.setStatus(err instanceof Error ? err.message : 'We could not save your changes.');
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
          <Form noValidate>
            <DialogTitle id="edit-project-title">Edit project</DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                {status && (
                  <Alert severity="error" role="alert">
                    {status}
                  </Alert>
                )}
                <TextField
                  name="title"
                  label="Project name"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  autoFocus
                />
                <TextField select name="budgetRange" label="Budget (optional)" value={values.budgetRange} onChange={handleChange} onBlur={handleBlur}>
                  <MenuItem value="">Not specified</MenuItem>
                  {budgetRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="notes"
                  label="Notes (optional)"
                  multiline
                  minRows={3}
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.notes && errors.notes)}
                  helperText={(touched.notes && errors.notes) || `${values.notes.length} / 2000`}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
