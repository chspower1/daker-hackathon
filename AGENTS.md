# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-17T15:42:26+09:00
**Commit:** 981f89a
**Branch:** main

## OVERVIEW

Next.js App Router prototype for a hackathon platform.
Runtime behavior is docs-driven: `docs/` defines scope, data contracts, acceptance, and i18n rules; `lib/` implements shared runtime logic; `components/design-system/` provides reusable UI.

## STRUCTURE

```text
./
├── app/                     # routes, layouts, metadata entrypoints
├── components/
│   ├── design-system/       # shared primitives and state patterns
│   ├── landing/             # landing-only visuals and interactions
│   └── layout/              # shared app shell
├── lib/                     # shared runtime layers
├── types/                   # domain types and export barrel
├── docs/                    # source of truth for scope and behavior
└── public/                  # static assets
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| app entrypoints | `app/layout.tsx`, `app/page.tsx` | root locale, metadata, landing route |
| app shell | `app/(app)/layout.tsx`, `components/layout/SharedAppShell.tsx` | shared nav and storage bootstrap |
| docs contracts | `docs/service-overview.md`, `docs/system-structure.md`, `docs/core-features.md` | read before changing behavior |
| route-specific requirements | `docs/page-structure.md`, `docs/core-features.md` | routes and feature behavior |
| storage behavior | `lib/storage/` | read/write/recovery/bootstrap |
| i18n behavior | `lib/i18n/`, `docs/system-structure.md` | cookie-first locale, dictionary-first strings |
| seed data | `lib/data/`, `docs/requirements/예시자료/` | normalized JSON seeds |
| shared UI | `components/design-system/` | primitives and patterns |

## CODE MAP

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| `RootLayout` | function | `app/layout.tsx` | low | root layout, locale init, provider wiring |
| `SharedAppShell` | function | `components/layout/SharedAppShell.tsx` | 4 | app shell and storage bootstrap trigger |
| `useI18n` | function | `lib/i18n/I18nProvider.tsx` | 19 | shared locale/dictionary access |
| `readWithRecovery` | function | `lib/storage/client.ts` | 13 | storage recovery core |

## CONVENTIONS

- Read docs first for any behavior change. `docs/service-overview.md`, `docs/system-structure.md`, and `docs/core-features.md` are the current source of truth.
- Keep route files thin. `app/*` pages mostly assemble shared layout, i18n, and design-system patterns.
- Put user-facing strings in locale dictionaries, not in ad hoc content files. Add matching keys to `lib/i18n/locales/en.ts` and `lib/i18n/locales/ko.ts`.
- Use `lib/storage` for persistence. Storage keys, recovery rules, and runtime validation live there; do not invent parallel browser-storage helpers.
- Keep seed-data imports in `lib/data`. Those modules normalize JSON from `docs/requirements/예시자료/` before storage or UI consumption.
- Use semantic tokens from `app/globals.css` for shared styling. Shared UI composes `cn()` plus tokenized Tailwind classes.

Gotcha: user-facing route paths stay `/hackathons`, `/camp`, `/rankings`, but real route files are under `app/(app)/`.

## ANTI-PATTERNS (THIS PROJECT)

- Do not expose internal notes, internal identifiers, email, phone, real-name, or auth data in UI or persisted public shapes.
- Do not add out-of-scope auth, backend DB, real-time chat, or other features excluded by `docs/service-overview.md`.
- Do not change public interfaces, route contracts, or `localStorage` keys in only one place. Update the matching docs in `docs/page-structure.md`, `docs/system-structure.md`, `docs/storage-contracts.md`, and `docs/core-features.md`.
- Do not auto-sync `localProfile` changes into rankings display. Rankings read from `localStorage.rankings` only.
- Do not scatter translated copy into `content.ts`-style files or use provider-wide metadata mutation for every page.
- Do not reintroduce the removed `docs/common`, `docs/features`, or `docs/workstreams` split.

## UNIQUE STYLES

- Docs are Korean-first, while code identifiers and route/data keys stay English.
- The app uses a route group at `app/(app)` to separate landing from app-shell pages.
- Shared empty/loading/error/page-header states are centralized in `components/design-system/patterns/` and reused by app routes.
- Seed data lives under `docs/requirements/예시자료/` and is imported directly by `lib/data/*`.
- Global styling uses Tailwind v4 `@theme` tokens plus a small set of custom motion and 3D utility classes.

## COMMANDS

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## NOTES

- There is no `test` script and no CI workflow in the repo. Verification is build/lint plus manual checks against `docs/core-features.md` and `docs/user-flows.md`.
- More specific rules exist in `docs/AGENTS.md`, `lib/AGENTS.md`, `lib/storage/AGENTS.md`, `lib/i18n/AGENTS.md`, `components/design-system/AGENTS.md`, and `components/hackathons/AGENTS.md`.
