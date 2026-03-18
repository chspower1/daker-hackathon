# 시스템 구성

## 애플리케이션 레이어

- `app/`: 라우트 진입점, 레이아웃, 메타데이터 초기화
- `components/`: 랜딩, 앱 셸, 디자인 시스템, 도메인별 화면 컴포넌트
- `lib/data/`: 요구사항 JSON 정규화와 시드 데이터 접근
- `lib/storage/`: `localStorage` 키, 복구, 검증, 엔티티별 read/write
- `lib/i18n/`: locale 설정, 사전 로딩, provider, 메타데이터 동기화
- `lib/profile/`, `lib/ids/`: 로컬 프로필 관리와 로컬 ID 생성
- `types/`: 공용 타입 정의

화면, 데이터 가공, 저장, 다국어를 분리해 기능을 명확하게 관리한다.

## 데이터 원본과 영속성

- 공개 읽기 데이터는 `docs/requirements/예시자료/` 의 JSON에서 시작한다.
- 앱 셸 마운트 시 `bootstrapStorage()` 가 읽기 전용 기본 데이터를 보정한다.
- 영속 키는 `localProfile`, `hackathons`, `teams`, `submissions`, `leaderboards`, `rankings` 를 사용한다.
- 값이 없으면 시드로 초기화하고, JSON 파싱에 실패하면 가능한 경우 시드로 복구한다.

## 쓰기 규칙

- 팀 모집글 생성은 `teams` 를 갱신한다.
- 제출 저장은 `submissions` 를 `draft` 상태로 갱신한다.
- 최종 제출은 `submissions` 와 `leaderboards` 를 함께 갱신한다.
- 로컬 생성 데이터에는 작성 시점의 프로필 스냅샷을 함께 저장한다.
- 랭킹 화면은 `localStorage.rankings` 를 읽기 전용 기준으로 사용하며 `localProfile` 과 자동 동기화하지 않는다.

## i18n 구조

- 지원 언어는 한국어(`ko`), 영어(`en`)다.
- 초기 locale 은 쿠키를 기준으로 결정하고 `localStorage` 는 클라이언트 미러로만 사용한다.
- 사용자 문구는 `lib/i18n/locales/en.ts`, `lib/i18n/locales/ko.ts` 에서만 관리한다.
- 클라이언트에서 언어 전환이 필요한 페이지는 페이지 단위 메타데이터 동기화를 사용한다.
- 문자열을 별도 `content.ts` 로 분산하거나 컴포넌트에 직접 하드코딩하지 않는다.

## 공통 화면 규칙

- 데이터 기반 화면은 모두 로딩, 데이터 없음, 에러 상태를 표현한다.
- 에러는 복구 가능한 사용자 메시지로 보여준다.
- 민감 정보, 내부 식별자, 운영용 데이터는 렌더링하지 않는다.
- 라우트 컴포넌트와 시각 컴포넌트는 `window.localStorage` 를 직접 다루지 않고 `lib/storage` 를 통해 접근한다.
