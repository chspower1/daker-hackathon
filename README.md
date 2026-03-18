# HackPlatform

Next.js App Router 기반 해커톤 플랫폼 프로토타입입니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열면 현재 랜딩 페이지를 확인할 수 있습니다.

## 다국어

- 현재 지원 언어: 한국어(`ko`), 영어(`en`)
- 런타임 구조: `app/layout.tsx` -> `lib/i18n/Providers.tsx` -> `lib/i18n/I18nProvider.tsx`
- 번역 리소스: `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts`
- 상세 가이드: `docs/system-structure.md`

## 참고 문서

- 문서 허브: `docs/index.md`
- 서비스 개요: `docs/service-overview.md`
- 시스템 구성: `docs/system-structure.md`
- 핵심 기능 명세: `docs/core-features.md`
