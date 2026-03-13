# Daker Hackathon 실행 계획

## 1. 문서 목적

이 문서는 구현을 시작하기 위한 **경량 실행 가이드**다. 설계 상세는 [`docs/common/*`](common/)와 [`docs/features/*`](features/)로 이동했다.

## 2. 실행 기준

- 범위 고정: [`docs/common/product-and-scope.md`](common/product-and-scope.md)
- 데이터/상태 규칙: [`docs/common/data-and-state.md`](common/data-and-state.md)
- 구현 제약: [`docs/common/implementation-architecture.md`](common/implementation-architecture.md)
- 검수 기준: [`docs/common/acceptance.md`](common/acceptance.md)

## 3. 구현 트랙(간단)

### 트랙 1. 기반 구축

1. 라우트 골격 (`/`, `/hackathons`, `/hackathons/[slug]`, `/camp`, `/rankings`)
2. 공통 상태 유틸
3. localStorage 키 규칙 적용

### 트랙 2. 화면 구현

1. 홈 CTA 연결 ([`docs/features/home.md`](features/home.md))
2. 해커톤 목록 ([`docs/features/hackathons-list.md`](features/hackathons-list.md))
3. 상세 페이지 섹션 8개 완료 ([`docs/features/hackathon-detail.md`](features/hackathon-detail.md))
4. 캠프 ([`docs/features/camp.md`](features/camp.md))
5. 랭킹 ([`docs/features/rankings.md`](features/rankings.md))

### 트랙 3. 검증 및 제출 준비

1. 수용 기준 통과 ([`docs/common/acceptance.md`](common/acceptance.md))
2. 체크리스트 정리 ([`docs/submission.md`](submission.md))
3. 배포/문서 일치성 점검

## 4. 일정 요약

- 1차 제출: 기획서
- 최종 제출: 웹 링크, GitHub, 솔루션 PDF

상세 제출 일정과 데모 기준은 [`docs/submission.md`](submission.md)를 단일 출처로 사용한다.

## 5. 리스크 대응

- 범위를 과도하게 넓히지 않는다.
- 로컬 상태 초기화, 새로고침 유지, 공개/비공개 정보 노출 누락을 우선 점검한다.
- 필수 기능과 옵션 기능을 분리해 단계적으로 구현한다.
