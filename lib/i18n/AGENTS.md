# I18N LAYER

## OVERVIEW

`lib/i18n/` owns locale configuration, dictionary lookup, provider wiring, and client-side metadata sync.
Initial locale comes from the `app-locale` cookie; `localStorage` mirrors the selected locale for client convenience only.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| locale config | `config.ts` | supported locales, default locale, cookie/storage keys |
| dictionary registry | `dictionaries.ts` | locale -> dictionary mapping |
| provider wiring | `Providers.tsx`, `I18nProvider.tsx` | server/client bridge and context |
| client metadata sync | `useDocumentMetadata.ts` | page-level title/description sync |
| locale content | `locales/en.ts`, `locales/ko.ts` | keep shapes aligned |
| server entrypoint | `app/layout.tsx` | `generateMetadata()` and initial locale |

## CONVENTIONS

- Keep locale selection cookie-first. `localStorage` is a mirror, not the server truth.
- Add user-facing strings to both locale files with the same structure.
- Use `useI18n()` or `getDictionary()` instead of hardcoding copy in components.
- Keep global metadata generation in `app/layout.tsx`; use `useDocumentMetadata()` only where a client page must resync title/description after locale changes.
- If dictionary structure changes, update `docs/i18n-guide.md` in the same change.

## ANTI-PATTERNS

- Do not scatter UI copy into `content.ts`-style files.
- Do not update every page metadata field from a single global provider side effect.
- Do not add a locale key to only one language file.
- Do not treat rankings or other data-facing fields as automatically derived from locale changes unless the docs say so.

## VERIFY

- Run `pnpm build` and `pnpm lint` after i18n changes.
- Manually switch languages and verify `<html lang>`, major copy, and metadata behavior.
- Re-check `docs/i18n-guide.md` and `docs/common/acceptance.md` when behavior changes.
