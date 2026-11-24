import type { SupabaseClient } from '@supabase/supabase-js';
import type { StudioFormValues } from './types';

// Функция, която StudioScreen вика при "Запази".
export type StudioSaveHandler = (
  values: StudioFormValues,
  photo: File | null,
) => Promise<void>;

const BUCKET = 'room-uploads';

// Разширението се взима от типа на файла, а не от името му.
const extensionByType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function saveStudioProject(
  client: SupabaseClient,
  userId: string,
  values: StudioFormValues,
  photo: File | null,
): Promise<{ id: string }> {
  const projectId = crypto.randomUUID();
  let photoPath: string | null = null;

  // 1) Качваме снимката (ако има) в private bucket: <user_id>/<project_id>/<random>.<ext>
  if (photo) {
    const extension = extensionByType[photo.type];
    if (!extension) throw new Error('Unsupported photo type');

    photoPath = `${userId}/${projectId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage
      .from(BUCKET)
      .upload(photoPath, photo, { contentType: photo.type });
    if (uploadError) throw uploadError;
  }

  // 2) Записваме реда в таблица projects.
  const { error: insertError } = await client.from('projects').insert({
    id: projectId,
    user_id: userId,
    title: values.title.trim(),
    room_type: values.roomType,
    interior_style: values.interiorStyle,
    budget_range: values.budgetRange || null,
    notes: values.notes.trim() || null,
    photo_path: photoPath,
  });

  // 3) Ако записът в базата се провали, трием качената снимка, за да не остане "сираче".
  if (insertError) {
    if (photoPath) {
      try {
        await client.storage.from(BUCKET).remove([photoPath]);
      } catch {
        // почистването е с най-добро усилие; основната грешка е по-важна
      }
    }
    throw insertError;
  }

  return { id: projectId };
}