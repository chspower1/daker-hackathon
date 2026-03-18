# 페이지 구성

## 공통 구조

- 랜딩은 `app/page.tsx` 에서 시작한다.
- 앱 내부 페이지는 `app/(app)/layout.tsx` 와 `components/layout/SharedAppShell.tsx` 를 공유한다.
- 공통 셸은 상단 내비게이션, 언어 전환, 초기 `localStorage` bootstrap 을 담당한다.

## 페이지 목록

| 라우트 | 구현 위치 | 역할 | 핵심 구성 |
|---|---|---|---|
| `/` | `app/page.tsx` | 랜딩 허브 | 해커톤, 캠프, 랭킹으로 연결되는 CTA 3개 |
| `/hackathons` | `app/(app)/hackathons/page.tsx` | 해커톤 탐색 | 페이지 헤더, 목록 카드, 상태 표시 |
| `/hackathons/[slug]` | `app/(app)/hackathons/[slug]/page.tsx` | 해커톤 상세 | 상세 정보, 팀 모집 연동, 제출, 리더보드 |
| `/camp` | `app/(app)/camp/page.tsx` | 팀 모집 탐색/작성 | 모집글 목록, `hackathon` 쿼리 필터, 작성 폼 |
| `/rankings` | `app/(app)/rankings/page.tsx` | 글로벌 랭킹 | `rank`, `nickname`, `points` 테이블 |

## 화면 역할

- 홈은 제품의 진입점이자 세 가지 핵심 기능을 요약해서 보여주는 허브다.
- 해커톤 목록은 탐색 경험을 담당한다.
- 해커톤 상세는 정보 확인, 팀 모집, 제출, 리더보드를 하나로 연결하는 중심 화면이다.
- 캠프는 팀 빌딩 기능을 별도 화면으로 분리해 독립적으로 보여준다.
- 랭킹은 결과 가시화를 담당한다.

## 해커톤 상세 고정 섹션

해커톤 상세는 아래 8개 섹션을 완성 기준으로 본다.

1. Overview
2. Info / Notice
3. Eval
4. Schedule
5. Prize
6. Teams
7. Submit
8. Leaderboard

## 페이지 간 연결 규칙

- 홈 CTA는 각각 `/hackathons`, `/camp`, `/rankings` 로 이동한다.
- 해커톤 목록 카드는 `/hackathons/[slug]` 로 이동한다.
- 상세의 Teams 섹션은 `/camp?hackathon={slug}` 로 연결된다.
- 모든 앱 내부 페이지는 같은 상단 내비게이션 구조를 공유한다.
