# 공통 범위 문서

## 1. 목표

이 문서는 공개 요구사항 자료와 앱 동작 기준을 한 번에 정리한 공통 범위 정의서다. 구현 시 우선순위와 배제 항목을 명확히 하여 각 기능별 문서가 일관되게 동작하게 만든다.

## 2. 제품 정의

웹앱은 공개 데이터 기반으로 해커톤 탐색, 팀 모집, 제출, 순위 조회를 제공한다. 핵심 범위는 다음이다.

- 해커톤 목록 조회
- 해커톤 상세 조회
- 팀 모집글 탐색 및 생성
- 로컬 프로필 기반의 브라우저 단위 쓰기 동작
- 해커톤 제출 저장/제출
- 리더보드/랭킹 조회

초기 버전은 예시 JSON과 시드 데이터로 동작해야 하며, 별도 인증이나 백엔드 쓰기 API가 없어도 핵심 검증이 가능해야 한다.

## 3. 근거 자료

- `docs/requirements/memo.png`
- `docs/requirements/Hackathon-UI-Flow.png`
- `docs/requirements/예시자료/public_hackathons.json`
- `docs/requirements/예시자료/public_hackathon_detail.json`
- `docs/requirements/예시자료/public_teams.json`
- `docs/requirements/예시자료/public_leaderboard.json`

## 4. 구현 기준선

- 기본 플랫폼: Next.js App Router + TypeScript + React + Tailwind CSS v4 + ESLint
- 데이터 가공: 클라이언트에서 시드 데이터 로딩/정규화 후 렌더링
- 영속성: `localStorage` 저장 및 읽기
- 쓰기 API: 필수 구현 범위에 포함하지 않는다

## 5. 필수 라우트

- `/` : 홈
- `/hackathons` : 해커톤 목록
- `/hackathons/[slug]` : 해커톤 상세
- `/camp` : 팀 모집
- `/rankings` : 랭킹

각 페이지는 공개 데이터로 렌더링 가능해야 하며, 로컬 프로필 유무와 무관하게 읽기만 수행하는 화면은 접근 가능해야 한다.

## 6. 필수 공통 요구사항

- 상단 네비게이션에서 `/hackathons`, `/camp`, `/rankings` 이동
- 모든 데이터 기반 화면의 `로딩중`, `데이터 없음`, `에러` 처리
- 공개 가능한 항목만 표시
- 쓰기 동작 전 로컬 프로필 존재 조건 확인
- 사용자 식별은 브라우저 단위 로컬 프로필로 제한

## 7. 공개 데이터 원칙

- 내부 유저 정보, 비공개 처리된 정보, 다른 팀의 내부 정보, 운영용 비공개 정보는 표시하지 않는다.
- 로컬 프로필에는 공개 가능한 닉네임 수준의 값만 저장한다.
- 실명, 이메일, 전화번호, 외부 인증 식별자는 저장 대상에서 제외한다.

## 8. 범위

### 8.1 필수

- 상세 페이지 필수 섹션 렌더링
- 제출 저장/제출, 팀 모집 작성의 기본 성공 플로우
- 리더보드/랭킹 표시 및 정렬

### 8.2 옵션

- 목록 상태/태그 필터
- 모집글 수정/마감 처리
- 채팅/쪽지
- 랭킹 기간 필터

### 8.3 범위 밖

- 회원가입·로그인
- 관리자 화면
- 백엔드 DB 연동
- 실시간 채팅
- 비공개 심사/운영 기능
- 인증 계정 동기화

## 9. 공통 사용자 흐름

### 흐름 1. 홈 → 해커톤 탐색 → 제출
`docs/features/home.md`의 진입 CTA를 통해 `/hackathons`로 이동 후 상세에서 제출을 진행한다.

### 흐름 2. 홈 → 팀원 모집 탐색/생성
홈 CTA 또는 상세의 Teams 섹션에서 `/camp` 진입, 해커톤 필터를 통해 모집글 탐색 후 작성한다.

### 흐름 3. 홈/내비게이션 → 랭킹
`/rankings`에서 공개 닉네임 기준 순위를 조회한다.

## 10. 프로필 관련 참조

로컬 프로필의 생성, 재사용, 스냅샷, 저장 규칙은 `docs/common/data-and-state.md`를 단일 출처로 사용한다.

## 11. 가정 및 오픈 포인트

- 랭킹 전용 예시 JSON은 제공되지 않았으므로 공개용 시드 랭킹 데이터를 별도로 정의한다.
- 팀 초대/수락/거절 버튼은 메모에만 존재하며 데이터 모델이 없어 MVP 필수 범위에 포함하지 않는다.
- 해커톤 목록의 참가자 수는 데이터가 있을 때만 표시하고 없으면 생략한다.
- 상세 페이지 섹션 개수는 메모의 7개 표기 대신 실제 열거 기준 8개를 모두 포함한다.
- `미제출` 상태의 참가 판정은 공개 시드 리더보드 또는 로컬 제출 데이터 기준으로만 해석한다.

## 12. 관련 문서

- 기능 상세: `docs/features/home.md`, `docs/features/hackathons-list.md`, `docs/features/hackathon-detail.md`, `docs/features/camp.md`, `docs/features/rankings.md`
- 데이터/상태: `docs/common/data-and-state.md`
- 구현 구조: `docs/common/implementation-architecture.md`
- 수용 기준: `docs/common/acceptance.md`
