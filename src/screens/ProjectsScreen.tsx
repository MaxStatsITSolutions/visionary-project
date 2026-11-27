import { useCallback, useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Typography } from '@mui/material';
import type { Navigate } from '../types/navigation';
import { colors, layout } from '../theme/tokens';
import { useAppDispatch } from '../store/hooks';
import { openProject } from '../features/navigation/navigationSlice';
import { listMyProjects, type Project } from '../features/projects/projectsService';
import { ProjectsGate } from '../features/projects/components/ProjectsGate';
import { ProjectPhoto } from '../features/projects/components/ProjectPhoto';
import { formatDate, sheetNumber } from '../features/projects/format';
import { EmptyState, ErrorState, LoadingState } from '../components/common/StateViews';

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; projects: Project[] };

function ProjectList({ onNavigate }: { onNavigate: Navigate }) {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listMyProjects()
      .then((projects) => !cancelled && setState({ status: 'ready', projects }))
      .catch((err: unknown) => !cancelled && setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' }));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  if (state.status === 'loading') return <LoadingState label="Loading your projects" />;
  if (state.status === 'error') return <ErrorState title="Projects did not load" description={state.message} onRetry={retry} />;
  if (state.projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Start a project in the Studio: name the room, pick a direction and add a photo."
        action={
          <Button variant="contained" onClick={() => onNavigate('studio')}>
            Start a project →
          </Button>
        }
      />
    );
  }

  return (
    <Box component="ol" aria-label="My projects" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' } }}>
      {state.projects.map((p, i) => (
        <li key={p.id}>
          <ButtonBase
            onClick={() => dispatch(openProject(p.id))}
            aria-label={`Open project ${p.title}`}
            data-cursor="Open"
            sx={{
              width: '100%',
              display: 'grid',
              // ButtonBase centres its content by default; cards fill the column.
              gridTemplateColumns: 'minmax(0, 1fr)',
              justifyContent: 'stretch',
              gap: 1.5,
              textAlign: 'left',
              alignItems: 'start',
              p: 1.5,
              border: `1px solid ${colors.ink}`,
              bgcolor: colors.canvas,
              transition: 'transform 300ms var(--ease), box-shadow 300ms var(--ease)',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 40px -24px rgba(25,27,26,0.5)' },
            }}
          >
            <ProjectPhoto path={p.photo_path} alt={`Photo of ${p.title}`} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="overline" sx={{ color: colors.copperDeep }}>
                {sheetNumber(i)}
              </Typography>
              <Typography variant="overline" color="text.secondary">
                {formatDate(p.created_at)}
              </Typography>
            </Box>
            <Typography variant="h4" component="h2" sx={{ m: 0, overflowWrap: 'anywhere' }}>
              {p.title}
            </Typography>
            <Typography variant="overline" color="text.secondary">
              {p.room_type} · {p.interior_style}
            </Typography>
          </ButtonBase>
        </li>
      ))}
    </Box>
  );
}

/** "My projects": the signed-in user's register of project sheets. */
export function ProjectsScreen({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` }, display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, borderBottom: `1px solid ${colors.ink}`, pb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Register · private to you
          </Typography>
          <Typography variant="h2" component="h1" sx={{ m: 0 }}>
            My projects
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => onNavigate('studio')}>
          New project →
        </Button>
      </Box>
      <ProjectsGate onNavigate={onNavigate}>
        <ProjectList onNavigate={onNavigate} />
      </ProjectsGate>
    </Box>
  );
}
