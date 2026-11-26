# Contributing to VISIONARY

## Run it locally (Windows)

You need [Node.js](https://nodejs.org) 22.12 or newer (LTS) and [Git for Windows](https://git-scm.com).

```powershell
git clone https://github.com/MaxStatsITSolutions/visionary-project.git
cd visionary-project
npm install
npm run dev
```

Open http://localhost:5173. Without `.env.local` the site runs in demo mode;
to connect Supabase see `docs/SUPABASE_SETUP.md`.

| Command | What it does |
|---|---|
| `npm run dev` | Local site that reloads on every change |
| `npm run lint` | Code checks (oxlint) |
| `npm run build` | Type check (`tsc -b`) + production build. Same as CI |
| `npm run preview` | Serve the production build locally |

## Branches

- `main`: stable. Only reviewed pull requests are merged into it.
- `feature/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>` for work.
- One task → one branch → one pull request.

```powershell
git checkout main
git pull
git checkout -b feature/my-topic
# …work…
git add -A
git commit -m "feat: short description of the change"
git push -u origin feature/my-topic
```

Then open a pull request **into `main`** on GitHub. Check the direction:
*base* is `main`, *compare* is your branch.

Keep your branch up to date while you work:

```powershell
git fetch origin
git merge origin/main
```

## Commit messages

Short, in English, starting with a type: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
Example: `feat: add delete confirmation to project sheet`.

## Pull requests

- CI (lint + type check + build) must be green. A red cross means: do not merge.
- At least one teammate reviews before merging.
- Fill in the checklist from the PR template.
- Do not merge your own PR without a review, and do not merge PRs that change
  dependencies without a team decision.

## Rules from the spec

- Allowed stack only (see `CLAUDE.md`). No new dependencies without the mentor's approval.
- Forms use Formik with built-in `validate`. UI uses the MUI theme.
- No secrets in the repo or in `VITE_*` variables.
- Data access changes need the two-account RLS check (`docs/SUPABASE_SETUP.md`).
