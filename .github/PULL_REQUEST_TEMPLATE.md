## What and why

<!-- One or two sentences. Link the issue if there is one: Closes #… -->

## How to test

<!-- Steps a reviewer can follow. Say what you could NOT test (e.g. real Supabase). -->

## Checklist (spec §16.3)

- [ ] No unapproved libraries; no Next.js, React Hook Form, Tailwind or own backend
- [ ] `npm run lint` and `npm run build` pass
- [ ] Checked on mobile and desktop (360 / 768 / 1440 px)
- [ ] Data changes: RLS and ownership checked with two accounts
- [ ] New environment variables are documented in `.env.example`
- [ ] No secrets, personal photos or passwords in the repo
- [ ] Docs updated if behaviour changed
