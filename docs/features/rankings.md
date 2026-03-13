# 기능 상세: 랭킹

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

- 랭킹 저장/표시 규칙의 단일 출처는 `docs/common/data-and-state.md`다.
- 이 화면은 공개 표시용 `nickname`을 사용하며, 로컬 프로필과 자동 동기화하지 않는다.

## 5. 옵션 기능

- 기간 필터(`최근 7일`, `30일`, `전체`)

## 6. 완료 기준

- 랭킹 테이블 렌더링
- `로딩중`, `데이터 없음`, `에러` 처리
- 공개 기준으로 점수 노출

## 7. 연계 규칙

- 데이터 모델: `docs/common/data-and-state.md`
- 수용 기준: `docs/common/acceptance.md`
- 구현 구조: `docs/common/implementation-architecture.md`
