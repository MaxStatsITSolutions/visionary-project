import { useState } from 'react';
import { Form, Formik } from 'formik';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { sendMagicLink, signOut } from '../features/auth/authService';
import { useAppSelector } from '../store/hooks';

type EmailFormValues = { email: string };

// Simple format check. Supabase does the real check when it sends the email.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: EmailFormValues) {
  const errors: Partial<Record<keyof EmailFormValues, string>> = {};
  const email = values.email.trim();
  if (!email) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'This does not look like an email address.';
  }
  return errors;
}

export default function AuthScreen() {
  const { status, user } = useAppSelector((state) => state.auth);
  // The address we sent a link to. null = show the form.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut(); // the auth listener sets Redux to signedOut
      setSentTo(null);
    } catch (err) {
      setSignOutError(err instanceof Error ? err.message : 'Could not sign out.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Box component="section" aria-labelledby="auth-title" sx={{ maxWidth: 480, mx: 'auto', px: 2, py: { xs: 4, sm: 8 } }}>
      <Typography id="auth-title" variant="h4" component="h1" gutterBottom>
        Sign in
      </Typography>

      {/* 1. We don't know yet if someone is signed in */}
      {status === 'loading' && <CircularProgress aria-label="Checking sign-in status" />}

      {/* 2. Signed in */}
      {status === 'signedIn' && user && (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Signed in as <strong>{user.email}</strong>
          </Alert>
          {signOutError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {signOutError}
            </Alert>
          )}
          <Button variant="outlined" onClick={handleSignOut} disabled={signingOut} sx={{ minHeight: 44 }}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </Stack>
      )}

      {/* 3. Signed out, link already sent */}
      {status === 'signedOut' && sentTo && (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Alert severity="info" role="status" sx={{ width: '100%' }}>
            We sent a sign-in link to <strong>{sentTo}</strong>. Open it in this browser to continue.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            No email after a few minutes? Check your spam folder.
          </Typography>
          <Button onClick={() => setSentTo(null)} sx={{ minHeight: 44 }}>
            Use a different email
          </Button>
        </Stack>
      )}

      {/* 4. Signed out, show the form */}
      {status === 'signedOut' && !sentTo && (
        <>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your email and we will send you a sign-in link. New here? The same link creates your account.
          </Typography>
          <Formik<EmailFormValues>
            initialValues={{ email: '' }}
            validate={validate}
            onSubmit={async (values, helpers) => {
              helpers.setStatus(null);
              const email = values.email.trim();
              try {
                await sendMagicLink(email);
                setSentTo(email);
              } catch (err) {
                helpers.setStatus(err instanceof Error ? err.message : 'Something went wrong.');
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status: submitError }) => (
              <Form noValidate>
                <Stack spacing={2}>
                  {submitError && (
                    <Alert severity="error" role="alert">
                      {submitError}
                    </Alert>
                  )}
                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    autoComplete="email"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ minHeight: 44 }}>
                    {isSubmitting ? 'Sending…' : 'Send sign-in link'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Box>
  );
}