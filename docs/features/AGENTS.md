# FEATURES DOMAIN

## LOCAL STRUCTURE

```text
├── home.md               # 홈 라우트 상세
├── hackathons-list.md    # 해커톤 목록
├── hackathon-detail.md   # 해커톤 상세
├── camp.md               # 캠프(팀 모집) 화면
└── rankings.md           # 랭킹 화면
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| feature entrypoint | `features/*.md` | keep each file aligned with its owning work packet |
| parallel entrypoint | `workstreams/<track>.md` | mandatory link target from feature docs |
| shared contracts | `docs/common/data-and-state.md`, `docs/common/product-and-scope.md` | use these as canonical contracts |
| acceptance checks | `docs/common/acceptance.md` | verify against feature requirements |

## LOCAL CONVENTIONS

- 템플릿은 반복 패턴을 유지하되, 문서 성격에 맞는 섹션만 사용한다.
  - 대부분의 feature 문서는 `0. 병렬 작업 시작점`에서 `workstreams/<track>.md`를 단일 진입점으로 명시한다.
  - 공통 축인 `1. 라우트`, `2. 목적`, 완료 기준, 연계 규칙은 가능한 한 일관된 위치와 이름으로 유지한다.
- `workstream-link discipline`은 단방향으로 깨지지 않게 유지한다.
  - feature는 자신이 속한 workstream를 링크한다.
  - workstream는 feature 계약을 링크한다.
- shared 계약 참조를 문서 본문에서 반복 작성하지 않는다. 변경이 필요하면 공통 문서를 먼저 갱신하고 링크는 그대로 유지한다.
- 라우트는 설명용 경로와 구현 파일 경로가 달라질 수 있으므로, 코드 위치는 `app/(app)/...` 기준으로 교차 확인한다.

## LOCAL ANTI-PATTERNS

- feature 문서에서 공통 계약(`localStorage` 키, 프로필 규칙, 공개/비공개 규칙)을 임시로 재정의하지 않는다.
- `workstreams` 링크 없이 새 기능 문서를 추가하지 않는다.
- 동일 동작을 여러 feature 문서에 중복으로 풀어 쓰지 않는다.
- 라우트 경로를 기능 명세에서 실제 파일 경로와 다르게 둔 채로 오래 방치하지 않는다.

## LOCAL VERIFY NOTES

- 새로운 feature 문서를 추가/수정할 때는 해당 workstream 계약과 `docs/common/*`를 함께 확인한다.
- 계약 변경은 `features/*.md`와 `workstreams/*.md` 양쪽 링크/표현이 맞는지 1회 점검한다.
- feature 관련 코드나 계약을 함께 수정했다면 `pnpm build`와 `pnpm lint`를 같이 실행한다.
