# 기능 상세: 해커톤 상세

## 0. 병렬 작업 시작점

- 해커톤 트랙 병렬 착수는 [`docs/workstreams/hackathon.md`](../workstreams/hackathon.md)에서 시작한다.
- 해커톤-캠프 인터페이스 고정값은 [`docs/workstreams/parallel-overview.md`](../workstreams/parallel-overview.md)만 따른다.

## 1. 라우트

`/hackathons/[slug]`

## 2. 목적

선택한 해커톤의 공개 정보를 한 화면에서 제공하고, 팀 구성과 제출 플로우를 연결한다.

## 3. 데이터 원본

- 목록: `docs/requirements/예시자료/public_hackathons.json`
- 상세: `docs/requirements/예시자료/public_hackathon_detail.json`
- 팀: `docs/requirements/예시자료/public_teams.json`
- 리더보드: `docs/requirements/예시자료/public_leaderboard.json`
- 로컬 상태: `localStorage`

## 4. 필수 섹션

요구사항의 섹션 수치 오표기 이슈가 있어, 구현은 아래 8개를 모두 필수로 본다.

1. Overview
2. Info / Notice
3. Eval
4. Schedule
5. Prize
6. Teams
7. Submit
8. Leaderboard

## 5. 섹션별 요구사항

### 5.1 Overview

- 해커톤 요약
- 개인 참여 가능 여부
- 최대 팀 인원

### 5.2 Info / Notice

- 공지/안내
- Rules 링크
- FAQ 링크

### 5.3 Eval

- 평가 지표, 설명
- 점수 구성(있으면)
- 실행/제출 제한(있으면)

### 5.4 Schedule

- 타임존
- 마일스톤 정렬은 시간순

### 5.5 Prize

- 상금/보상 목록
- 데이터 미존재 시 빈 상태 안내

### 5.6 Teams

- 현재 해커톤 연동 모집글 목록
- 목록 데이터는 `localStorage.teams` 병합 결과를 우선 사용한다.
- `/camp?hackathon={slug}` 이동 (공개 계약 링크)
- 모집글 생성 진입
- 작성 전 로컬 프로필 확인
- 로컬 생성 모집글에는 작성 시점의 프로필 스냅샷을 저장

해석 기준

- 메모에는 `초대/수락/거절`이 언급되지만, 공개 데이터에는 멤버십/초대 상태 모델이 없다.
- 따라서 MVP 필수 범위는 공개 모집글 조회와 생성 연결까지만 포함한다.

### 5.7 Submit

- 가이드 + 입력 폼
- 해커톤 설정에 맞는 필드 구성 반영
- 저장/제출 시 `localStorage` 반영
- 저장 또는 최종 제출 전 프로필 확인
- 저장 형식, 프로필 스냅샷, `notes` 규칙은 `docs/common/data-and-state.md`를 따른다.

예시

- `aimers-8-model-lite`: `zip`
- `daker-handover-2026-03`: `plan`, `web`, `pdf`

### 5.8 Leaderboard

- 팀명, 점수, 제출시각, 점수 breakdown
- 공개 산출물 링크 제공
- 상태, 공개 노출, 식별자 규칙은 `docs/common/data-and-state.md`를 따른다.

## 6. 완료 기준

- 필수 섹션이 모두 표시됨
- 제출 폼이 해커톤별 구성 반영
- 저장/제출 데이터가 로컬 상태에 반영
- 리더보드가 공개 규칙을 따른다

## 7. 예외 처리

- `slug`에 해당하는 해커톤이 목록/상세 데이터에서 모두 확인되지 않으면 안전한 에러 상태 또는 not found 화면으로 전환한다.
- 목록 데이터는 존재하지만 상세 섹션 데이터가 비어 있으면 페이지 전체를 실패시키지 않고, 가능한 공개 정보만 먼저 표시한 뒤 섹션별 빈 상태를 보여준다.
- 팀/리더보드/상금처럼 일부 데이터만 누락된 경우에는 해당 섹션에만 빈 상태 문구를 노출한다.
- Rules/FAQ 같은 외부 링크가 비어 있으면 버튼을 숨기거나 비활성 상태로 처리한다.

## 8. 연계 규칙

- 로컬 상태와 모델 규칙: `docs/common/data-and-state.md`
- 공통 수용 기준: `docs/common/acceptance.md`
- 구현 구조 제약: `docs/common/implementation-architecture.md`
- 병렬 공유 계약: `docs/workstreams/parallel-overview.md`
