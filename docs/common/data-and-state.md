# 공통 데이터 및 상태 문서

## 1. 데이터 원본

요구사항 기반 공개 시드 우선순위는 아래와 같다.

- `docs/requirements/예시자료/public_hackathons.json`
- `docs/requirements/예시자료/public_hackathon_detail.json`
- `docs/requirements/예시자료/public_teams.json`
- `docs/requirements/예시자료/public_leaderboard.json`
- `docs/requirements/Hackathon-UI-Flow.png`
- `docs/requirements/memo.png`

공개 데이터가 없거나 누락된 항목은 UI에서 생략하거나 빈 상태 메시지로 대체한다.

## 2. localStorage 규칙

### 2.1 저장 키

- `localProfile`
- `hackathons`
- `teams`
- `submissions`
- `leaderboards`
- `rankings`

### 2.2 초기화 및 복구

- 읽기 전용 화면은 `localProfile` 유무와 무관하게 동작해야 한다.
- 키가 없으면 공개 시드 기반으로 초기화한다.
- 기존 값이 있으면 `localStorage` 값을 우선 사용한다.
- JSON 파싱 실패 시 기본 시드 복구를 시도하고, 불가능하면 에러 상태로 전환한다.

### 2.3 쓰기 규칙

- 로컬 프로필 생성/수정 시 `localProfile`을 갱신한다.
- 팀 모집글 생성 시 `teams`를 갱신한다.
- 제출 저장 시 `submissions`를 갱신하고 `status`는 `draft`로 둔다.
- 최종 제출 시 `submissions`와 `leaderboards`를 갱신해 공개 점수 반영을 유지한다.
- 랭킹은 MVP에서 공개 시드 또는 별도 정의된 시드로 처리한다.
- 로컬에서 생성한 모집글과 제출 데이터에는 저장 시점의 로컬 프로필 스냅샷을 함께 저장한다.

### 2.4 키별 단일 출처

- `hackathons`: 공개 해커톤 시드 데이터의 로컬 캐시
- `teams`: 공개 시드 팀 목록 + 로컬 생성 모집글 병합 결과
- `submissions`: 로컬 사용자가 저장/제출한 제출 데이터의 단일 출처
- `leaderboards`: 공개 리더보드 시드 + 로컬 제출 반영 결과의 단일 출처
- `rankings`: 공개용 랭킹 시드를 초기값으로 넣은 뒤, 화면 렌더링 시 참조하는 단일 출처

### 2.5 로컬 생성 ID 규칙

- 로컬 팀 모집글의 `teamCode`는 `LOCAL-TEAM-{timestamp}-{random}` 형식의 고유 문자열을 사용한다.
- 로컬 제출의 `id`는 `LOCAL-SUBMISSION-{timestamp}-{random}` 형식의 고유 문자열을 사용한다.
- `random` 값은 동일 밀리초 생성 충돌을 피하기 위한 짧은 난수 suffix다.
- 목록 정렬과 표시 순서는 ID가 아니라 `createdAt`, `updatedAt`, `submittedAt` 같은 시간 필드를 기준으로 판단한다.

## 3. 데이터 모델

### 3.1 해커톤 요약

`HackathonSummary`

- `slug: string`
- `title: string`
- `status: "upcoming" | "ongoing" | "ended"`
- `tags: string[]`
- `thumbnailUrl?: string`
- `period`
  - `timezone: string`
  - `submissionDeadlineAt?: string`
  - `endAt?: string`
  - `startAt?: string`
- `links`
  - `detail: string`
  - `rules?: string`
  - `faq?: string`

### 3.2 해커톤 상세

`HackathonDetail`

- `slug: string`
- `title: string`
- `sections`
  - `overview?: { summary?: string; teamPolicy?: { allowSolo?: boolean; maxTeamSize?: number } }`
  - `info?: { notice?: string[]; links?: { rules?: string; faq?: string } }`
  - `eval?: { metricName?: string; description?: string; scoreSource?: string; scoreDisplay?: { label?: string; breakdown?: Array<{ key: string; label: string; weightPercent: number }> }; limits?: { maxRuntimeSec?: number; maxSubmissionsPerDay?: number } }`
  - `schedule?: { timezone?: string; milestones?: Array<{ name: string; at: string }> }`
  - `prize?: { items?: Array<{ place: string; amountKRW: number }> }`
  - `teams?: { campEnabled?: boolean; listUrl?: string }`
  - `submit?: { allowedArtifactTypes?: string[]; submissionUrl?: string; guide?: string[]; submissionItems?: Array<{ key: string; title: string; format: string }> }`
  - `leaderboard?: { publicLeaderboardUrl?: string; note?: string }`

### 3.3 로컬 프로필

`LocalProfile`

- `id: string`
- `nickname: string`
- `createdAt: string`
- `updatedAt: string`

규칙

- 브라우저당 하나의 활성 프로필만 유지한다.
- 이메일/비밀번호/외부 인증 정보는 저장하지 않는다.
- 닉네임은 변경될 수 있으나, 기존 모집글/제출의 표시명은 작성 시점 스냅샷으로 고정한다.

### 3.4 팀 모집글

`TeamPost`

- `teamCode: string`
- `hackathonSlug?: string`
- `ownerProfileId?: string`
- `ownerNicknameSnapshot?: string`
- `name: string`
- `isOpen: boolean`
- `memberCount?: number`
- `lookingFor: string[]`
- `intro: string`
- `contact`
  - `type: "link"`
  - `url: string`
- `createdAt: string`

규칙

- 공개 시드 데이터에는 작성자 프로필 정보가 없을 수 있다.
- 로컬 생성 데이터에는 `ownerProfileId`, `ownerNicknameSnapshot`을 함께 보관한다.

### 3.5 제출

- `SubmissionStatus = "draft" | "submitted"`
- `SubmissionRecord`
  - `id: string`
  - `hackathonSlug: string`
  - `profileId?: string`
  - `profileNicknameSnapshot?: string`
  - `teamName: string`
  - `status: SubmissionStatus`
  - `notes?: string`
  - `artifacts: Record<string, string>`
  - `submittedAt?: string`
  - `updatedAt: string`

규칙

- `draft`는 저장만 한 상태다.
- `submitted`는 최종 제출 상태다.
- `artifacts`의 key는 `submissionItems` 정의를 우선 따른다.
- 로컬 생성 제출 데이터에는 `profileId`, `profileNicknameSnapshot`을 함께 보관한다.

### 3.6 리더보드 / 랭킹

- `LeaderboardEntry`
  - `rank?: number`
  - `teamName: string`
  - `score?: number`
  - `submittedAt?: string`
  - `scoreBreakdown?: Record<string, number>`
  - `artifacts?: { webUrl?: string; pdfUrl?: string; planTitle?: string }`
  - `status?: "submitted" | "미제출"`
- `Leaderboard`
  - `hackathonSlug: string`
  - `updatedAt: string`
  - `entries: LeaderboardEntry[]`
- `UserRankingEntry`
  - `rank: number`
  - `nickname: string`
  - `points: number`

규칙

- `nickname`은 공개 표시용 문자열이며 인증 계정을 의미하지 않는다.
- 랭킹용 `nickname`은 현재 브라우저의 로컬 프로필과 자동 동기화되지 않는다.

## 4. 공통 상태 처리

모든 데이터 기반 화면은 아래 상태를 반드시 표현한다.

- `로딩중`
- `데이터 없음`
- `에러`

에러는 내부 원문 대신 복구 가능한 사용자 메시지를 보여준다.

## 5. 공개/비공개 노출 규칙

- 공개 가능한 팀 정보, 공개 가능한 제출 산출물만 노출한다.
- 내부 심사 메모, 비공개 식별자, 개인 비공개 정보는 렌더링하지 않는다.
- 로컬 프로필 ID는 내부 로컬 식별자이며 공개 필수 항목이 아니다.

## 6. 공통 기능 규칙
### 6.1 제출 폼

- `submissionItems`가 있으면 해당 순서를 우선 렌더링한다.
- 없으면 `allowedArtifactTypes`로 최소 필드를 구성한다.
- `notes`는 선택 입력이다.

### 6.2 캠프 필터

- `hackathon` 쿼리가 있으면 해당 slug만 노출한다.
- 없으면 전체 모집글을 노출한다.

### 6.3 리더보드

- 제출 완료 항목을 우선 노출한다.
- `미제출`은 순위 미부여(`rank` 미출력).
- 기본 식별 키는 공개 팀명이다.

### 6.4 랭킹

- `rankings`는 공개용 시드 랭킹 데이터를 초기값으로 사용한다.
- 이후 화면 렌더링 기준은 `localStorage.rankings`다.
- 로컬 프로필 생성/변경은 랭킹 데이터에 자동 반영되지 않는다.

## 7. 참조

- 범위: `docs/common/product-and-scope.md`
- 구현 구조: `docs/common/implementation-architecture.md`
- 수용 기준: `docs/common/acceptance.md`
