# 작업 패킷: 캠프

## 1. 목표/담당 범위

- `/camp` 화면 전체를 독립적으로 구현/보완한다.
- 필수 동작: 캠프 목록 조회, `hackathon` 필터 처리, 모집글 작성, 프로필 검사 게이트.
- 대상 기능은 팀 목록 렌더링과 작성 저장의 안정성이다.

## 2. 최소 읽기 문서

1. `docs/workstreams/parallel-overview.md`
2. `docs/common/data-and-state.md`
3. `docs/features/camp.md`
4. 필요 시 `docs/common/acceptance.md`

## 3. 고정 입력/계약

- 라우트: `GET /camp`
- 쿼리: `hackathon` (optional)
- 데이터 모델: `TeamPost`
- 읽기 기준: `localStorage.teams`
- 쓰기 기준: 작성 시 `TeamPost` 항목 내 `ownerProfileId`, `ownerNicknameSnapshot` 보관
- 공개/비공개 노출: 개인 식별자 제외, 공개 필드만 표시

## 4. 직접 수정 가능한 파일/모듈 후보

- `app/camp/page.tsx`
- `components/camp/*`
- `components/shared/*` (로딩/빈/에러 패턴)
- `lib/storage/*`
- `lib/mapping/*` (TeamPost 정합/필터)
- `lib/profile/*`
- `types/*`

기존 경로는 `docs/common/implementation-architecture.md`의 구조를 따라야 한다.

## 5. 다른 트랙과 맞닿는 인터페이스

- 해커톤 상세 화면에서 들어오는 링크: `/hackathons/[slug] -> /camp?hackathon={slug}`
- `/camp`는 자신이 만든 팀 데이터에 대해 상세 화면에서 소비 가능한 `hackathonSlug` 필드를 유지한다.
- 상세 화면은 캠프의 내부 폼/유효성 규칙을 알 필요가 없다.

## 6. 이 트랙이 의존하지 않는 항목(Non-dependency)

- 해커톤 상세의 8개 섹션 상세 렌더링 내용
- 상세 제출 저장/제출 플로우
- 랭킹 정렬, 기간 필터, 포인트 정책
- `/hackathons` 목록 페이징/정렬 최적화 방식

## 7. 독립 완료 기준

- 목록: 전체/해커톤 필터 모두 렌더링한다.
- 쿼리: `hackathon`가 유효하면 해당 slug만 보여준다.
- 작성: 프로필이 없으면 생성/확인 절차를 열고, 있으면 작성 저장이 가능하다.
- 저장: 새 글은 `localStorage`에 반영되고 새로고침 후에도 유지된다.
- 표시: `ownerNicknameSnapshot` 또는 공개 스냅샷 기준으로 공개 이름을 노출한다.

## 8. 로컬 QA 시나리오

- 도구: `pnpm dev`, 브라우저(또는 Playwright)
- 기준 slug: `docs/requirements/예시자료/public_hackathons.json`의 첫 번째 항목 `slug`
- 단계
  1. `/camp` 진입 후 기본 목록이 보이는지 확인한다.
  2. URL에 `?hackathon=<slug>`를 붙여 기준 slug 팀만 필터링되는지 확인한다.
  3. 프로필이 없는 상태로 작성 시도 후 경고/생성 안내가 뜨는지 확인한다.
  4. 프로필 생성 후 작성 저장하고 새로고침한다.
- 기대 결과
  - 필터와 목록이 항상 동기화된다.
  - 저장 직후 목록에 새 글이 즉시 반영되고 새로고침 후 사라지지 않는다.
  - 공개 화면에 내부 식별자나 비공개 값이 노출되지 않는다.
