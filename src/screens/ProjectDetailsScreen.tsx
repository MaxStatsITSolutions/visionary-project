import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import type { Navigate } from '../types/navigation';
import { colors, fonts, layout } from '../theme/tokens';
import { deleteProject, getProject, type Project } from '../features/projects/projectsService';
import { ProjectsGate } from '../features/projects/components/ProjectsGate';
import { ProjectPhoto } from '../features/projects/components/ProjectPhoto';
import { EditProjectDialog } from '../features/projects/components/EditProjectDialog';
import { formatDate } from '../features/projects/format';
import { EmptyState, ErrorState, LoadingState } from '../components/common/StateViews';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'missing' }
  | { status: 'ready'; project: Project };

const cell = {
  px: 1.5,
  py: 1.1,
  borderBottom: `1px solid ${colors.ink}`,
  fontFamily: fonts.mono,
  fontSize: '0.74rem',
  letterSpacing: '0.05em',
  lineHeight: 1.45,
} as const;

function Details({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProject(projectId)
      .then((project) => !cancelled && setState(project ? { status: 'ready', project } : { status: 'missing' }))
      .catch((err: unknown) => !cancelled && setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' }));
    return () => {
      cancelled = true;
    };
  }, [projectId, attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  if (state.status === 'loading') return <LoadingState label="Loading project" />;
  if (state.status === 'error') return <ErrorState title="This project did not load" description={state.message} onRetry={retry} />;
  if (state.status === 'missing') {
    return (
      <EmptyState
        title="Project not found"
        description="It may have been deleted, or it belongs to another account."
        action={
          <Button variant="outlined" color="inherit" onClick={() => onNavigate('projects')}>
            Back to my projects
          </Button>
        }
      />
    );
  }

  const { project } = state;
  const rows: [string, string][] = [
    ['Room', project.room_type],
    ['Direction', project.interior_style],
    ['Budget', project.budget_range ?? 'Not specified'],
    ['Photo', project.photo_path ? 'Private upload' : 'No photo'],
    ['Created', formatDate(project.created_at)],
    ['Updated', formatDate(project.updated_at)],
  ];

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteProject(project);
      onNavigate('projects');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'We could not delete this project.');
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 7fr) minmax(0, 5fr)' }, alignItems: 'start' }}>
      <ProjectPhoto path={project.photo_path} alt={`Photo of ${project.title}`} eager />

      <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>
        <Typography variant="h2" component="h1" sx={{ m: 0, overflowWrap: 'anywhere' }}>
          {project.title}
        </Typography>

        {savedNotice && (
          <Alert severity="success" role="status" onClose={() => setSavedNotice(false)}>
            Changes saved.
          </Alert>
        )}

        <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', border: `1px solid ${colors.ink}`, bgcolor: colors.canvas }}>
          {rows.map(([k, v], i) => (
            <Box key={k} sx={{ display: 'contents' }}>
              <Box component="dt" sx={{ ...cell, textTransform: 'uppercase', opacity: 0.6, borderRight: `1px solid ${colors.ink}`, ...(i === rows.length - 1 && { borderBottom: 0 }) }}>
                {k}
              </Box>
              <Box component="dd" sx={{ ...cell, m: 0, ...(i === rows.length - 1 && { borderBottom: 0 }) }}>
                {v}
              </Box>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography variant="overline" color="text.secondary">
            Notes
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{project.notes || 'No notes yet.'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </Box>
      </Box>

      <EditProjectDialog
        key={project.updated_at}
        project={project}
        open={editing}
        onClose={() => setEditing(false)}
        onSaved={(updated) => {
          setState({ status: 'ready', project: updated });
          setEditing(false);
          setSavedNotice(true);
        }}
      />

      <Dialog open={confirmDelete} onClose={() => !deleting && setConfirmDelete(false)} aria-labelledby="delete-title">
        <DialogTitle id="delete-title">Delete “{project.title}”?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The project{project.photo_path ? ' and its photo' : ''} will be removed permanently. This cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" role="alert" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmDelete(false)} disabled={deleting}>
            Keep it
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** One project sheet: photo, details, edit and delete. */
export function ProjectDetailsScreen({ projectId, onNavigate }: { projectId: string | null; onNavigate: Navigate }) {
  return (
    <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` }, display: 'grid', gap: 3 }}>
      <Box sx={{ borderBottom: `1px solid ${colors.ink}`, pb: 1.5 }}>
        <Button variant="text" color="inherit" onClick={() => onNavigate('projects')} sx={{ px: 0 }}>
          ← My projects
        </Button>
      </Box>
      <ProjectsGate onNavigate={onNavigate}>
        {projectId ? (
          <Details key={projectId} projectId={projectId} onNavigate={onNavigate} />
        ) : (
          <EmptyState title="No project selected" description="Open a project from your list." />
        )}
      </ProjectsGate>
    </Box>
  );
}
