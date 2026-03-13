# 다국어 개발 가이드

## 현재 구조

- 지원 언어는 `lib/i18n/config.ts`의 `locales`에서 관리한다.
- 번역 원본은 `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts`가 단일 진입점이다.
- 서버는 `app/layout.tsx`에서 쿠키를 읽어 초기 언어와 `<html lang>`를 결정한다.
- 클라이언트는 `lib/i18n/I18nProvider.tsx`에서 언어 상태를 관리하고, 쿠키를 초기 렌더 기준값으로 사용한다.
- `localStorage`는 클라이언트 편의용 미러 저장소이며, 서버 초기 렌더의 기준값은 아니다.
- 현재는 `Accept-Language` 자동 감지를 사용하지 않고, 사용자가 선택한 언어만 쿠키로 유지한다.

## 새 UI 문구를 추가할 때

1. 영어 기준 문자열을 `lib/i18n/locales/en.ts`에 먼저 추가한다.
2. 동일한 키를 `lib/i18n/locales/ko.ts`에도 같은 구조로 추가한다.
3. 컴포넌트에서는 하드코딩 문자열 대신 `useI18n()`으로 `dict`를 읽어 사용한다.
4. 화면 카피를 별도의 `content.ts` 같은 파일로 다시 분산시키지 않는다. 번역 누락을 막기 위해 locale dictionary를 단일 진실 공급원으로 유지한다.

## 반드시 다국어 대상에 포함해야 하는 항목

- 버튼, 링크, 배지, 섹션 제목, 본문 텍스트
- 테이블 헤더, 폼 라벨, placeholder, helper text
- 빈 상태, 로딩 상태, 에러 상태, 토스트, 모달 문구
- `aria-label`, `title`, `sr-only` 텍스트 같은 접근성 문구
- `generateMetadata()`에서 반환하는 title, description 같은 메타데이터

## 메타데이터 규칙

- 초기 메타데이터는 `app/layout.tsx`의 `generateMetadata()`에서 locale 기준으로 생성한다.
- 클라이언트에서 언어 전환이 가능한 페이지는 해당 페이지 컴포넌트에서만 title, description 동기화를 처리한다.
- 전역 provider에서 모든 페이지 메타데이터를 일괄 갱신하지 않는다.

## 새 언어를 추가할 때

1. `lib/i18n/locales/{locale}.ts` 파일을 추가한다.
2. `lib/i18n/config.ts`의 `locales`에 locale 코드를 추가한다.
3. `lib/i18n/dictionaries.ts`에 새 dictionary를 등록한다.
4. 언어 전환 UI가 새 locale을 노출하도록 업데이트한다.
5. 새 locale로 진입했을 때 초기 렌더, 새로고침, `<html lang>` 값이 모두 맞는지 확인한다.

## 기능 개발 PR 체크리스트

- 새 UI 문자열이 locale dictionary에만 추가되었는가?
- 한국어/영어 양쪽에 같은 키가 존재하는가?
- 접근성 문구와 메타데이터도 함께 반영했는가?
- 언어 전환 후 새 화면/새 기능의 문자열이 모두 바뀌는가?
- 새로고침 후 선택한 언어가 유지되는가?

## 확장 규칙

- 규모가 커지면 `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts`를 기능 단위 파일로 분리하되, 언어별 파일 구조는 동일하게 유지한다.
- 공통 컴포넌트의 기본 문구는 가능한 한 props로 받고, 실제 문자열은 화면 레벨에서 locale dictionary를 통해 주입한다.
- 번역 리소스 구조를 바꿀 때는 `docs/development-spec.md`와 이 문서를 함께 업데이트한다.
