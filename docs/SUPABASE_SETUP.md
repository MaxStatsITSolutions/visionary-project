# Supabase setup

How to connect your local copy of VISIONARY to Supabase, and how to check that
users cannot see each other's data. Spec references: §10.3, §11, §12.

Without these steps the site still runs in **demo mode**: the homepage works,
and screens that need data show a "Supabase is not configured" message.

## 1. Environment file

Copy the example and fill in the two values from
Supabase Dashboard → Project Settings → API.

```powershell
Copy-Item .env.example .env.local
```

```dotenv
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable (anon) key>
```

- Restart `npm run dev` after changing `.env.local`.
- Both values end up in the browser bundle, so they are public by design.
  **Never** put the `service_role` key, the database password or any AI key here.
- `.env.local` is git-ignored. Do not commit it.

## 2. Database and storage (migrations)

Run the files in `supabase/migrations/` **in order** in Supabase Dashboard → SQL Editor,
on a development project first.

| File | Creates |
|---|---|
| `001_projects.sql` | `public.projects` table, index, `updated_at` trigger, RLS on, four "own rows only" policies |
| `002_storage.sql` | private `room-uploads` bucket (10 MB, JPEG/PNG/WebP), upload/read/delete policies limited to the user's own folder |

`001` is a first-time migration: running it twice fails because the table already exists.
`002` is safe to run again.

## 3. Auth (magic link)

Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: the production URL once the site is hosted
- **Redirect URLs**: add `http://localhost:5173` for local development, and the production URL

The sign-in email links back to the page it was requested from (`window.location.origin`),
so that address must be in the list.

## 4. Check the connection

Open the site, go to **Sign in**. Under the form, **Connection check → Run connection check**
sends real requests and shows what Supabase answered.

## 5. Two-account RLS check (required, §11.3)

Do this after every change to tables, policies or data access. You need two users,
**A** and **B** (two different emails; sign in once with each so they exist under
Authentication → Users). The "My projects" screen comes with PR #9.

**In the app**

1. **A** signs in, creates a project in **Studio** with a photo, and sees it in **My projects**.
2. **B** signs in (another browser or a private window).
   - [ ] B's **My projects** does not list A's project.

**In the database, acting as B** (Dashboard → SQL Editor → role selector at the bottom:
choose **authenticated** and **impersonate user B**). Replace `<A_PROJECT_ID>` and
`<A_USER_ID>` with A's values from Table Editor → `projects`.

```sql
-- Each of these must return 0 rows / affect 0 rows.
select * from public.projects where id = '<A_PROJECT_ID>';
update public.projects set title = 'hacked' where id = '<A_PROJECT_ID>' returning id;
delete from public.projects where id = '<A_PROJECT_ID>' returning id;
select name from storage.objects where bucket_id = 'room-uploads' and name like '<A_USER_ID>/%';
```

- [ ] All four return nothing. Then check in Table Editor that A's project still has its original title.

**Signed out** (role selector: **anon**):

```sql
select count(*) from public.projects;  -- must be 0
```

- [ ] Returns 0.

**Delete as A** (in the app):

- [ ] The project disappears from **My projects**, its row is gone from `projects`,
  and its photo is gone from Storage → `room-uploads/<A_USER_ID>/<project id>/`.

A hidden button is not protection: every check above must be refused by the database itself.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Supabase is not configured" | `.env.local` missing or still has `YOUR_PROJECT_REF`; restart `npm run dev` |
| Magic link opens a blank or wrong page | Redirect URL not added in Authentication → URL Configuration |
| "Too many emails were sent" | Supabase's email rate limit; wait a few minutes |
| Saving a project says "permission" | Signed out or session expired, or migration `001` policies missing |
| Photo upload fails | Migration `002` not run, file over 10 MB, or not JPEG/PNG/WebP |
