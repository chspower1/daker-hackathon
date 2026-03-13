# DESIGN SYSTEM

## OVERVIEW

`components/design-system/` provides shared UI building blocks.
`primitives/` contains leaf controls and display units; `patterns/` composes them into reusable page-level states and scaffolds.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| leaf controls | `primitives/` | buttons, inputs, cards, table pieces, skeletons |
| reusable states | `patterns/` | `PageHeader`, `EmptyState`, `LoadingState`, `ErrorState`, etc. |
| token source | `app/globals.css` | semantic colors, radius, shadows, motion |
| typical consumers | `app/(app)/*.tsx`, `components/landing/LandingPage.tsx` | routes use patterns, landing uses some primitives |

## CONVENTIONS

- Use `cn()` for class merging when components accept `className`.
- Keep primitives generic and reusable. They should not know about route data, storage, or business workflows.
- Many primitives use `forwardRef` plus `displayName`; preserve that pattern when extending existing components.
- Prefer shared patterns for loading, empty, error, and page-header states instead of reinventing them in route files.
- Use semantic token classes from `app/globals.css` instead of hardcoded palette values when an existing token already fits.
- Keep default copy minimal and overridable by props so pages can inject locale-aware text.

## ANTI-PATTERNS

- Do not add persistence, data fetching, or route ownership logic to primitives.
- Do not bypass existing state patterns with one-off loading/empty/error markup in app pages without a clear reason.
- Do not hardcode raw color values when a semantic token exists.
- Do not make component APIs route-specific if the same behavior can stay generic.

## VERIFY

- Run `pnpm build` and `pnpm lint` after API or typing changes.
- Check at least one app page that consumes the touched pattern or primitive.
- If a change affects shared copy or accessibility behavior, verify the page still works with locale-provided labels.
