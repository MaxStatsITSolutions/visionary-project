# VISIONARY — rules for Claude Code (and any AI assistant)

Read `docs/VISIONARY_PROJECT_DOCUMENTATION_v4.md` first. If anything here conflicts
with the mentor's email or that document, the mentor and the document win.

## Strict stack

- React + TypeScript (strict) + Vite
- Material UI (one theme in `src/theme/`), Emotion only as MUI's peer dependency
- Formik for every form, validated with Formik's built-in `validate` (no Yup)
- Supabase: Postgres, Auth (magic link) and **private** Storage, via `@supabase/supabase-js`
- Redux Toolkit for shared state (`navigation`, `auth`, …), local state/hooks otherwise

Allowed exceptions: Three.js / React Three Fiber for 3D; an external AI image API
**only after mentor approval** and only behind a safe server-side proxy.

## Never introduce

- Next.js, App Router, Pages Router, API routes, SSR
- Tailwind, GSAP, Motion, Lenis, React Router, Yup, React Hook Form
- Express / Nest / any own backend server, Firebase, Prisma, Stripe
- **Any new dependency without mentor approval.** `package.json` changes need a team decision.

## Secrets

- Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` may be in `VITE_*` (they are public).
- Never put a `service_role` key, database password or AI key in the repo or in `VITE_*`.
- `.env.local` is git-ignored. Keep it that way.

## Security

- Row Level Security is the real protection, not hidden buttons. Every table with user data has RLS.
- Photos live in the private `room-uploads` bucket under `<user_id>/<project_id>/…` and are shown with short-lived signed URLs.
- After any change to data access, run the two-account RLS check in `docs/SUPABASE_SETUP.md`.

## Workflow

1. Read the spec and inspect the actual code before proposing changes.
2. Work on a feature branch (`feature/…`, `fix/…`, `docs/…`, `chore/…`), never directly on `main`.
3. Keep changes small and reviewable; one topic per pull request.
4. Before pushing: `npm run lint` and `npm run build` must pass (CI runs the same).
5. Check the UI at 360 / 768 / 1440 px, keyboard focus, and with reduced motion.
6. Report test results honestly; say what was not tested (e.g. real Supabase calls).
7. Never push to `main`, merge, or run destructive database changes without explicit approval.

## Where things are

| Path | What |
|---|---|
| `src/screens/` | Whole screens (Home, Auth, Studio, Projects, …) |
| `src/features/<name>/` | Feature logic: Redux slices, Supabase services, feature components |
| `src/components/` | Shared UI (layout, drawing sheet, gallery, common states) |
| `src/content/` | Editable content: styles, revisions/notes, room geometry |
| `src/theme/` | Design tokens and the MUI theme |
| `src/motion/` | Animation engine, reduced-motion preference and toggle |
| `supabase/migrations/` | SQL migrations (run in the Supabase SQL editor) |
| `docs/` | Spec, Supabase setup, design system, team workflow |
