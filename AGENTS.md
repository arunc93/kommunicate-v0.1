# AGENTS.md — Kommunicate

The product brief is the spec. The repo is a rough draft and has mistakes. If the code and the brief disagree, change the code to match the brief. Do not preserve a wrong status list, data layer, font, or extra screen just because it is already committed.

Hard rule: do not commit, push, open a PR, or tag. The user reviews the diff and pushes. An agent never sends work to the remote by itself.

Brief: [Kommunicate app](https://docs.google.com/document/d/11FgXLUEEI3sEha4B4CxtBr5i0-JgJfJtejBJyw8kLzM/edit)

- Product brief — scope, users, stack, screens, do-nots
- UI screenshots — visual reference for the in-scope screens only
- KPMG brand guidelines — design system (palette page + Scribd link)

Repo today: [arunc93/kommunicate-v0.1](https://github.com/arunc93/kommunicate-v0.1). Treat it as a starting point, not a source of truth.

## Product

Internal tool for KGS Consulting communication work.

Users:

- Stakeholder — raise a request, see own requests, comment
- Comms — designer, writer, or PM; work the shared queue
- Lead — assign owner and role, set priority, read volume and utilisation

A stakeholder can:

- Raise a request: type, brief, due date, attachments, requester details
- See only their own tickets

The comms team and leads can:

- See the shared queue and open a request
- Assign owner / role (`pm` | `writer` | `designer`) and set priority (`low` | `normal` | `high`)
- Move status: `new` → `in_review` → `in_progress` → `waiting_on_stakeholder` → `done` | `rejected`
- Comment, with a full activity trail
- Filter and search by status, owner, type, date, requester
- Read metrics: requests per month, status mix, utilisation by person / role

Do not add states. Do not invent a second workflow.

## Stack

From the brief, not from the draft:

- Next.js App Router, TypeScript `strict`, Tailwind CSS
- Supabase Auth: email + password, org users only
- Supabase Postgres and Storage. No second backend
- Forms: React Hook Form + Zod. Validate in the client and again in the server action

The draft uses Prisma + SQLite, fake login, and API routes. That is a mistake relative to the brief. New work goes to Supabase. Do not add Prisma models, seed rows, or SQLite features.

Package manager: npm, because `package-lock.json` is already in the repo. Do not add a second lockfile.

Env, never commit real values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Org allowlist is not in the brief — do not guess a domain. Block open sign-up until it is specified.

## Screens

Only these. Brief filenames map to routes:

| Brief file | Route | Who |
| --- | --- | --- |
| `login.tsx` | `/login` | public |
| `dashboard.tsx` | `/dashboard` | comms, lead. Queue + snapshot metrics |
| `new-request.tsx` | `/requests/new` | stakeholder, lead |
| `request-detail.tsx` | `/requests/[id]` | status, assignment, comments, activity |
| `my-requests.tsx` | `/my-requests` | stakeholder's own tickets |
| `metrics.tsx` | `/metrics` | lead |

The draft also has Templates, Delivery calendar, Release calendar, Add hours, Gallery, SOPs, and Team. Those came from the screenshot tab. The brief says do not add extra screens or extra features. Do not build them out. Do not link them in nav. When a task touches navigation or information architecture, remove them rather than polish them.

Nav for a signed-in user: Dashboard, New request, My requests, Metrics. Hide items the role cannot use.

Login matches the screenshot, restyled to the tokens below: gradient field, white card, “Welcome to Kommunicate”, “KGS Consulting”, one Login button. No marketing page. No self-serve signup UI.

## Design system

Material structure. KPMG color. Not the draft's Inter-on-`#0a192f` theme, and not default Material purple `#6750A4`.

Material means: 8px grid, 8px radius, elevation, filled / outlined / text buttons, text fields, cards, status chips. It does not mean the Material default palette.

Color comes from the brand-tab page “Color palette proportion use” (KPMG brand guidelines, page 44). Screenshot compression shifts hex by a few units. KPMG Blue matches the published `#00338D`. Cobalt on that page samples as `#1E49E2`, not the older Medium Blue `#005EB8`. Pink was not readable on the brand page; the value below is the chip in the UI screenshot. Confirm accents before treating them as final.

```ts
// src/theme/tokens.ts — source of truth. Map these in Tailwind. No ad-hoc hex in components.
export const colors = {
  kpmgBlue: "#00338D",
  cobalt: "#1E49E2",
  lightBlue: "#ABECFF",
  pacific: "#00B8F6",
  navy: "#0D253E",
  sidebar: "#082038",
  purple: "#790DDA",
  pink: "#F83098",
  white: "#FFFFFF",
  surface: "#F7F8FA",
  border: "#E1E7F1",
  text: "#0D253E",
  textMuted: "#506078",
  success: "#1B7F4E",
  error: "#B00020",
} as const;

export const statusColor = {
  new: colors.cobalt,
  in_review: colors.purple,
  in_progress: colors.pink,
  waiting_on_stakeholder: colors.pacific,
  done: colors.success,
  rejected: colors.error,
} as const;

export const font = {
  family: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  h1: { size: "24px", weight: 600, lineHeight: "32px" },
  h2: { size: "20px", weight: 600, lineHeight: "28px" },
  body: { size: "14px", weight: 400, lineHeight: "20px" },
  caption: { size: "12px", weight: 400, lineHeight: "16px" },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 4, md: 8, lg: 12 } as const;
export const shadow = {
  elevation1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
} as const;
```

Rules:

- KPMG Blue and white dominate. Cobalt for primary buttons and metric cards. Purple and pink are accents (status, login gradient), not page backgrounds.
- Sidebar `#082038`, white labels. Content is white cards on `#F7F8FA`.
- Drop Inter. Arial until a licensed KPMG webfont is provided. Do not load a proprietary font file you do not have.
- Do not copy the Scribd brand book into the repo.
- No generic AI look: no glassmorphism, no emoji icons, no stock illustrations, no “Welcome to your dashboard”.

The create-request screenshot shows fields beyond the brief (category, project number, created on behalf of, message, creative suggestion, audience, team, sender, geo). Use the brief's fields unless the user confirms the screenshot list: type, brief, due date, attachments, requester details.

## Data

Supabase tables:

- `profiles` — id, email, full_name, role (`stakeholder` | `comms` | `lead`), comms_role (`pm` | `writer` | `designer` | null)
- `requests` — id, number, requester_id, type, brief, due_date, priority, status, owner_id, created_at
- `comments` — request_id, author_id, body, created_at
- `activity` — request_id, actor_id, event, from_value, to_value, created_at
- Storage bucket `request-attachments`, path `{request_id}/{filename}`

RLS: a stakeholder reads and writes their own requests; comms reads the queue and assigned work; a lead reads all. Never put the service-role key in the browser.

Generate types with `supabase gen types typescript` into `src/types/database.ts` when the schema changes. Do not hand-write table types that drift.

## How to typecheck

From the repo root, after any type, server-action, or generated-type change:

```bash
npx tsc --noEmit
```

`tsconfig.json` must keep `"strict": true` and `"noEmit": true`. Add this script if it is missing, and use it after that:

```json
"typecheck": "tsc --noEmit"
```

Before handing work back:

```bash
npm run lint
npx tsc --noEmit
```

`npm run build` when routes, layouts, or env usage changed. Do not treat `next build` as a substitute for `tsc`. Do not silence errors with `any`.

## Git

The user is in the loop. Agents do not publish.

- Do not commit. Do not `git commit`, `git commit -a`, or commit via a tool. Leave the working tree dirty.
- Do not push. Do not `git push`, `git push -u`, or push to `master` or any other branch.
- Do not open a PR, tag, amend, rebase, reset, or force-push.
- Do not commit `.env`, `.env.local`, service-role keys, `dev.db`, `node_modules`, the KPMG brand PDF, or a Scribd export.
- When the task is done, stop. List the changed files, the typecheck result, and what to review. Wait.
- "Ship it", "looks good", or "done" is not permission to commit or push. Commit only after the user has reviewed and explicitly says to commit. Even then, do not push. The user pushes.

## Do not

- Treat the draft's Prisma schema, status strings, Inter font, or extra routes as the design system.
- Add screens or features the brief does not name.
- Add shadcn's default theme or MUI's default purple. Small components in `src/components/ui` are fine if they use the tokens.
- Mock auth once Supabase env is present. A stub is allowed only behind a missing-env guard, and the UI must say so.

## Layout to converge on

```
src/
  app/
    (auth)/login/page.tsx
    (app)/layout.tsx
    (app)/dashboard/page.tsx
    (app)/requests/new/page.tsx
    (app)/requests/[id]/page.tsx
    (app)/my-requests/page.tsx
    (app)/metrics/page.tsx
  components/ui/
  features/{auth,requests,metrics}/
  lib/supabase/{client,server}.ts
  theme/tokens.ts
  types/database.ts
```

Draft paths such as `/dashboard/track-request` and `src/app/page.tsx` as login are mistakes. Move toward the routes above when editing navigation. Do not rename files in an unrelated task.

## Ask before inventing

1. Org email domain(s), and whether sign-up is invite-only.
2. Supabase project ref, if one already exists.
3. Confirmed hex for pink, purple, and Pacific Blue from the brand book rather than a screenshot sample.
4. Licensed font files, if Arial is not acceptable.
5. Who may change status and priority: lead only, or assignee too.
6. Attachment types and size cap.
7. Whether the create-request screenshot fields replace the shorter brief field list.
