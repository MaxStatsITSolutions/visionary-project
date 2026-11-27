import { getSupabaseClient } from '../../lib/supabase';
import type { StudioFormValues } from './types';

// Every function here throws an Error with a message that is safe to show to the user.

const BUCKET = 'room-uploads';

// The extension comes from the file type, not from the file name.
const extensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Only the fields we read from Supabase storage and database errors.
type ServiceError = {
  message?: string;
  code?: string;
  status?: number;
  statusCode?: string | number;
};

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Fill in .env.local and restart npm run dev.');
  }
  return supabase;
}

function friendlyMessage(error: ServiceError): string {
  // The raw error stays in the console for developers, never shown to users.
  console.error('Studio save failed:', error);

  const message = (error.message ?? '').toLowerCase();
  const status = String(error.statusCode ?? error.status ?? '');

  if (message.includes('fetch') || message.includes('network')) {
    return 'Network problem. Check your internet connection and try again.';
  }
  if (status === '413' || message.includes('too large') || message.includes('maximum allowed size')) {
    return 'The photo is too large. Please choose a file up to 10 MB.';
  }
  if (message.includes('mime type')) {
    return 'This photo format is not supported. Please use JPEG, PNG or WebP.';
  }
  if (message.includes('bucket not found')) {
    return 'Photo storage is not available right now. Please try again later.';
  }
  if (
    error.code === '42501' ||
    status === '401' ||
    status === '403' ||
    message.includes('row-level security') ||
    message.includes('jwt')
  ) {
    return 'You do not have permission to save this project. Please sign in again.';
  }
  if (error.code === '23514') {
    return 'Some project details are not valid. Please check the project name and try again.';
  }
  return 'We could not save your project. Please try again.';
}

export async function saveStudioProject(
  userId: string,
  values: StudioFormValues,
  photo: File | null,
): Promise<{ id: string }> {
  const supabase = requireClient();
  const projectId = crypto.randomUUID();
  let photoPath: string | null = null;

  // 1) Upload the photo (if any) to the private bucket: <user_id>/<project_id>/<random>.<ext>
  if (photo) {
    const extension = extensionByType[photo.type];
    if (!extension) {
      throw new Error('This photo format is not supported. Please use JPEG, PNG or WebP.');
    }

    photoPath = `${userId}/${projectId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(photoPath, photo, { contentType: photo.type });
    if (uploadError) throw new Error(friendlyMessage(uploadError));
  }

  // 2) Insert the row into the projects table.
  const { error: insertError } = await supabase.from('projects').insert({
    id: projectId,
    user_id: userId,
    title: values.title.trim(),
    room_type: values.roomType,
    interior_style: values.interiorStyle,
    budget_range: values.budgetRange || null,
    notes: values.notes.trim() || null,
    photo_path: photoPath,
  });

  // 3) If the database insert fails, remove the uploaded photo so it is not left orphaned.
  if (insertError) {
    if (photoPath) {
      try {
        await supabase.storage.from(BUCKET).remove([photoPath]);
      } catch {
        // Cleanup is best effort; the main error matters more.
      }
    }
    throw new Error(friendlyMessage(insertError));
  }

  return { id: projectId };
}