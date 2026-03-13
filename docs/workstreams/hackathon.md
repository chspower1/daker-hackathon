# 작업 패킷: 해커톤

## 1. 목표/담당 범위

- 해커톤 목록(`/hackathons`)과 상세(`/hackathons/[slug]`) 화면 구현을 담당한다.
- 핵심 목표: 8개 필수 섹션 렌더링, Teams/Submit/Leaderboard 진입 책임, 라우트 연결 품질 확보.
- 본 트랙은 랭킹 정렬이나 캠프 폼 검증 구현을 소유하지 않는다.

## 2. 최소 읽기 문서

1. `docs/workstreams/parallel-overview.md`
2. `docs/common/data-and-state.md`
3. `docs/features/hackathons-list.md`
4. `docs/features/hackathon-detail.md`
5. 필요 시 `docs/common/acceptance.md`

## 3. 고정 입력/계약

- 라우트: `/hackathons`, `/hackathons/[slug]`
- slug: `public_hackathons`의 `slug` 단일 키와 일치
- Teams 섹션 읽기 기준: `localStorage.teams`를 단일 출처로 사용하며, 값은 공개 시드 팀 목록과 로컬 생성 모집글의 병합 결과다.
- Teams 섹션 모델: `TeamPost`
- 팀 연동: Teams 섹션의 Camp 링크는 `/camp?hackathon={slug}`
- 제출 저장/제출: `localStorage.submissions`, `localStorage.leaderboards`
- 공개 데이터: 상세는 `public_hackathons`, `public_hackathon_detail`, `public_teams`, `public_leaderboard`

## 4. 직접 수정 가능한 파일/모듈 후보

- `app/hackathons/page.tsx`
- `app/hackathons/[slug]/page.tsx`
- `components/hackathons/*`
- `lib/data/*` (시드 로드/정규화)
- `lib/mapping/*` (해커톤 모델 변환)
- `lib/leaderboard/*`
- `lib/storage/*`
- `lib/profile/*` (제출 저장 전 가드)
- `lib/ranking/*`는 본 트랙 비의존(조회만 필요하면 점검)

## 5. 다른 트랙과 맞닿는 인터페이스

- 상세 Teams 섹션 CTA: `/camp?hackathon={slug}` 고정 계약
- 제출/저장 동작은 `localProfile` 존재 전제를 공유한다.
- 리더보드 표시는 공개 데이터 원칙을 따른다.

## 6. 이 트랙이 의존하지 않는 항목(Non-dependency)

- 캠프 화면의 작성 폼 유효성 규칙(필수 입력/선택 입력 구성)
- 랭킹 화면의 컬럼 정책, 정렬 정책, 기간 필터
- 캠프 리스트 UI 컴포넌트 내부 구현

## 7. 독립 완료 기준

- 목록: 시드 해커톤이 누락 없이 노출되고 `/hackathons/{slug}` 이동이 된다.
- 상세: 8개 섹션이 표시되며 섹션 누락 데이터는 빈 상태 메시지로 처리한다.
- 팀 연동: Teams CTA가 항상 slug 기반 `/camp?hackathon={slug}`로 이동한다.
- 제출: 팀명/아티팩트/노트 저장 후 `localStorage`에 반영되고 최종 제출이 `submissions`/`leaderboards`에 반영된다.
- 실패 처리: slug 미일치일 때 에러/Not Found로 안전히 전환한다.

## 8. 로컬 QA 시나리오

- 도구: `pnpm dev`, 브라우저(또는 Playwright)
- 기준 slug: `docs/requirements/예시자료/public_hackathons.json`의 첫 번째 항목 `slug`
- 단계
  1. `/hackathons`에서 기준 slug 카드 클릭으로 상세 페이지 이동한다.
  2. 존재하지 않는 slug로 직접 접근해 안전 종료를 확인한다.
  3. 상세의 Teams CTA를 눌러 `/camp?hackathon=<slug>` 이동을 확인한다.
  4. 제출 저장/제출을 반복해 `draft`와 `submitted` 상태가 유지되는지 확인한다.
  5. Overview, Info/Notice, Eval, Schedule, Prize, Teams, Submit, Leaderboard 섹션 제목 또는 동등한 UI 구획이 모두 보이는지 확인한다.
  6. Leaderboard와 public field 노출만 보이는지 확인한다.
- 기대 결과
  - 목록과 상세는 서로 독립 화면이지만 동일 slug로 연결된다.
  - 상세 8개 섹션의 필수 렌더링이 실패 없이 처리된다.
  - 다른 트랙 구현이 없어도 화면 플로우는 동작을 멈추지 않는다.
