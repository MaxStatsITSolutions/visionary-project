# Team workflow

How the three of us split the work and keep `main` stable. Details on commands are in
`CONTRIBUTING.md`; the product rules are in `docs/VISIONARY_PROJECT_DOCUMENTATION_v4.md`.

## Areas (roles, not silos — everyone reviews everything)

| Area | Main files |
|---|---|
| Design system, homepage, motion, app shell and navigation | `src/theme/`, `src/components/`, `src/motion/`, `src/screens/home/`, `src/App.tsx` |
| Studio wizard (Formik) | `src/features/studio/`, `src/screens/StudioScreen.tsx` |
| Supabase: auth, database, storage, RLS, CI | `src/features/auth/`, `supabase/migrations/`, `.github/workflows/` |
| My projects (list, sheet, edit, delete) | `src/features/projects/`, `src/screens/Project*.tsx` |

Shared files (`src/App.tsx`, `src/store/index.ts`, `package.json`) change only in small,
announced pull requests, because every branch touches them.

## Milestones (spec §18)

| | Milestone | State |
|---|---|---|
| M1 | Scaffold + CI | done |
| M2–M3 | Design system, homepage, before/after | in review (PR #8) |
| M4 | Explore gallery | not started |
| M5 | Studio wizard | in review (PR #3, also inside #8) |
| M6 | Supabase Auth + RLS schema | done; two-account check pending |
| M7 | My projects CRUD + private storage | in review (PR #9) |
| M8 | 3D polish | optional |
| M9 | QA, docs, deployment, demo | docs in progress; hosting needs a mentor decision |

## Rules of thumb

- Pull requests go **into `main`**. Check the direction before creating one.
- Merge only with green CI and one review.
- Stacked work (a branch built on another open branch) targets that branch first and
  is re-targeted to `main` after the first one merges.
- Open questions for the mentor: GSAP, React Router, hosting and who owns production keys.
