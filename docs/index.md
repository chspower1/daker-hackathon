# Daker Hackathon 문서 허브

## 1. 문서 목적

이 문서는 요구사항 원본을 유지하면서 실행 가능한 구현 설계로 분할한 구조화 허브다. 공통 규칙과 기능 설계를 분리해 팀이 같은 기준으로 움직이도록 만든다.

## 2. 문서 구성

- 원본 자료: [`docs/requirements/`](requirements/)
- 병렬 작업 진입점
  - [`docs/workstreams/parallel-overview.md`](workstreams/parallel-overview.md)
  - [`docs/workstreams/camp.md`](workstreams/camp.md)
  - [`docs/workstreams/hackathon.md`](workstreams/hackathon.md)
  - [`docs/workstreams/ranking.md`](workstreams/ranking.md)
- 공통 설계
  - [`docs/common/product-and-scope.md`](common/product-and-scope.md)
  - [`docs/common/data-and-state.md`](common/data-and-state.md)
  - [`docs/common/implementation-architecture.md`](common/implementation-architecture.md)
  - [`docs/common/acceptance.md`](common/acceptance.md)
  - [`docs/i18n-guide.md`](i18n-guide.md)
- 기능 상세
  - [`docs/features/home.md`](features/home.md)
  - [`docs/features/hackathons-list.md`](features/hackathons-list.md)
  - [`docs/features/hackathon-detail.md`](features/hackathon-detail.md)
  - [`docs/features/camp.md`](features/camp.md)
  - [`docs/features/rankings.md`](features/rankings.md)
- 실행 및 제출
  - [`docs/planning.md`](planning.md)
  - [`docs/submission.md`](submission.md)

## 3. 추천 읽기 순서

### 병렬 작업이 목적일 때

1. [`docs/workstreams/parallel-overview.md`](workstreams/parallel-overview.md)
2. 본인 트랙: [`docs/workstreams/camp.md`](workstreams/camp.md) 또는 [`docs/workstreams/hackathon.md`](workstreams/hackathon.md) 또는 [`docs/workstreams/ranking.md`](workstreams/ranking.md)
3. 최소 공통: [`docs/common/product-and-scope.md`](common/product-and-scope.md), [`docs/common/data-and-state.md`](common/data-and-state.md)
4. 본인 화면 구현 상세: 해당 [`docs/features/*.md`](features/)
5. 필요 시 [`docs/common/acceptance.md`](common/acceptance.md)

### 일반 구현 순서

1. [`docs/common/product-and-scope.md`](common/product-and-scope.md)
2. [`docs/common/data-and-state.md`](common/data-and-state.md)
3. 필요한 화면의 [`docs/features/*.md`](features/)
4. [`docs/common/implementation-architecture.md`](common/implementation-architecture.md)
5. [`docs/i18n-guide.md`](i18n-guide.md)
6. [`docs/common/acceptance.md`](common/acceptance.md)
7. [`docs/planning.md`](planning.md)
8. [`docs/submission.md`](submission.md)

## 4. 빠른 연결

- 기능 구현이 어떻게 이어지는지: [`docs/common/acceptance.md`](common/acceptance.md)의 기능군별 수용 기준
- 병렬 작업 진입: `캠프`는 [`docs/workstreams/camp.md`](workstreams/camp.md), `해커톤`은 [`docs/workstreams/hackathon.md`](workstreams/hackathon.md), `랭킹`은 [`docs/workstreams/ranking.md`](workstreams/ranking.md)
- 팀 모집과 상세 화면 연동: 인터페이스는 [`docs/workstreams/parallel-overview.md`](workstreams/parallel-overview.md)의 링크 계약
- 다국어 구조와 신규 기능 반영 규칙: [`docs/i18n-guide.md`](i18n-guide.md)
- 제출 전 점검: [`docs/submission.md`](submission.md)
