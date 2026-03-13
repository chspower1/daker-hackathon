# 구현 구조 문서

## 1. 구현 기본선

현재 저장소는 Next.js App Router 기준이므로, 라우트 단위 화면 분리와 서버/클라이언트 경계 분리를 명확히 둔다.

권장 기본값

- Next.js App Router
- TypeScript
- React, Tailwind CSS v4
- ESLint
- 클라이언트 렌더링 위주, 공개 시드 데이터 주도 UI

## 2. 권장 프로젝트 구조

```text
app/
  layout.tsx
  page.tsx
  hackathons/
    page.tsx
    [slug]/page.tsx
  camp/page.tsx
  rankings/page.tsx

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

## 3. 레이어 역할

- `lib/data`: 공개 시드 데이터 로딩, 정규화, 기본 매핑
- `lib/storage`: `localStorage` 읽기/쓰기/파싱 실패 복구
- `lib/profile`: 프로필 생성, 조회, 쓰기 동작 진입 조건 검사
- `lib/mapping`: 원본 데이터에서 화면 모델 변환
- `lib/leaderboard`: 제출 결과 반영 및 정렬 정책
- `lib/ranking`: 랭킹 모델 정렬/필터
- `types`: 공통 타입 정의
- `components/shared`: 로딩/빈/에러 패턴 및 네비게이션

## 4. 핵심 의사결정

### 4.1 프로필 및 공개 데이터 원칙

- 인증은 구현하지 않고 `localProfile` 기반 쓰기를 사용한다.
- 프로필 저장 규칙과 공개/비공개 노출 규칙의 단일 출처는 `docs/common/data-and-state.md`와 `docs/common/product-and-scope.md`다.

### 4.2 해커톤 상세 섹션 처리

요구사항에서 7개/8개 문구 불일치가 있으나, 실제 구현은 8개 섹션을 모두 필수로 본다.

- Overview
- Info/Notice
- Eval
- Schedule
- Prize
- Teams
- Submit
- Leaderboard

## 5. 공통 플로우 공약

- 공통 네비게이션은 모든 주요 화면에서 일관되게 제공
- 에러는 사용자 친화 메시지와 안전 복구 경로 제공
- 새로고침 후에도 `teams`, `submissions` 상태 유지
- 기능별 페이지는 상태 처리 규칙을 공유 컴포넌트로 통일

## 6. 성능 및 안전

- 시드 데이터 로딩은 최소화하고 화면별 필요 데이터만 파생 처리한다.
- 민감 정보(이메일, 내부 메모, 비공개 ID)는 클라이언트 노출을 금지한다.
- 파싱 실패, 저장 실패는 기본 시드로 복구하거나 에러 상태로 전환한다.

## 7. 의존성 체크리스트

- 구현 전: `docs/common/product-and-scope.md`
- 상태 모델: `docs/common/data-and-state.md`
- 수용 기준: `docs/common/acceptance.md`
