# DOCS DOMAIN

## OVERVIEW

`docs/` is the contributor-facing source of truth.
It defines scope, data/state contracts, architecture, feature behavior, parallel work boundaries, and submission expectations.

## STRUCTURE

```text
docs/
 ├── common/         # shared contracts and architecture
 ├── features/       # route-level behavior and acceptance detail
 ├── workstreams/    # parallel ownership and interface contracts
 ├── requirements/   # source assets and seed JSON
 ├── i18n-guide.md   # translation and metadata rules
 ├── index.md        # document hub
 └── planning.md     # execution entrypoint
```

참고: 반복 템플릿 규칙은 `features/AGENTS.md`와 `workstreams/AGENTS.md`를 먼저 보고, 앱 라우트 구현은 실제로 `app/(app)/`에 있다는 점을 기준으로 문서 경로를 교차 확인합니다.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| scope and exclusions | `common/product-and-scope.md` | authoritative feature boundary |
| data/state contracts | `common/data-and-state.md` | `localStorage` keys, models, visibility rules |
| architecture | `common/implementation-architecture.md` | layer roles and app structure |
| acceptance | `common/acceptance.md` | cross-feature validation checklist |
| parallel ownership | `workstreams/parallel-overview.md`, `workstreams/*.md` | route and interface contracts |
| feature detail | `features/*.md` | route-level expected behavior |
| translation rules | `i18n-guide.md` | dictionary-first and metadata rules |
| source assets | `requirements/예시자료/`, `requirements/*.png` | raw requirements and seed inputs |

## CONVENTIONS

- Treat `common/` as normative. If code and docs disagree, either align code or update the canonical docs first.
- Keep prose Korean-first unless a code identifier, route, enum, or data key must remain exact.
- When document structure changes, update both `docs/index.md` and `docs/planning.md` so entry paths stay current.
- When route contracts, query params, public interfaces, or `localStorage` rules change, update `common/`, the affected `workstreams/*.md`, and the relevant `features/*.md` together.
- `docs/development-spec.md` is a transition pointer. Do not move the canonical body back into that file.

## ANTI-PATTERNS

- Do not edit only a workstream file when the shared contract changed.
- Do not invent behavior that conflicts with `common/data-and-state.md` or `common/product-and-scope.md`.
- Do not duplicate long specs across multiple files when one document is already the source of truth.
- Do not drop raw requirement assets without reflecting their impact in the derived docs if they change behavior.

## VERIFY

- Re-read `docs/index.md` after structural edits.
- Re-check `common/acceptance.md` and the touched `features/*.md` after behavior edits.
- If a doc change alters code-facing contracts, make sure the matching code paths in `app/`, `lib/storage/`, or `lib/i18n/` still line up.
