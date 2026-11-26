import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSupabaseClient } from '../../lib/supabase';

export type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

type ConnectionCheckState = {
  status: 'idle' | 'running' | 'done';
  results: CheckResult[];
  checkedAt: string | null;
};

const initialState: ConnectionCheckState = {
  status: 'idle',
  results: [],
  checkedAt: null,
};

// Turns a Postgres/PostgREST error code into a sentence a person can act on.
function explainDbError(code: string | undefined, message: string): string {
  if (code === 'PGRST205' || code === '42P01') {
    return 'Table "projects" was not found. Run supabase/migrations/001_projects.sql in the SQL Editor.';
  }
  if (code === '42501') {
    return 'Permission denied for table "projects". The anon role has no access to it (check the table grants).';
  }
  return `${code ?? 'error'}: ${message}`;
}

// An async thunk: Redux dispatches 'pending', runs this function,
// then dispatches 'fulfilled' with whatever it returns.
export const runConnectionCheck = createAsyncThunk(
  'connectionCheck/run',
  async (): Promise<CheckResult[]> => {
    const results: CheckResult[] = [];
    const supabase = getSupabaseClient();

    // 1. Are the environment variables loaded into the app?
    if (!supabase) {
      results.push({
        name: 'Environment variables',
        ok: false,
        detail: 'VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. Fill in .env.local and restart npm run dev.',
      });
      return results;
    }
    results.push({
      name: 'Environment variables',
      ok: true,
      detail: `Connected to ${new URL(import.meta.env.VITE_SUPABASE_URL).host}`,
    });

    // 2. A real network request to Postgres through the Supabase API.
    // head: true asks only for the row count, not the rows themselves.
    const started = performance.now();
    try {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      const ms = Math.round(performance.now() - started);

      if (error) {
        results.push({ name: 'Database (Postgres)', ok: false, detail: explainDbError(error.code, error.message) });
      } else {
        results.push({
          name: 'Database (Postgres)',
          ok: true,
          detail: `Table "projects" answered in ${ms} ms.`,
        });
        // Logged out, we are the "anon" role. RLS has no policy for anon,
        // so the correct answer is 0 rows even if the table holds data.
        results.push({
          name: 'Row Level Security',
          ok: count === 0,
          detail:
            count === 0
              ? 'A logged-out visitor sees 0 projects, so RLS is protecting the table.'
              : `A logged-out visitor can see ${count} project(s)! Check the RLS policies.`,
        });
      }
    } catch (err) {
      results.push({
        name: 'Database (Postgres)',
        ok: false,
        detail: `Network error: ${err instanceof Error ? err.message : String(err)}. Check the URL in .env.local.`,
      });
    }

    // 3. Supabase Auth: is anyone signed in on this browser?
    const { data, error: authError } = await supabase.auth.getSession();
    results.push({
      name: 'Authentication',
      ok: !authError,
      detail: authError
        ? authError.message
        : data.session
          ? `Signed in as ${data.session.user.email}`
          : 'Auth client ready. No one is signed in (the login screen comes next).',
    });

    return results;
  },
);

const connectionCheckSlice = createSlice({
  name: 'connectionCheck',
  initialState,
  reducers: {},
  // extraReducers react to actions created outside this slice, here by the thunk.
  extraReducers: (builder) => {
    builder
      .addCase(runConnectionCheck.pending, (state) => {
        state.status = 'running';
      })
      .addCase(runConnectionCheck.fulfilled, (state, action) => {
        state.status = 'done';
        state.results = action.payload;
        state.checkedAt = new Date().toISOString();
      })
      .addCase(runConnectionCheck.rejected, (state, action) => {
        state.status = 'done';
        state.results = [{ name: 'Unexpected error', ok: false, detail: action.error.message ?? 'Unknown error' }];
        state.checkedAt = new Date().toISOString();
      });
  },
});

export default connectionCheckSlice.reducer;
