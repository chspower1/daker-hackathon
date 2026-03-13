# 개발 명세 이동 안내

## 1. 변경 안내

이전의 단일 대형 명세(`development-spec.md`)는 공통/기능 문서 구조로 이전되었으며, 내용 중복을 제거했다.

자세한 설계는 아래 문서에서 유지한다.

- [`docs/common/product-and-scope.md`](common/product-and-scope.md)
- [`docs/common/data-and-state.md`](common/data-and-state.md)
- [`docs/common/implementation-architecture.md`](common/implementation-architecture.md)
- [`docs/common/acceptance.md`](common/acceptance.md)
- [`docs/features/home.md`](features/home.md)
- [`docs/features/hackathons-list.md`](features/hackathons-list.md)
- [`docs/features/hackathon-detail.md`](features/hackathon-detail.md)
- [`docs/features/camp.md`](features/camp.md)
- [`docs/features/rankings.md`](features/rankings.md)

## 2. 매핑

- 문서 목적, 범위, 라우트: [`docs/common/product-and-scope.md`](common/product-and-scope.md)
- 데이터 모델, localStorage, 상태 규칙: [`docs/common/data-and-state.md`](common/data-and-state.md)
- 아키텍처/구조 제약: [`docs/common/implementation-architecture.md`](common/implementation-architecture.md)
- 완료 기준: [`docs/common/acceptance.md`](common/acceptance.md)
- 화면별 세부 명세: 각 [`docs/features/*.md`](features/)

## 3. 상태

이 파일은 기존 대형 설계의 중복 본문을 보존하지 않으며, 위 문서들이 최신 단일 출처다.
