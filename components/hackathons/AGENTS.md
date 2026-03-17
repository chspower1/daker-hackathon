# HACKATHONS COMPONENTS

## LOCAL STRUCTURE

```text
components/hackathons/
├── HackathonList.tsx
└── HackathonDetailContent.tsx
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 해커톤 목록 렌더링 | `HackathonList.tsx` | `readHackathons`, `listSeedHackathons`, `localStorage` 빈 상태 처리 |
| 상세/제출/리더보드 | `HackathonDetailContent.tsx` | 목록/상세 조합, 팀/제출/리더보드 쓰기 흐름 |
| 스토리지 규칙 | `lib/storage/entities/*` | read/write 래퍼를 통해 접근 |
| 시드 데이터 | `lib/data/*` | 공개 시드 보강 및 정규화 기준 |
| 프로필/폼 게이트 | `lib/profile/localProfile.ts` | 생성/검증/저장 동작 |
| 메타데이터 동기화 | `lib/i18n/useDocumentMetadata.ts` | 상세 페이지 제목/요약 동기화 |
| 기능 계약 | `docs/features/hackathon-detail.md`, `docs/workstreams/hackathon.md` | 화면 계약과 병렬 소유권 확인 |

## LOCAL CONVENTIONS

- storage/entity helpers를 항상 통해서만 읽고 쓴다.
  - 읽기: `readHackathons`, `readTeams`, `readSubmissions`, `readLeaderboards`
  - 쓰기: `writeSubmissions`, `writeLeaderboards` 같은 엔티티 함수만 사용
- seed fallback 규칙
  - 상세 화면은 `findSeedHackathonSummary`, `findSeedHackathonDetail`, `findSeedLeaderboard`, `listSeedTeamPostsByHackathon`로 공개 시드를 보강한다.
  - 목록 화면은 `readHackathons().value`가 비면 `listSeedHackathons()`로 보강한다.
- profile/submission consistency
  - 제출 저장은 `profileNicknameSnapshot`을 함께 저장한다.
  - 제출 수정은 활성 제출의 `id`를 유지하고, 없을 때만 새 로컬 제출 ID를 만든다.
  - 프로필 변경 시 기존 표시명은 과거 스냅샷으로 유지한다.
- leaderboard consistency
  - 제출 완료 시 `submissions` 갱신이 먼저 되고, 같은 `teamName` 기준으로 `leaderboards`를 업데이트한다.
  - 리더보드 저장 실패 시 제출 상태 rollback을 고려해 일관성을 유지한다.
- metadata sync
  - `useDocumentMetadata`로 페이지별 제목/설명을 동기화한다.
  - `dict`와 현재 화면 데이터 기반 조합 문자열을 사용한다.
  - 문서 제목 규칙 변경 시 라우트가 아니라 컴포넌트 레벨에서 반영한다.
- design-system boundary
  - 프리미티브와 패턴만 사용한다 (`components/design-system/*`).
  - 공통 페이지 상태(로딩/빈 상태/에러)는 패턴 컴포넌트로 통일한다.
- error handling
  - 초기 로드는 try/catch와 상태 분기로 감싸고, 화면에는 `ErrorState` 같은 복구 가능한 UI만 노출한다.

## LOCAL ANTI-PATTERNS

- `window.localStorage`를 컴포넌트에서 직접 다루지 않는다.
- 엔티티를 건너뛰고 제출/팀/리더보드를 즉시 조작하지 않는다.
- 팀/제출/리더보드 정렬 기준을 id 기반으로 바꾸지 않는다.
- `useDocumentMetadata` 없이 해커톤 상세에서 문서 제목/설명을 수동 조합해 하드코딩하지 않는다.

## LOCAL VERIFY NOTES

- `pnpm build`와 `pnpm lint`는 이 폴더 수정 후 실행한다.
- 수동 확인 항목
  - 목록: 시드 fallback + 필터 상태 + 상태 화면이 모두 동작
  - 상세: Teams/Submit/Leaderboard가 `hackathon.slug` 기준으로 일치
  - 제출: draft/submit 갱신 후 `localStorage.submissions`, `localStorage.leaderboards` 값 일관성
  - 노출: 내부 식별자나 비공개 값이 표시되지 않음
