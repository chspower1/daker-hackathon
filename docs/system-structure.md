# 시스템 구성

## 동작 구조 한눈에

`HackPlatform` 은 Next.js App Router 위에서 동작하는 클라이언트 중심 프로토타입이다. 라우트는 `app/` 에서 시작하고, 실제 화면은 `components/` 가 담당하며, 데이터 원본과 저장은 `lib/data/` 와 `lib/storage/` 가 맡는다. 언어 전환과 메타데이터 동기화는 `lib/i18n/` 에서 일관되게 처리한다.

## 레이어 구성

| 레이어 | 위치 | 역할 |
|---|---|---|
| 라우트 진입 | `app/` | 페이지 라우트, 레이아웃, 초기 메타데이터와 locale 결정 |
| 공통 셸/화면 | `components/` | 랜딩, 공통 내비게이션, 디자인 시스템, 페이지별 UI 렌더링 |
| 시드 데이터 | `lib/data/` | 요구사항 JSON을 읽어 화면에서 쓰기 좋은 형태로 정규화 |
| 브라우저 저장소 | `lib/storage/` | `localStorage` 키 정의, 안전한 읽기/쓰기, 복구, bootstrap |
| 다국어 | `lib/i18n/` | locale 결정, 사전 로딩, provider 연결, 클라이언트 메타데이터 동기화 |
| 로컬 프로필/ID | `lib/profile/`, `lib/ids/` | 로컬 프로필 생성과 저장, 로컬 엔티티 ID 생성 |
| 공용 타입 | `types/` | 해커톤, 팀, 제출, 리더보드, 랭킹 타입 정의 |

## 페이지가 동작하는 흐름

1. `app/layout.tsx` 가 쿠키를 읽어 초기 locale 을 결정하고 사전을 준비한다.
2. 앱 내부 페이지는 `app/(app)/layout.tsx` 를 통해 `SharedAppShell` 을 공유한다.
3. `SharedAppShell` 마운트 시 `bootstrapStorage()` 가 실행되어 기본 읽기 데이터를 `localStorage` 기준으로 보정한다.
4. 각 화면은 `lib/storage/entities/*` 또는 `lib/data/*` 를 통해 데이터를 읽고, 엔티티 helper의 recovery 규칙에 따라 시드 데이터 또는 기본값을 사용한다.
5. 사용자가 팀 모집글 작성이나 제출 저장을 하면 화면 컴포넌트가 직접 `window.localStorage` 를 건드리지 않고 storage 엔티티 함수로 상태를 갱신한다.

## 데이터 원본과 저장 구조

- 공개 읽기 데이터의 원본은 `docs/requirements/예시자료/` 의 JSON 파일이다.
- 브라우저 영속 키는 `localProfile`, `hackathons`, `teams`, `submissions`, `leaderboards`, `rankings` 를 사용한다.
- 저장 값이 없거나 JSON 파싱에 실패하면 가능한 경우 시드 데이터로 복구한다.
- `hackathons`, `teams`, `submissions`, `leaderboards`, `rankings` 는 앱 진입 시 bootstrap 대상으로 관리한다.
- `teams` 엔티티는 모집 상태(`isOpen`), 모집 분야(`lookingFor`), 팀 성향(`teamStyle`) 같은 캠프 필터용 공개 필드를 함께 보관한다.
- 키별 JSON shape, seed, 복구 규칙의 상세 계약은 `docs/storage-contracts.md` 에서 관리한다.

## 쓰기 동작 규칙

- 팀 모집글 작성 -> `teams` 갱신 -> 새 모집글이 목록에 즉시 반영되고 새로고침 후에도 유지된다.
- 팀 모집글은 `lookingFor` 와 `teamStyle` 태그를 함께 저장해 캠프 목록의 카테고리 필터 및 키워드 검색에 바로 반영한다.
- 목록 데이터 표시 방식은 카드와 테이블 뷰를 모두 지원하며 클라이언트 상태로 토글 및 정렬 순서를 관리한다.
- 제출 초안 저장 -> `submissions` 에 `draft` 상태 저장 -> 같은 프로필의 최근 제출 상태가 화면에 표시된다.
- 최종 제출 -> `submissions` 를 `submitted` 로 갱신하고 `leaderboards` 도 함께 갱신 -> 해커톤 리더보드에 반영된다.
- 쓰기 데이터에는 `profileId`, `ownerNicknameSnapshot`, `profileNicknameSnapshot` 같은 공개용 스냅샷을 함께 저장해 당시 표시명을 유지한다.
- 글로벌 랭킹은 `rankings` 를 읽기 전용 기준으로 사용하며 `localProfile` 변경을 자동 반영하지 않는다.

## 다국어 구조

- 지원 언어는 한국어(`ko`)와 영어(`en`)다.
- 초기 locale 은 쿠키 기준으로 결정하고 `localStorage` 의 `app-locale` 값은 `lib/i18n/persistence.ts` 가 관리하는 클라이언트 미러로만 사용한다.
- 사용자 노출 문구는 `lib/i18n/locales/ko.ts` 와 `lib/i18n/locales/en.ts` 에서만 관리한다.
- 해커톤 상세와 캠프처럼 클라이언트 데이터에 따라 설명이 바뀌는 화면은 `useDocumentMetadata()` 로 제목과 설명을 다시 동기화한다.

## 공통 처리 원칙

- 해커톤 목록, 해커톤 상세, 랭킹처럼 데이터 의존도가 높은 화면은 로딩, 빈 상태, 오류 상태를 구분해 보여준다.
- 캠프 화면은 로딩과 빈 상태를 기본으로 처리하고, 쓰기 실패는 알림 메시지로 안내한다.
- 오류는 사용자가 현재 상황을 이해할 수 있는 메시지로 노출한다.
- 민감 정보, 내부 식별자, 운영 데이터는 UI에 표시하지 않는다.
- 라우트와 컴포넌트는 제품 데이터에 대해 `window.localStorage` 를 직접 사용하지 않고 `lib/storage` 경계를 통해 접근한다. locale 미러 예외는 `lib/i18n/persistence.ts` 에 한정한다.

## 문서화 책임

- 저장 key, 타입 필드, 복구 규칙 변경 시 `docs/storage-contracts.md` 를 먼저 갱신한다.
- 쓰기 흐름이나 롤백 규칙이 바뀌면 `docs/core-features.md` 와 `docs/user-flows.md` 를 함께 점검한다.
