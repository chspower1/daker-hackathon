# 기능 상세: 캠프

## 0. 병렬 작업 시작점

- 이 화면의 독립 실행 진입점은 [`docs/workstreams/camp.md`](../workstreams/camp.md)다.
- 공통 계약은 [`docs/workstreams/parallel-overview.md`](../workstreams/parallel-overview.md)만 필수로 읽는다.

## 1. 라우트

`/camp`

## 2. 목적

팀원 모집글 조회와 작성이 가능한 화면이다.

## 3. 데이터 원본

- 기본 목록: `docs/requirements/예시자료/public_teams.json`
- 사용자 생성: `localStorage`
- 프로필: `localStorage`

## 4. 필수 목록 항목

- 팀명
- 소개
- 모집중 여부(`isOpen`)
- 모집 포지션(`lookingFor`)
- 연락 링크
- 해커톤 slug(있는 경우)
- 작성일

## 5. 필수 동작

- 전체 모집글 조회
- `hackathon` 쿼리 기반 필터링
- 해커톤 연결형/비연결형 모집글 모두 작성 가능
- 작성 전 로컬 프로필 확인

## 6. 작성 폼

- `name` (필수)
- `intro` (필수)
- `isOpen`
- `lookingFor[]`
- `contact.url`
- `hackathonSlug` (선택)

작성 규칙

- 작성자 입력 필드는 별도 노출하지 않는다.
- 새 모집글은 활성 프로필에 귀속되어 저장된다.
- 저장 시점의 로컬 프로필 스냅샷을 함께 보관한다.

## 7. 옵션 기능

- 모집글 수정
- 모집 마감 처리
- 채팅/쪽지

## 8. 완료 기준

- 전체 목록과 해커톤 필터 목록 전환 동작
- 프로필 없는 사용자의 작성 진입 시 프로필 생성 처리
- 작성 후 새로고침으로도 유지되는지 확인

## 9. 연계 규칙

- 상세 화면 CTA와의 연계 계약: `docs/workstreams/parallel-overview.md`의 `Hackathon -> Camp` 인터페이스
- 상태 모델: `docs/common/data-and-state.md`
- 수용 기준: `docs/common/acceptance.md`
