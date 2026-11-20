import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { runConnectionCheck } from '../features/connectionCheck/connectionCheckSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const STACK = ['React', 'TypeScript', 'Vite', 'Material UI', 'Redux Toolkit', 'Supabase'];

// Temporary developer screen: proves the frontend, Redux and Supabase are wired together.
export default function ConnectionCheckScreen() {
  const dispatch = useAppDispatch();
  const { status, results, checkedAt } = useAppSelector((state) => state.connectionCheck);
  const running = status === 'running';
  const allOk = results.length > 0 && results.every((r) => r.ok);

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Typography variant="overline" color="text.secondary">
        VISIONARY · developer check
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom>
        Connection check
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Sends real requests from this page to Supabase and shows what came back.
      </Typography>

      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {STACK.map((name) => (
          <Chip key={name} label={name} variant="outlined" size="small" />
        ))}
      </Stack>

      <Button
        variant="contained"
        size="large"
        onClick={() => dispatch(runConnectionCheck())}
        disabled={running}
        startIcon={running ? <CircularProgress size={18} color="inherit" /> : undefined}
        sx={{ minHeight: 44 }}
      >
        {running ? 'Checking…' : 'Run connection check'}
      </Button>

      {/* aria-live makes screen readers announce the results when they appear */}
      <Box aria-live="polite" sx={{ mt: 4 }}>
        {status === 'done' && (
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              {allOk ? 'Everything is connected' : 'Something needs attention'}
            </Typography>
            {results.map((r) => (
              <Card key={r.name} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <Chip label={r.ok ? 'OK' : 'Failed'} color={r.ok ? 'success' : 'error'} size="small" />
                    <Typography sx={{ fontWeight: 600 }}>{r.name}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {r.detail}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {checkedAt && (
              <Typography variant="caption" color="text.secondary">
                Checked at {new Date(checkedAt).toLocaleTimeString()}
              </Typography>
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
}
