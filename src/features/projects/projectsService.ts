import { getSupabaseClient } from '../../lib/supabase';

// Every function here throws an Error with a message that is safe to show to the user.
// Access control is enforced by Row Level Security in Supabase (spec §11), not here:
// these queries simply return nothing for projects that belong to someone else.

const BUCKET = 'room-uploads';
/** Signed photo links expire after 10 minutes (spec §12.4: short-lived URLs). */
const SIGNED_URL_SECONDS = 600;

export type Project = {
  id: string;
  title: string;
  room_type: string;
  interior_style: string;
  budget_range: string | null;
  notes: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
};

/** Fields a user may edit after creating a project. */
export type ProjectEdit = Pick<Project, 'title' | 'budget_range' | 'notes'>;

const COLUMNS = 'id,title,room_type,interior_style,budget_range,notes,photo_path,created_at,updated_at';

type ServiceError = { message?: string; code?: string; status?: number; statusCode?: string | number };

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured. Fill in .env.local and restart npm run dev.');
  return supabase;
}

function friendlyMessage(error: ServiceError, fallback: string): string {
  // The raw error stays in the console for developers.
  console.error('Projects:', error);
  const message = (error.message ?? '').toLowerCase();
  const status = String(error.statusCode ?? error.status ?? '');
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network problem. Check your internet connection and try again.';
  }
  if (error.code === '42501' || status === '401' || status === '403' || message.includes('jwt')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (error.code === '23514') return 'Some project details are not valid. Please check the name and notes.';
  return fallback;
}

/** The signed-in user's projects, newest first. */
export async function listMyProjects(): Promise<Project[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.from('projects').select(COLUMNS).order('created_at', { ascending: false });
  if (error) throw new Error(friendlyMessage(error, 'We could not load your projects. Please try again.'));
  return (data ?? []) as Project[];
}

/** One project, or null when it does not exist or is not yours (RLS hides it). */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = requireClient();
  const { data, error } = await supabase.from('projects').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw new Error(friendlyMessage(error, 'We could not load this project. Please try again.'));
  return (data as Project | null) ?? null;
}

/** A short-lived link to a private photo; null when the photo cannot be reached. */
export async function getPhotoUrl(path: string): Promise<string | null> {
  const supabase = requireClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
  if (error || !data?.signedUrl) {
    console.error('Projects: signed URL failed', error);
    return null;
  }
  return data.signedUrl;
}

export async function updateProject(id: string, changes: ProjectEdit): Promise<Project> {
  const supabase = requireClient();
  // updated_at is set by the database trigger (migration 001).
  const { data, error } = await supabase.from('projects').update(changes).eq('id', id).select(COLUMNS).single();
  if (error) throw new Error(friendlyMessage(error, 'We could not save your changes. Please try again.'));
  return data as Project;
}

/**
 * Deletes the photo first, then the row (spec §12.4). If the photo cannot be
 * removed we stop, so the project is never left pointing at nothing and no
 * private photo is left behind without a project.
 */
export async function deleteProject(project: Pick<Project, 'id' | 'photo_path'>): Promise<void> {
  const supabase = requireClient();
  if (project.photo_path) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([project.photo_path]);
    if (storageError) {
      throw new Error(friendlyMessage(storageError, 'We could not delete the photo, so the project was kept. Please try again.'));
    }
  }
  const { error } = await supabase.from('projects').delete().eq('id', project.id);
  if (error) {
    throw new Error(
      friendlyMessage(
        error,
        project.photo_path
          ? 'The photo was deleted, but the project could not be. Please try again.'
          : 'We could not delete this project. Please try again.',
      ),
    );
  }
}
