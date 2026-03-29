# 기여 가이드

이 저장소는 문서 주도(docs-driven) 방식으로 관리됩니다. 기능 변경 전에는 구현 파일보다 먼저 관련 문서를 확인하고, 계약이 바뀌면 문서와 코드를 같은 변경 안에서 함께 갱신합니다.

## 개발 환경

- 권장 런타임: Node.js 20 LTS
- 패키지 매니저: `pnpm`
- 주요 명령:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## 기본 작업 순서

1. `docs/service-overview.md`, `docs/page-structure.md`, `docs/system-structure.md`, `docs/core-features.md`를 먼저 읽습니다.
2. 변경 범위와 맞는 로컬 가이드(`docs/AGENTS.md`, `lib/storage/AGENTS.md`, `lib/i18n/AGENTS.md`, `components/*/AGENTS.md`)를 확인합니다.
3. 구현 후 `pnpm lint`, `pnpm build`, 그리고 `docs/verification.md`의 관련 수동 QA를 실행합니다.
4. 계약이 바뀌면 문서도 같은 변경에서 업데이트합니다.

## 변경 유형별 동기화 규칙

- 라우트/화면 책임 변경: `docs/page-structure.md`, `docs/core-features.md`
- 저장 키/저장 구조 변경: `docs/system-structure.md`, `docs/storage-contracts.md`, `docs/core-features.md`
- i18n 키/문구 구조 변경: `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts`, 필요 시 `docs/system-structure.md`
- 사용자 흐름 변경: `docs/user-flows.md`, `docs/verification.md`
- 새 문서 추가: `docs/index.md`, 필요 시 `docs/AGENTS.md`

## 품질 게이트

- `pnpm lint` 통과
- `pnpm build` 통과
- 변경된 기능에 맞는 수동 QA 실행
- 사용자 노출 문구는 사전(`lib/i18n/locales/*`)에서만 관리
- 제품 데이터의 `window.localStorage` 직접 접근 대신 `lib/storage` 경계 사용 (`app-locale` 미러는 `lib/i18n/persistence.ts` 예외)

## 커밋하지 말아야 할 것

- `.sisyphus/` 아래 내부 실행 산출물
- 개인 메모, 세션 ID, 실험 로그
- 비밀값, 계정 정보, 환경 파일

## 문서 언어 정책

- 제품 문서는 한국어 중심으로 작성합니다.
- 코드 식별자, 라우트, 타입, 저장 키는 실제 구현 값(영문)을 유지합니다.
