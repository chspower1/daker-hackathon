# WORKSTREAMS DOMAIN

## LOCAL STRUCTURE

```text
├── parallel-overview.md   # 공통 병렬 계약
├── camp.md               # 캠프 트랙
├── hackathon.md          # 해커톤 트랙
└── ranking.md            # 랭킹 트랙
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 트랙 시작 규칙 | `parallel-overview.md` | 공통 계약의 출발점 |
| 트랙별 범위 | `workstreams/*.md` | 각 트랙의 소유/비소유를 정의 |
| 공유 계약 의존성 | `common/data-and-state.md`, `common/product-and-scope.md` | 키, 모델, 공개/비공개 규칙 |
| 병행 QA 기준 | `common/acceptance.md` | 화면별 상태 처리 기준 |

## LOCAL CONVENTIONS

- 워크스트림 문서는 공통 템플릿을 유지한다.
  - `1. 목표/담당 범위`
  - `2. 최소 읽기 문서`
  - `3. 고정 입력/계약`
  - `4. 직접 수정 가능한 파일/모듈 후보`
  - `5. 다른 트랙과 맞닿는 인터페이스`
  - `6. 이 트랙이 의존하지 않는 항목(Non-dependency)`
  - `7. 독립 완료 기준`
  - `8. 로컬 QA 시나리오`
- ownership boundary는 문서 상단에서 명확히 고정한다. 예: 해커톤 트랙은 상세 제출/랭킹 집계의 소유를 제외하고 팀 목록/링크 연동만 다룬다.
- real-path accuracy는 필수다. 라우트 계약 표기는 개념 경로(`GET /hackathons`)를 유지하되, 코드 확인은 `app/(app)/`로 한다.
- shared 계약 변경은 workstream 단독 수정으로 끝내지 않는다. 변경은 아래 순서대로 진행한다.
  1. `common` 문서 업데이트
  2. 영향 받는 `workstreams/*.md` 업데이트
  3. 관련 `features/*.md` 링크/범위 동기화
  4. 구조 변경이면 `docs/index.md`, `docs/planning.md` 갱신 여부 확인

## LOCAL ANTI-PATTERNS

- 트랙 문서가 다른 트랙의 내부 구현 규칙(예: 제출 검증 정합성, 랭킹 정렬 정책)까지 소유한다고 작성하지 않는다.
- 작업 경계와 의존성 표기가 모호하게 겹치게 쓰지 않는다.
- `workstream -> feature` 링크를 빼먹고 독립 실행을 유도하지 않는다.

## LOCAL VERIFY NOTES

- 트랙 범위 변경 시, `parallel-overview.md`의 인터페이스 변화가 반영되었는지 확인한다.
- 라우트 경로가 문서 경로와 코드 경로 사이에서 혼동될 수 있으므로 `app/(app)/` 기준으로 빠른 spot-check를 1회 수행한다.
- `docs/common/acceptance.md`의 핵심 상태(로딩/데이터 없음/에러) 규칙을 각 워크스트림 완료 기준에서 다시 점검한다.
