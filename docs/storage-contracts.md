# Storage 계약

브라우저 영속 데이터는 `lib/storage/` 가 단일 경계로 소유합니다. UI와 라우트는 `window.localStorage`를 직접 다루지 않고 엔티티 helper를 통해 읽고 씁니다.

단, locale 선택을 위한 `app-locale` 미러 key와 테마 선택을 위한 `app-theme` 키는 제품 데이터 계약에 포함하지 않으며 각각 `lib/i18n/persistence.ts`, `lib/theme/persistence.ts` 에서만 관리합니다.

## 공통 원칙

- canonical key는 `lib/storage/keys.ts`의 `storageKeys`만 사용합니다.
- 읽기는 `readWithRecovery()` 기반 엔티티 helper를 사용합니다.
- 저장값이 없거나 JSON 파싱/런타임 검증에 실패하면 엔티티별 seed 또는 기본값으로 복구합니다.
- `localProfile`만 `persistSeedOnMissing: false`를 사용하며, 값이 없을 때 `null`을 반환하지만 자동 저장하지 않습니다.
- 헤더 모의 로그아웃과 화면 내 프로필 해제는 `localProfile`에 `null`을 저장하는 방식으로 처리합니다.
- `bootstrapStorage()`는 앱 진입 시 `hackathons`, `teams`, `submissions`, `leaderboards`, `rankings`를 확인하고 복구된 key 목록을 반환합니다.

## 키별 계약

| key | 타입 | seed/기본값 | 비고 |
|---|---|---|---|
| `localProfile` | `LocalProfile \| null` | `null` | 프로필이 없으면 `null`, 자동 seed 저장 없음, 헤더 모의 로그인과 화면 내 프로필 생성이 동일 key를 사용 |
| `hackathons` | `HackathonSummary[]` | `listSeedHackathons()` | 공개 목록 seed를 기준으로 복구 |
| `teams` | `TeamPost[]` | `listSeedTeamPosts()` | 공개 모집글 seed + 사용자 작성 글 저장 |
| `submissions` | `SubmissionRecord[]` | `[]` | draft / submitted 저장 |
| `leaderboards` | `Leaderboard[]` | `listSeedLeaderboards()` | 해커톤별 공개 리더보드 |
| `rankings` | `UserRankingEntry[]` | `listSeedRankings()` | 글로벌 랭킹 표 데이터 |

## 타입 요약

### `LocalProfile`

```ts
{
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}
```

### `HackathonSummary`

```ts
{
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
}
```

### `TeamPost`

```ts
{
  teamCode: string;
  hackathonSlug?: string;
  ownerProfileId?: string;
  ownerNicknameSnapshot?: string;
  name: string;
  isOpen: boolean;
  memberCount?: number;
  lookingFor: string[];
  teamStyle?: string[];
  intro: string;
  contact: { type: "link"; url: string };
  createdAt: string;
}
```

### `SubmissionRecord`

```ts
{
  id: string;
  hackathonSlug: string;
  profileId?: string;
  profileNicknameSnapshot?: string;
  teamName: string;
  status: "draft" | "submitted";
  notes?: string;
  artifacts: Record<string, string>;
  submittedAt?: string;
  updatedAt: string;
}
```

### `Leaderboard`

```ts
{
  hackathonSlug: string;
  updatedAt: string;
  entries: Array<{
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
    status?: "submitted" | "unsubmitted";
  }>;
}
```

### `UserRankingEntry`

```ts
{
  rank: number;
  nickname: string;
  points: number;
}
```

## 복구와 일관성 규칙

- 저장소 접근이 불가능하면 각 read helper는 `available: false`를 반환합니다.
- 저장값이 손상되었거나 타입 검증에 실패하면 seed 또는 기본값으로 대체하고, 가능하면 즉시 다시 기록합니다.
- 제출 최종 완료 시 `submissions`가 먼저 갱신되고, 이어서 같은 `teamName` 기준으로 `leaderboards`가 갱신됩니다.
- 리더보드 저장 실패 시 제출 변경 rollback 을 시도하고, 이후 현재 저장 상태를 다시 읽어 화면과 저장소가 어긋나지 않게 맞춥니다.
- 글로벌 랭킹은 `rankings`를 읽기 전용 기준으로 사용하며 `localProfile` 변경을 자동 반영하지 않습니다.

## 문서 동기화 규칙

- key를 추가/삭제/이름 변경하면 `docs/system-structure.md`, `docs/core-features.md`, 이 문서를 함께 갱신합니다.
- 타입 필드가 바뀌면 관련 엔티티 validator와 문서를 같은 변경에 반영합니다.
