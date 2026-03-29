# HackPlatform

Next.js App Router 기반 해커톤 플랫폼 프로토타입입니다. 랜딩 페이지부터 해커톤 탐색, 캠프 모집글, 제출/리더보드, 글로벌 랭킹까지 프론트엔드만으로 핵심 흐름을 검증합니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열면 다음 핵심 라우트를 확인할 수 있습니다.

- `/`: 랜딩 페이지
- `/hackathons`: 해커톤 목록
- `/hackathons/[slug]`: 해커톤 상세, 제출, 리더보드
- `/camp`: 팀 모집글 탐색 및 작성
- `/rankings`: 글로벌 랭킹

## 검증 명령

자동 테스트 스크립트는 아직 없으므로 아래 명령과 수동 QA를 기본 검증 경로로 사용합니다.

```bash
pnpm lint
pnpm build
pnpm start
```

- 수동 QA 체크리스트: `docs/verification.md`
- 기여 및 변경 규칙: `CONTRIBUTING.md`

## 다국어

- 현재 지원 언어: 한국어(`ko`), 영어(`en`)
- 런타임 구조: `app/layout.tsx` -> `lib/i18n/Providers.tsx` -> `lib/i18n/I18nProvider.tsx`
- 번역 리소스: `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts`
- 상세 가이드: `docs/system-structure.md`

## 참고 문서

- 문서 허브: `docs/index.md`
- 서비스 개요: `docs/service-overview.md`
- 페이지 구성: `docs/page-structure.md`
- 시스템 구성: `docs/system-structure.md`
- 핵심 기능 명세: `docs/core-features.md`
- 주요 사용자 흐름: `docs/user-flows.md`
- 수동 검증 가이드: `docs/verification.md`
