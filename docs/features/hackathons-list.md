# 기능 상세: 해커톤 목록

## 1. 라우트

`/hackathons`

## 2. 목적

공개 해커톤 목록을 탐색할 수 있게 하는 화면이다.

## 3. 데이터 원본

- 필수: `docs/requirements/예시자료/public_hackathons.json`
- 필요 시 상세/리더보드 연동은 상세 화면과 링크로 이어짐

## 4. 필수 표시 항목

- 제목
- 상태(`upcoming`, `ongoing`, `ended`)
- 태그
- 일정 정보
- 참가자 수(데이터가 있는 경우만)

## 5. 필수 동작

- 카드 클릭 시 `/hackathons/{slug}` 이동
- `로딩중`, `데이터 없음`, `에러` 상태 처리

## 6. 옵션 동작

- 상태/태그 필터
- 정렬 정책은 추가 구현 시 공개 데이터 기준으로만 처리

## 7. 완료 기준

- 시드 데이터의 해커톤이 누락 없이 노출
- 각 카드에서 상세로 이동
- 해커톤 상세로 이어지는 흐름이 사용자에게 분명함

## 8. 참조 규칙

- 공통 범위: `docs/common/product-and-scope.md`
- 데이터 모델: `docs/common/data-and-state.md`
- 상세 구현은 `docs/features/hackathon-detail.md`
- 수용 기준: `docs/common/acceptance.md`
