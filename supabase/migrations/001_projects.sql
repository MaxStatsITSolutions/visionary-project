-- 1. The table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  room_type text not null,
  interior_style text not null,
  budget_range text,
  notes text check (char_length(notes) <= 2000),
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Index: makes "my projects, newest first" fast
create index projects_user_created_idx
  on public.projects (user_id, created_at desc);

-- 3. Trigger: the database sets updated_at itself on every UPDATE
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- 4. Turn on RLS. From now on, NOTHING is allowed unless a policy allows it.
alter table public.projects enable row level security;

-- 5. Policies: one for each operation
create policy "projects_select_own" on public.projects
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "projects_insert_own" on public.projects
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "projects_update_own" on public.projects
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "projects_delete_own" on public.projects
  for delete to authenticated
  using (user_id = (select auth.uid()));