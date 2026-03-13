# LIBRARY LAYER

## OVERVIEW

`lib/` holds shared runtime logic.
The main domains are seed normalization (`data/`), persistence (`storage/`), and internationalization (`i18n/`), with small helpers for class merging, IDs, and local profiles.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| seed normalization | `data/` | imports JSON from `docs/requirements/예시자료/` |
| browser persistence | `storage/` | child AGENTS covers detailed rules |
| locale/runtime text | `i18n/` | child AGENTS covers detailed rules |
| class merging | `cn.ts` | shared by landing, layout, and design system |
| local profile helpers | `profile/localProfile.ts` | wrapper around storage entities |
| local IDs | `ids/local.ts` | `LOCAL-*` identifiers |

## CONVENTIONS

- Keep UI-free logic here. Route rendering and visual composition belong outside `lib/`.
- Normalize source data in `data/` before it feeds storage or UI.
- Prefer existing layer boundaries instead of creating new one-off utility folders.
- Use `@/` imports consistently; the repo relies on the root alias from `tsconfig.json`.
- If a `lib/` change alters contracts, mirror it in the relevant docs under `docs/common/` or `docs/i18n-guide.md`.

## ANTI-PATTERNS

- Do not import raw requirement JSON directly from route files or visual components.
- Do not bypass `storage/` or `i18n/` conventions with ad hoc browser APIs.
- Do not put page-specific copy or layout concerns into shared runtime helpers.

## NOTES

- Consult `lib/storage/AGENTS.md` before editing persistence logic.
- Consult `lib/i18n/AGENTS.md` before editing locale, dictionary, or metadata logic.
