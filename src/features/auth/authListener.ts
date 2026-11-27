import { getSupabaseClient } from '../../lib/supabase';
import type { AppDispatch } from '../../store';
import { signedIn, signedOut } from './authSlice';

// Keeps Redux in sync with Supabase Auth. Call it ONCE, when the app starts.
export function startAuthListener(dispatch: AppDispatch) {
  const supabase = getSupabaseClient();

  // No .env.local values: there is no Supabase, so nobody can be signed in.
  if (!supabase) {
    dispatch(signedOut());
    return;
  }

  // Supabase calls this right away with the saved session (INITIAL_SESSION),
  // and again on every SIGNED_IN, SIGNED_OUT and TOKEN_REFRESHED.
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      dispatch(signedIn({ id: session.user.id, email: session.user.email ?? null }));
    } else {
      dispatch(signedOut());
    }
  });
}