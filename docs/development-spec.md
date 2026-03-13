# Daker Hackathon 웹앱 상세 명세서

## 1. 문서 목적

이 문서는 `docs/requirements/` 하위 요구사항 자료를 기준으로, 실제 개발에 바로 착수할 수 있는 수준의 상세 명세를 정의한다.

본 명세서의 목적은 다음과 같다.

- 구현 대상 화면과 기능 범위를 고정한다.
- 각 화면이 읽고 쓰는 데이터 구조를 정의한다.
- `localStorage` 기반 상태 저장 규칙을 정의한다.
- 로컬 프로필 기반 사용자 식별 규칙을 정의한다.
- 요구사항에 존재하는 제약사항과 공개 범위를 명시한다.
- 요구사항상 모호한 부분은 최소한의 구현 가정으로 분리한다.

## 2. 근거 자료

- `docs/requirements/memo.png`
- `docs/requirements/Hackathon-UI-Flow.png`
- `docs/requirements/예시자료/public_hackathons.json`
- `docs/requirements/예시자료/public_hackathon_detail.json`
- `docs/requirements/예시자료/public_teams.json`
- `docs/requirements/예시자료/public_leaderboard.json`

## 3. 제품 정의

본 프로젝트는 공개용 해커톤 포털 웹앱이다. 사용자는 다음 행동을 수행할 수 있어야 한다.

- 해커톤 목록 조회
- 해커톤 상세 정보 조회
- 팀원 모집글 탐색 및 생성
- 브라우저 단위 로컬 프로필 생성 및 사용
- 해커톤 제출물 저장 및 제출
- 해커톤별 리더보드 조회
- 공개 닉네임 기준 글로벌 랭킹 조회

초기 버전은 제공된 예시 자료와 더미 데이터만으로 동작해야 하며, 별도 키가 필요한 외부 API나 외부 DB 없이도 심사자가 확인 가능한 상태여야 한다.

## 4. 구현 기준선

### 4.1 기술 기준

현재 저장소는 Next.js App Router 기반 프로젝트이며, TypeScript, React, Tailwind CSS v4, ESLint를 사용한다.

### 4.2 데이터 처리 기준

요구사항 UI 플로우 이미지에는 `localStorage` 사용이 명시되어 있으므로, 1차 구현 기준은 다음과 같다.

- 공개 예시 자료를 시드 데이터로 사용한다.
- 클라이언트에서 데이터를 읽고 가공한다.
- 생성/수정 결과는 `localStorage`에 저장한다.
- 서버 쓰기 API는 필수 범위에 포함하지 않는다.

### 4.3 사용자 식별 기준

본 프로젝트는 실사용 회원가입/로그인 대신 브라우저 단위 로컬 프로필을 사용한다.

- 로컬 프로필은 현재 브라우저에서만 유지되는 닉네임 중심 식별자다.
- 이메일, 비밀번호, 외부 인증, 멀티디바이스 동기화는 제공하지 않는다.
- 읽기 전용 탐색은 로컬 프로필 없이 가능하다.
- 팀 모집글 작성, 제출 저장, 최종 제출 같은 쓰기 동작은 로컬 프로필을 기준으로 수행한다.

### 4.4 공개 데이터 원칙

앱은 반드시 공개 가능한 정보만 노출해야 하며, 다음 정보는 절대 노출하면 안 된다.

- 내부 유저 정보
- 유저가 비공개 처리한 정보
- 다른 팀의 내부 정보
- 요구사항 자료에 포함되지 않은 비공개 운영 정보

추가 원칙:

- 로컬 프로필에는 실명, 이메일, 전화번호 같은 개인식별정보를 저장하지 않는다.
- 로컬 프로필에는 공개 가능한 닉네임 수준의 값만 저장한다.

## 5. 범위 정의

### 5.1 필수 라우트

- `/`
- `/hackathons`
- `/hackathons/[slug]`
- `/camp`
- `/rankings`

### 5.2 공통 필수 요구사항

- 전역 상단 내비게이션에서 `/hackathons`, `/camp`, `/rankings` 이동 가능
- 모든 데이터 기반 화면에서 `로딩중`, `데이터 없음`, `에러` 상태 제공
- 공개 데이터만 사용
- 주요 화면 간 이동 흐름 보장
- 쓰기 동작 전 로컬 프로필 확인

### 5.3 옵션 요구사항

아래 항목은 요구사항에 존재하지만 MVP 필수 완료 조건은 아니다.

- 해커톤 목록 상태 필터
- 해커톤 목록 태그 필터
- 팀 모집글 수정
- 모집 마감 처리
- 채팅 또는 쪽지 기능
- 랭킹 기간 필터(`최근 7일`, `30일`, `전체`)
- 팀 구성 유의사항 팝업

### 5.4 범위 밖

다음 항목은 본 명세서 기준 필수 구현 범위에 포함하지 않는다.

- 실사용 회원가입/로그인/세션 인증
- 관리자 화면
- 백엔드 DB 연동
- 실시간 채팅
- 비공개 심사자 전용 기능
- 비공개 사용자 정보 관리 화면
- 멀티디바이스 프로필 동기화 또는 계정 복구

## 6. 정보 구조 및 사용자 흐름

### 6.1 전역 내비게이션

전역 상단바에는 최소 다음 링크가 있어야 한다.

- Hackathons
- Camp
- Rankings

홈으로 이동하는 로고 또는 텍스트 링크는 선택 사항이지만 허용된다.

### 6.2 핵심 사용자 흐름

#### 흐름 A: 메인 -> 해커톤 탐색 -> 상세 -> 제출

1. 사용자가 `/`에 진입한다.
2. `해커톤 보러가기`를 통해 `/hackathons`로 이동한다.
3. 해커톤 목록에서 카드를 선택한다.
4. `/hackathons/[slug]` 상세 페이지로 이동한다.
5. 개요/안내/평가/일정/상금/팀/제출/리더보드 섹션을 탐색한다.
6. 제출 저장 또는 제출 동작 직전에 로컬 프로필을 확인한다.
7. 로컬 프로필이 없으면 닉네임을 입력해 생성한다.
8. 제출 결과가 리더보드 표시 로직에 반영된다.

#### 흐름 B: 메인 -> 팀원 모집 탐색/생성

1. 사용자가 `/`에 진입한다.
2. `팀 찾기`를 통해 `/camp`로 이동한다.
3. 모집글 목록을 탐색한다.
4. 필요 시 `hackathon` 쿼리로 필터링한다.
5. 새 모집글 작성 직전에 로컬 프로필을 확인한다.
6. 로컬 프로필이 없으면 닉네임을 입력해 생성한다.
7. 모집글을 저장한다.

#### 흐름 C: 메인/내비게이션 -> 랭킹

1. 사용자가 `/` 또는 상단 내비게이션에서 `/rankings`로 이동한다.
2. 공개 닉네임 기준 글로벌 랭킹 테이블을 조회한다.

### 6.3 로컬 프로필 흐름

1. 사용자는 로컬 프로필 없이도 목록/상세/랭킹 같은 읽기 전용 화면을 탐색할 수 있다.
2. 사용자가 팀 모집글 작성 또는 제출 저장/제출 같은 쓰기 동작을 시도하면 앱은 `localProfile` 존재 여부를 확인한다.
3. 로컬 프로필이 없으면 닉네임 입력을 통해 즉시 생성한다.
4. 생성된 로컬 프로필은 현재 브라우저의 `localStorage`에 저장된다.
5. 이후 쓰기 동작은 동일한 로컬 프로필을 사용한다.

## 7. 화면 상세 명세

### 7.1 메인 페이지 `/`

#### 목적

서비스의 3개 핵심 기능으로 빠르게 진입시키는 랜딩 페이지 역할을 한다.

#### 필수 UI

- 큰 카드 또는 버튼 3개
- `해커톤 보러가기` -> `/hackathons`
- `팀 찾기` -> `/camp`
- `랭킹 보기` -> `/rankings`

#### 상태

- 본 페이지는 정적 페이지로 구현 가능하다.

#### 완료 기준

- 3개 핵심 페이지에 1클릭으로 진입 가능해야 한다.
- 모바일과 데스크톱에서 CTA가 명확하게 보여야 한다.

### 7.2 해커톤 목록 `/hackathons`

#### 목적

공개 해커톤 목록을 탐색 가능한 형태로 보여준다.

#### 데이터 원본

- `public_hackathons.json`

#### 필수 표시 항목

- 제목
- 상태(`ongoing`, `ended`, `upcoming`)
- 태그
- 시작/종료 또는 제출 관련 일정 정보
- 참가자 수는 공개 데이터가 있을 때만 표시

#### 필수 동작

- 각 카드 클릭 시 `/hackathons/[slug]`로 이동
- 로딩/빈 상태/에러 상태 처리

#### 옵션 동작

- 상태 필터
- 태그 필터

#### 완료 기준

- 시드 데이터의 모든 해커톤이 목록에 노출된다.
- 카드 클릭 시 대응하는 상세 페이지로 이동한다.

### 7.3 해커톤 상세 `/hackathons/[slug]`

#### 목적

선택한 해커톤의 공개 상세 정보와 공개 상호작용 기능을 한 페이지에서 제공한다.

#### 데이터 원본

- 목록 기본 정보: `public_hackathons.json`
- 상세 섹션 정보: `public_hackathon_detail.json`
- 관련 팀 모집글: `public_teams.json`
- 리더보드: `public_leaderboard.json`
- 로컬 프로필: `localStorage`
- 제출 상태: `localStorage`

#### 필수 섹션

요구사항 메모에는 "섹션 7개"라고 적혀 있으나 실제 열거 항목은 아래 8개다. 구현 누락을 방지하기 위해 본 명세서는 열거된 8개를 모두 필수 섹션으로 정의한다.

1. Overview
2. Info / Notice
3. Eval
4. Schedule
5. Prize
6. Teams
7. Submit
8. Leaderboard

#### 7.3.1 Overview

표시 항목:

- 해커톤 요약 설명
- 개인 참여 가능 여부
- 최대 팀 인원

#### 7.3.2 Info / Notice

표시 항목:

- 공지/안내 문구 목록
- Rules 링크
- FAQ 링크

#### 7.3.3 Eval

표시 항목:

- 평가 지표 이름
- 평가 설명
- 점수 산정 유형
- 점수 breakdown 정보(제공되는 경우)
- 실행 제한 또는 제출 제한(제공되는 경우)

#### 7.3.4 Schedule

표시 항목:

- 타임존
- 마일스톤 목록

정렬 규칙:

- 시간순으로 정렬해 노출한다.

#### 7.3.5 Prize

표시 항목:

- 순위별 상금 또는 보상 정보

예외 처리:

- 상금 정보가 없으면 빈 상태 문구를 표시한다.

#### 7.3.6 Teams

표시 항목:

- 현재 해커톤과 연결된 팀 모집글 목록
- `/camp?hackathon={slug}` 이동 CTA

필수 동작:

- 해당 해커톤 팀 보기
- 해당 해커톤 기준으로 팀 모집글 생성 진입
- 팀 모집글 생성 전 로컬 프로필 확인

작성 규칙:

- 로컬 프로필이 없으면 닉네임 입력 후 즉시 생성한다.
- 로컬에서 새로 생성한 모집글에는 작성 시점의 로컬 프로필 스냅샷을 함께 저장한다.

해석 기준:

- 메모에는 `초대/수락/거절` 버튼이 언급되지만, 제공된 공개 데이터에는 팀 멤버십/초대 상태 모델이 없다.
- 따라서 MVP에서는 공개 팀 모집글 조회 및 생성 연결만 필수로 본다.
- 초대/수락/거절은 별도 데이터 모델 정의 없이는 실제 워크플로우로 구현하지 않는다.

#### 7.3.7 Submit

표시 항목:

- 제출 가이드
- 제출 입력 폼
- notes(optional)
- 해커톤 설정에 따른 제출 필드

필수 동작:

- 저장
- 제출
- 저장 결과를 `localStorage`에 반영
- 해커톤별 제출 형식 차이를 반영
- 저장/제출 전 로컬 프로필 확인

작성 규칙:

- 로컬 프로필이 없으면 닉네임 입력 후 즉시 생성한다.
- 로컬에서 새로 생성한 제출 데이터에는 제출 시점의 로컬 프로필 스냅샷을 함께 저장한다.

제출 필드 구성 규칙:

- `submissionItems`가 있으면 해당 정의를 우선 사용한다.
- `submissionItems`가 없으면 `allowedArtifactTypes`를 기반으로 최소 폼을 구성한다.

예시:

- `aimers-8-model-lite`: `zip`
- `daker-handover-2026-03`: `plan`, `web`, `pdf` 단계형 제출

#### 7.3.8 Leaderboard

표시 항목:

- 순위
- 팀명
- 점수
- 제출 시각
- 점수 breakdown(있는 경우)
- 공개 산출물 링크(있는 경우)

필수 규칙:

- 제출 내역이 없으면 `미제출`로 표기
- `미제출` 항목에는 숫자 순위를 부여하지 않음
- 점수 표시는 해커톤 설정의 공개 규칙을 따름
- 리더보드의 주 표시 식별자는 팀명이며, 로컬 프로필은 내부 귀속 정보로만 사용한다.

#### 완료 기준

- 선택한 해커톤의 필수 공개 섹션이 모두 렌더링된다.
- 제출 폼이 해커톤별 구성에 맞게 변경된다.
- 저장/제출이 로컬 상태에 반영된다.
- 리더보드가 공개 가능한 정보만 노출한다.

### 7.4 캠프 `/camp`

#### 목적

팀원 모집글 목록 조회 및 모집글 생성을 제공한다.

#### 데이터 원본

- 기본 목록: `public_teams.json`
- 사용자 생성 데이터: `localStorage`
- 로컬 프로필: `localStorage`

#### 필수 목록 항목

- 팀명
- 소개
- 모집중 여부(`isOpen`)
- 모집 포지션(`lookingFor`)
- 연락 링크(`contact.url`)
- 연결된 해커톤 slug(있는 경우)
- 작성일

#### 필수 동작

- 전체 팀 모집글 조회
- `hackathon` 쿼리 파라미터 기반 필터링
- 해커톤과 무관한 모집글 생성 가능
- 해커톤 연결형 모집글 생성 가능
- 모집글 작성 전 로컬 프로필 확인

#### 생성 폼 필수 필드

- `name` (필수)
- `intro` (필수)
- `isOpen`
- `lookingFor[]`
- `contact.url`
- `hackathonSlug` (선택)

작성 규칙:

- 작성자 입력 필드는 별도로 노출하지 않는다.
- 새 모집글은 활성 로컬 프로필에 자동 귀속된다.

#### 옵션 기능

- 수정
- 모집 마감 처리
- 채팅/쪽지

#### 완료 기준

- `/camp`에서 전체 모집글이 보인다.
- `/camp?hackathon={slug}`에서 해당 해커톤 모집글만 보인다.
- 로컬 프로필이 없는 상태에서 작성 시 프로필 생성 흐름이 동작한다.
- 새 모집글 작성 후 새로고침해도 데이터가 유지된다.

### 7.5 랭킹 `/rankings`

#### 목적

해커톤 전반의 참여/순위 이력을 기반으로 공개 닉네임 기준 글로벌 랭킹을 제공한다.

#### 필수 UI

- 테이블 형태
- 컬럼: `rank`, `nickname`, `points`

#### 데이터 규칙

요구사항 메모에는 랭킹 화면 요구사항이 존재하지만, 제공된 예시 자료에는 전용 랭킹 JSON이 없다. 따라서 MVP에서는 공개용 시드 랭킹 데이터를 별도로 정의해 사용한다.

요구사항의 `유저별 랭킹`은 MVP에서 `공개 닉네임 기준 랭킹`으로 해석한다. 여기서 `nickname`은 인증된 계정 식별자가 아니라 공개 표시용 문자열이며, 현재 브라우저의 로컬 프로필과 자동 동기화되지 않는다.

#### 옵션 기능

- 기간 필터(`최근 7일`, `30일`, `전체`)

#### 완료 기준

- 공개용 랭킹 데이터가 표 형태로 표시된다.
- 로딩/빈 상태/에러 상태를 처리한다.

## 8. 데이터 명세

### 8.1 해커톤 요약 모델

```ts
type HackathonSummary = {
  slug: string;
  title: string;
  status: "upcoming" | "ongoing" | "ended";
  tags: string[];
  thumbnailUrl?: string;
  period: {
    timezone: string;
    submissionDeadlineAt?: string;
    endAt?: string;
    startAt?: string;
  };
  links: {
    detail: string;
    rules?: string;
    faq?: string;
  };
};
```

### 8.2 해커톤 상세 모델

```ts
type HackathonDetail = {
  slug: string;
  title: string;
  sections: {
    overview?: {
      summary?: string;
      teamPolicy?: {
        allowSolo?: boolean;
        maxTeamSize?: number;
      };
    };
    info?: {
      notice?: string[];
      links?: {
        rules?: string;
        faq?: string;
      };
    };
    eval?: {
      metricName?: string;
      description?: string;
      scoreSource?: string;
      scoreDisplay?: {
        label?: string;
        breakdown?: Array<{
          key: string;
          label: string;
          weightPercent: number;
        }>;
      };
      limits?: {
        maxRuntimeSec?: number;
        maxSubmissionsPerDay?: number;
      };
    };
    schedule?: {
      timezone?: string;
      milestones?: Array<{
        name: string;
        at: string;
      }>;
    };
    prize?: {
      items?: Array<{
        place: string;
        amountKRW: number;
      }>;
    };
    teams?: {
      campEnabled?: boolean;
      listUrl?: string;
    };
    submit?: {
      allowedArtifactTypes?: string[];
      submissionUrl?: string;
      guide?: string[];
      submissionItems?: Array<{
        key: string;
        title: string;
        format: string;
      }>;
    };
    leaderboard?: {
      publicLeaderboardUrl?: string;
      note?: string;
    };
  };
};
```

### 8.3 로컬 프로필 모델

```ts
type LocalProfile = {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};
```

규칙:

- 브라우저당 하나의 활성 로컬 프로필만 유지한다.
- 이메일, 비밀번호, 외부 인증 식별자는 포함하지 않는다.
- 로컬 프로필은 현재 브라우저에서만 유효하다.

### 8.4 팀 모집글 모델

```ts
type TeamPost = {
  teamCode: string;
  hackathonSlug?: string;
  ownerProfileId?: string;
  ownerNicknameSnapshot?: string;
  name: string;
  isOpen: boolean;
  memberCount?: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: "link";
    url: string;
  };
  createdAt: string;
};
```

규칙:

- 공개 시드 데이터에는 작성자 프로필 정보가 없을 수 있다.
- 로컬에서 생성한 모집글에는 `ownerProfileId`, `ownerNicknameSnapshot`을 함께 저장한다.

### 8.5 제출 모델

제출 데이터의 canonical sample 파일은 제공되지 않았으므로, 로컬 저장을 위한 최소 모델을 아래와 같이 정의한다.

```ts
type SubmissionStatus = "draft" | "submitted";

type SubmissionRecord = {
  id: string;
  hackathonSlug: string;
  profileId?: string;
  profileNicknameSnapshot?: string;
  teamName: string;
  status: SubmissionStatus;
  notes?: string;
  artifacts: Record<string, string>;
  submittedAt?: string;
  updatedAt: string;
};
```

규칙:

- `draft`는 저장만 한 상태
- `submitted`는 최종 제출 상태
- `artifacts`의 key는 `submissionItems` 정의를 우선 따른다.
- 로컬에서 생성한 제출 데이터에는 `profileId`, `profileNicknameSnapshot`을 함께 저장한다.

### 8.6 리더보드 모델

```ts
type LeaderboardEntry = {
  rank?: number;
  teamName: string;
  score?: number;
  submittedAt?: string;
  scoreBreakdown?: Record<string, number>;
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
  status?: "submitted" | "미제출";
};

type Leaderboard = {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
};
```

### 8.7 글로벌 랭킹 모델

```ts
type UserRankingEntry = {
  rank: number;
  nickname: string;
  points: number;
};
```

`nickname`은 공개 표시용 식별자이며 인증된 계정을 의미하지 않는다. 개인 식별용 비공개 값은 포함하지 않는다.

## 9. 로컬 저장소 명세

### 9.1 필수 키

UI 플로우 기준 필수 키는 아래와 같다.

- `localProfile`
- `hackathons`
- `teams`
- `submissions`
- `leaderboards`
- `rankings`

`rankings`는 UI 플로우에 직접 명시되어 있지는 않지만 `/rankings` 화면 요구사항을 만족하기 위해 별도 공개 시드 저장 키로 정의한다.

### 9.2 초기화 규칙

- `localProfile`이 없어도 읽기 전용 화면 탐색은 가능해야 한다.
- `localProfile`은 최초 쓰기 동작 시 또는 사용자가 명시적으로 닉네임을 설정할 때 생성한다.
- 최초 로드 시 해당 키가 없으면 공개 시드 데이터로 초기화한다.
- 이미 데이터가 있으면 `localStorage` 값을 우선 사용한다.
- 파싱 실패 시 기본 시드로 복구하되, 화면에서는 안전한 에러 상태를 제공한다.

### 9.3 쓰기 규칙

- 로컬 프로필 생성/수정 -> `localProfile` 갱신
- 팀 모집글 생성 -> `teams` 갱신
- 제출 저장 -> `submissions` 갱신
- 최종 제출 -> `submissions`와 `leaderboards` 갱신
- 랭킹 데이터는 MVP에서 시드 데이터 기반으로 유지
- 로컬 생성 데이터에는 해당 시점의 로컬 프로필 스냅샷을 함께 저장

## 10. 상태 처리 규칙

데이터를 읽는 모든 화면은 아래 상태를 명시적으로 처리해야 한다.

- 로딩 상태
- 빈 상태
- 에러 상태

### 10.1 로딩 상태

- 로딩 인디케이터 또는 스켈레톤 제공

### 10.2 빈 상태

- 현재 표시 가능한 공개 데이터가 없음을 안내
- 가능한 다음 행동이 있으면 함께 제시

예시:

- 캠프 페이지: `등록된 팀 모집글이 없습니다. 첫 모집글을 작성해보세요.`

### 10.3 에러 상태

- 사용자에게 복구 가능한 메시지 제공
- 내부 에러 원문 또는 민감 정보는 노출하지 않음

## 11. 기능 규칙

### 11.1 로컬 프로필 규칙

- 목록 조회, 상세 조회, 랭킹 조회 같은 읽기 전용 동작은 로컬 프로필 없이 가능하다.
- 팀 모집글 작성, 제출 저장, 최종 제출 같은 쓰기 동작은 로컬 프로필을 필요로 한다.
- 로컬 프로필이 없으면 닉네임 입력을 통해 즉시 생성한다.
- 로컬 프로필 닉네임을 변경하더라도 기존 모집글/제출 데이터에는 저장 시점의 스냅샷을 유지한다.

### 11.2 해커톤 목록 필터

- 상태/태그 필터는 옵션이다.
- 구현 시 공개 목록 데이터만 기준으로 필터링한다.

### 11.3 캠프 쿼리 필터

- `hackathon` 쿼리가 있으면 `hackathonSlug` 일치 항목만 표시한다.
- 없으면 전체 표시한다.

### 11.4 제출 폼 렌더링 규칙

- `submissionItems` 존재 시 해당 순서대로 필드 렌더링
- 없으면 `allowedArtifactTypes` 기반 최소 필드 렌더링
- `notes`는 항상 선택 입력

### 11.5 리더보드 렌더링 규칙

- 제출 완료 항목을 우선 노출한다.
- `미제출` 항목은 별도 상태로 표시한다.
- `미제출` 항목에는 순위를 부여하지 않는다.
- 리더보드의 공개 표시 기준은 팀명이다.

### 11.6 개인정보/비공개 정보 규칙

- 공개 가능한 팀 정보, 공개 가능한 제출 산출물만 노출한다.
- 내부 심사 메모, 비공개 식별자, 개인 비공개 정보는 렌더링하지 않는다.
- 로컬 프로필 ID는 내부 로컬 식별자이며 공개 필수 항목이 아니다.

## 12. 권장 구현 구조

현재 Next.js App Router 구조를 기준으로 아래 구조를 권장한다.

```text
app/
  layout.tsx
  page.tsx
  hackathons/
    page.tsx
    [slug]/
      page.tsx
  camp/
    page.tsx
  rankings/
    page.tsx
components/
  layout/
  hackathons/
  camp/
  rankings/
  shared/
lib/
  data/
  storage/
  profile/
  mapping/
  leaderboard/
  ranking/
types/
```

### 12.1 역할 분리

- `lib/data`: 공개 시드 데이터 로딩 및 정규화
- `lib/storage`: `localStorage` 읽기/쓰기/초기화
- `lib/profile`: 로컬 프로필 생성, 조회, 쓰기 동작 전제 조건 처리
- `lib/mapping`: 원본 데이터를 UI용 view model로 변환
- `lib/leaderboard`: 리더보드 갱신 규칙 처리
- `lib/ranking`: 글로벌 랭킹 데이터 처리
- `types`: 공통 도메인 타입

## 13. 기능군별 완료 기준

### 13.1 내비게이션

- 상단 내비게이션이 주요 화면에서 노출된다.
- `/hackathons`, `/camp`, `/rankings` 이동이 정상 동작한다.

### 13.2 데이터 안전성

- 공개 데이터 또는 사용자가 직접 입력한 로컬 데이터만 표시된다.
- 숨겨진 내부 필드가 UI에 드러나지 않는다.

### 13.3 로컬 프로필

- 로컬 프로필 없이 읽기 전용 화면 탐색이 가능하다.
- 쓰기 동작 진입 시 로컬 프로필 생성 흐름이 동작한다.
- 생성한 로컬 프로필은 새로고침 후에도 유지된다.

### 13.4 로컬 영속성

- 팀 모집글 생성 후 새로고침해도 유지된다.
- 저장한 제출 내용이 새로고침 후에도 유지된다.
- 리더보드 반영 상태가 새로고침 후에도 유지된다.

### 13.5 해커톤 플로우

- 홈 -> 목록 -> 상세 이동이 가능하다.
- 상세 페이지에 필수 섹션이 모두 표시된다.
- 저장/제출 전 로컬 프로필 확인이 동작한다.

### 13.6 캠프 플로우

- 전체 모집글 탐색이 가능하다.
- 해커톤 기준 필터링이 가능하다.
- 모집글 생성이 가능하다.
- 모집글 작성 전 로컬 프로필 확인이 동작한다.

### 13.7 랭킹 플로우

- 공개 닉네임 기준 랭킹 테이블이 표시된다.
- 컬럼이 `rank`, `nickname`, `points`를 충족한다.

## 14. 가정 및 오픈 포인트

아래 항목은 요구사항 자료에 완전히 정의되어 있지 않으므로, 구현 전 해석 기준을 고정하기 위해 최소 가정으로 문서화한다.

### 14.1 로컬 프로필의 비인증 특성

- 로컬 프로필은 인증된 계정이 아니라 브라우저 단위 로컬 식별자다.
- 동일한 닉네임이 여러 브라우저에서 중복될 수 있다.

### 14.2 랭킹 시드 데이터 부재

- `/rankings`용 전용 예시 JSON은 제공되지 않았다.
- 따라서 공개용 시드 랭킹 데이터를 별도로 정의해야 한다.

### 14.3 팀 초대/수락/거절 모델 부재

- 메모에는 관련 버튼이 있지만, 실제 초대 상태/멤버십 모델은 없다.
- MVP에서는 공개 모집글 탐색과 생성까지만 필수로 본다.

### 14.4 해커톤 목록의 참가자 수

- 메모상 `참가자 수?`로 불확실하게 적혀 있다.
- 공개 데이터가 있는 경우에만 표시하고, 없으면 생략한다.

### 14.5 상세 섹션 개수 표기 불일치

- 메모에는 7개라고 적혀 있으나, 실제 열거 항목은 8개다.
- 본 명세서는 열거된 8개를 모두 포함한다.

### 14.6 참가 여부의 정의

- `미제출` 표시는 요구사항에 있으나, "참가"를 어떤 데이터로 판단할지 명시되어 있지 않다.
- MVP에서는 공개 시드 리더보드 또는 로컬 제출 데이터 기준으로만 상태를 판단한다.

## 15. 최종 완료 정의

아래 조건을 모두 만족하면 MVP 구현 완료로 본다.

- 필수 라우트가 모두 존재한다.
- 필수 화면이 공개 데이터를 기반으로 렌더링된다.
- 로딩/빈 상태/에러 상태가 처리된다.
- 로컬 프로필 생성 및 재사용이 동작한다.
- 캠프 모집글 생성이 로컬 저장과 함께 동작한다.
- 해커톤 제출 저장/제출이 로컬 저장과 함께 동작한다.
- 리더보드가 제출 상태를 반영한다.
- 랭킹 페이지가 공개 닉네임 기준 랭킹 테이블을 표시한다.
- 비공개 또는 내부 전용 정보가 노출되지 않는다.
