# 작업 패킷: 랭킹

## 1. 목표/담당 범위

- `/rankings` 화면을 독립적으로 구현한다.
- 요구사항: 공개 닉네임 기반의 글로벌 순위 표준 렌더링을 완성한다.
- 팀/해커톤 상세 구현 세부사항은 읽을 뿐 작성하지 않는다.

## 2. 최소 읽기 문서

1. `docs/workstreams/parallel-overview.md`
2. `docs/common/data-and-state.md`
3. `docs/features/rankings.md`
4. 필요 시 `docs/common/acceptance.md`

## 3. 고정 입력/계약

- 라우트: `/rankings`
- 데이터 읽기: `localStorage.rankings`
- 초기 시드 책임: `localStorage.rankings`가 비어 있을 때 사용할 공개 랭킹 시드 정의와 초기값 정렬 기준은 랭킹 트랙이 소유한다.
- 표시 규칙: 공개 닉네임(`nickname`) 기준, `localProfile`과 자동 동기화 금지
- 화면 상태: 로딩/데이터 없음/에러
- 모델: `UserRankingEntry` 기반 렌더링

## 4. 직접 수정 가능한 파일/모듈 후보

- `app/rankings/page.tsx`
- `components/rankings/*`
- `lib/data/*` (랭킹 시드 정의가 필요할 때)
- `lib/ranking/*`
- `lib/storage/*`
- `types/*`
- `components/shared/*` (상태 컴포넌트)

## 5. 다른 트랙과 맞닿는 인터페이스

- 해커톤 상세 리더보드와 직접 의존하지 않는다.
- 캠프 작성/필터는 본 트랙에서 소비하지 않는다.
- `localStorage.rankings`는 외부 트랙에서 초기값을 넣더라도 본 화면은 렌더링만 보장한다.

## 6. 이 트랙이 의존하지 않는 항목(Non-dependency)

- 해커톤 상세의 제출 항목 구성(`submissionItems`)
- 캠프 생성 폼 유효성 검증 로직
- 채팅/쪽지 같은 캠프 옵션 기능

## 7. 독립 완료 기준

- `rank`, `nickname`, `points` 열이 화면에 노출된다.
- `localStorage.rankings`를 기반으로 정렬 결과가 렌더링된다.
- `loading/error/empty` 상태가 모두 사용자에게 표시된다.
- 내부 계정 값이 닉네임으로 노출되지 않는다.

## 8. 로컬 QA 시나리오

- 도구: `pnpm dev`, 브라우저(또는 Playwright)
- 단계
  1. `/rankings` 접속 후 기본 표를 확인한다.
  2. 브라우저에서 `localStorage.rankings` 값을 확인해 항목을 변경한다.
  3. 화면을 새로고침하고 변경값 반영을 확인한다.
  4. `localProfile`을 삭제/생성한 뒤 랭킹 화면이 자동 갱신되지 않음을 확인한다.
- 기대 결과
  - 렌더링은 `rankings` 단일 출처를 따른다.
  - 로컬 프로필 변경은 화면 표시를 직접 바꾸지 않는다.
  - 상태 메시지가 분기별로 정확하게 보인다.
