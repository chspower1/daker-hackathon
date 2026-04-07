# HackPlatform Presentation Deck

`ppt/`는 현재 HackPlatform 프로젝트를 소개하는 독립 React + TypeScript + Vite 프레젠테이션 앱입니다.

## 포함 범위

- 1400×800 고정 스테이지 기반 슬라이드 덱
- 현재 웹앱의 blue/slate 토큰과 grid/blob 분위기를 계승한 시각 시스템
- 프로젝트 소개용 6장 슬라이드
- `?export=true` export 모드
- Playwright 기반 PDF 생성 경로

## 실행

```bash
pnpm install
pnpm dev
```

기본 개발 화면은 한 번에 한 장씩 보이며, 키보드로 이동합니다.

- 다음 장: `ArrowRight`, `Space`, `PageDown`
- 이전 장: `ArrowLeft`, `PageUp`

## 프로덕션 빌드

```bash
pnpm build
pnpm preview
```

`preview`는 수동 확인용으로 `127.0.0.1:4173` 포트에 고정됩니다.

## PDF 생성

```bash
pnpm export:pdf
```

이 명령은 아래 순서로 동작합니다.

1. 덱을 프로덕션으로 빌드합니다.
2. 비어 있는 로컬 포트를 자동으로 찾아 임시 preview 서버를 띄웁니다.
3. 같은 서버의 `?export=true` 모드로 전체 슬라이드를 렌더링합니다.
4. `public/HackPlatform-Deck.pdf`를 생성합니다.

## 산출물

- PDF 경로: `public/HackPlatform-Deck.pdf`
- export 입력 경로: export 스크립트가 매 실행마다 임시 로컬 URL을 자동으로 결정합니다.

## 콘텐츠 기준

슬라이드 내용은 아래 문서를 기준으로 요약되어 있습니다.

- `../docs/service-overview.md`
- `../docs/system-structure.md`
- `../docs/core-features.md`

즉, 이 덱은 마케팅 자료가 아니라 현재 프로토타입의 범위, 구조, 사용자 흐름, 제외 범위를 설명하는 프로젝트 소개 자료입니다.
