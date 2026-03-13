# 기능 상세: 랭킹

## 0. 병렬 작업 시작점

- 랭킹 트랙 독립 실행 진입점은 [`docs/workstreams/ranking.md`](../workstreams/ranking.md)다.
- 최소 고정 계약은 [`docs/workstreams/parallel-overview.md`](../workstreams/parallel-overview.md)와 `data-and-state`를 따른다.

## 1. 라우트

`/rankings`

## 2. 목적

해커톤 전체에서의 공개 닉네임 기반 글로벌 순위를 제공한다.

## 3. 핵심 UI

- 테이블 형태 표시
- 최소 컬럼
  - `rank`
  - `nickname`
  - `points`

## 4. 데이터 규칙

- `rankings` 렌더링은 `localStorage.rankings`를 읽기 전용으로 사용한다.
- 단일 출처 룰은 `docs/common/data-and-state.md`다.
- 이 화면은 공개 표시용 `nickname`을 사용하며, 로컬 프로필과 자동 동기화하지 않는다.

## 5. 옵션 기능

- 기간 필터(`최근 7일`, `30일`, `전체`)

## 6. 완료 기준

- 랭킹 테이블 렌더링
- `로딩중`, `데이터 없음`, `에러` 처리
- 공개 기준으로 점수 노출

## 7. 로컬 QA 시나리오

- 도구: `pnpm dev`, 브라우저 또는 Playwright
- 단계
  1. `/rankings` 진입 후 3개 기본 열 표시 확인
  2. `localStorage.rankings`를 변경해 렌더링 반응 확인
  3. 동일 조건에서 빈 배열/에러 상태를 반복 확인
  4. `localProfile`을 삭제/생성해도 닉네임 컬럼이 자동 변경되지 않음 확인
- 기대 결과
  - 변경된 `localStorage.rankings`가 즉시 반영됨
  - 공개 닉네임 규칙이 일관되게 적용됨
  - 상태 처리 분기별로 사용자 메시지가 표시됨

## 8. 연계 규칙

- 데이터 모델: `docs/common/data-and-state.md`
- 수용 기준: `docs/common/acceptance.md`
- 구현 구조: `docs/common/implementation-architecture.md`
- 병렬 진입 규칙: `docs/workstreams/parallel-overview.md`
