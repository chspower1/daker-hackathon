# 서비스 개요

## 제품 정의

Daker Hackathon은 해커톤 참가자가 대회 정보를 탐색하고, 팀원을 구하고, 제출 흐름까지 한 번에 경험할 수 있도록 구성한 웹 플랫폼 프로토타입이다.

## 서비스 가치

- 해커톤 정보 탐색, 팀 빌딩, 제출, 랭킹 확인을 하나의 흐름으로 연결한다.
- 백엔드 없이도 핵심 사용자 경험을 끝까지 확인할 수 있다.
- 화면 간 연결과 상태 유지가 자연스럽게 이어지도록 설계했다.

## 제공 범위

- 해커톤 목록 조회
- 해커톤 상세 조회
- 팀 모집글 탐색 및 생성
- 로컬 프로필 기반 제출 저장 및 최종 제출
- 글로벌 랭킹 조회
- 한국어/영어 전환

## 핵심 전제

- 읽기 화면은 로컬 프로필 없이도 동작한다.
- 쓰기 동작은 `localProfile` 존재를 전제로 한다.
- 데이터 원본은 `docs/requirements/예시자료/` 의 공개 JSON과 브라우저 `localStorage` 다.
- 민감 정보나 내부 식별자는 UI에 노출하지 않는다.

## 필수 라우트

- `/`
- `/hackathons`
- `/hackathons/[slug]`
- `/camp`
- `/rankings`

## 제외 범위

- 회원가입, 로그인, 외부 인증 연동
- 백엔드 DB 및 쓰기 API
- 관리자 화면
- 실시간 채팅
- 비공개 심사 및 운영 기능
- 계정 기반 동기화

이 범위 제한은 핵심 사용자 흐름을 먼저 완성하기 위한 선택이다.

## 참고 원본

- `docs/requirements/Hackathon-UI-Flow.png`
- `docs/requirements/memo.png`
- `docs/requirements/예시자료/public_hackathons.json`
- `docs/requirements/예시자료/public_hackathon_detail.json`
- `docs/requirements/예시자료/public_teams.json`
- `docs/requirements/예시자료/public_leaderboard.json`
