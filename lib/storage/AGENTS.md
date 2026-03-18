# STORAGE LAYER

## OVERVIEW

`lib/storage/` is the `localStorage` boundary.
It owns key definitions, safe JSON handling, runtime validation, recovery, bootstrap initialization, and per-entity read/write helpers.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| storage keys | `keys.ts` | canonical `localProfile`, `hackathons`, `teams`, `submissions`, `leaderboards`, `rankings` |
| read/write core | `client.ts` | `writeValue`, `readWithRecovery` |
| safe JSON | `json.ts` | parse/stringify wrappers |
| validation helpers | `validation.ts` | runtime guards |
| bootstrap | `bootstrap.ts` | seeds read-only app data on shell mount |
| entity codecs | `entities/*.ts` | `getSeed` + `isValid` + read/write pairing |

## CONVENTIONS

- Add or change keys only through `storageKeys` in `keys.ts`.
- Read through `readWithRecovery()` and write through `writeValue()` or entity wrappers. Keep browser-availability and parse-failure handling centralized.
- Each entity module should keep seed generation, runtime validation, and read/write behavior together.
- Respect special cases such as `persistSeedOnMissing: false` where the entity intentionally avoids auto-persisting a seed.
- If storage shape changes, update `docs/system-structure.md` and `docs/core-features.md` in the same change.

## ANTI-PATTERNS

- Do not call `window.localStorage` directly from app routes or components when an entity helper exists.
- Do not skip runtime validation after parsing persisted data.
- Do not add a new persisted key without updating docs and bootstrap expectations.
- Do not move recovery rules into UI code.

## VERIFY

- Run `pnpm build` and `pnpm lint` after storage changes.
- Manually verify the affected key behavior against `docs/core-features.md` and `docs/user-flows.md`.
- For bootstrap-related changes, check `components/layout/SharedAppShell.tsx` call sites and app startup behavior.
