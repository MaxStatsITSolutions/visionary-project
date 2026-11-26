-- Private bucket for room photos (spec §12.4) and its access rules (§12.5).
-- The bucket was first created in the dashboard. This file describes it in Git
-- and is safe to run again: it fixes the settings instead of failing.

begin;

-- 1. The bucket: private, max 10 MB, images only
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'room-uploads',
  'room-uploads',
  false,
  10485760,                                        -- 10 MB in bytes
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Policies: every user can only touch files in their own folder <user_id>/...
drop policy if exists "users_upload_own_folder" on storage.objects;
create policy "users_upload_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "users_read_own_folder" on storage.objects;
create policy "users_read_own_folder" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "users_remove_own_folder" on storage.objects;
create policy "users_remove_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'room-uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- No UPDATE policy on purpose: photos are never overwritten (no upsert in the MVP).

commit;