import type { ReactNode } from 'react';
import { Button } from '@mui/material';
import { getSupabaseClient } from '../../../lib/supabase';
import { useAppSelector } from '../../../store/hooks';
import { EmptyState, LoadingState } from '../../../components/common/StateViews';
import type { Navigate } from '../../../types/navigation';

/**
 * Shows the right message before any project data is requested:
 * Supabase not configured, sign-in still loading, or signed out.
 * The real protection is RLS in the database; this is only UX.
 */
export function ProjectsGate({ children, onNavigate }: { children: ReactNode; onNavigate: Navigate }) {
  const { status } = useAppSelector((state) => state.auth);

  if (!getSupabaseClient()) {
    return (
      <EmptyState
        title="Projects need Supabase"
        description="This copy of the site runs in demo mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local and restart npm run dev."
      />
    );
  }
  if (status === 'loading') return <LoadingState label="Checking sign-in" />;
  if (status === 'signedOut') {
    return (
      <EmptyState
        title="Sign in to see your projects"
        description="Your projects and photos are private. Sign in with your email to open them."
        action={
          <Button variant="contained" onClick={() => onNavigate('auth')}>
            Sign in
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
}
