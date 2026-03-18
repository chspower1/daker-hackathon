# DOCS DOMAIN

## OVERVIEW

`docs/` 는 프로젝트 완료 시점 기준의 제품 문서 저장소다.
구현 중간 산출물이나 병렬 작업 문서는 두지 않고, 서비스 이해와 유지보수에 필요한 최종 정보만 보관한다.

## STRUCTURE

```text
docs/
├── AGENTS.md              # docs 작업 규칙
├── index.md               # 문서 허브
├── service-overview.md    # 서비스 목적, 범위, 제외 범위
├── page-structure.md      # 라우트와 화면 구성
├── system-structure.md    # 레이어, 데이터, i18n, 저장 구조
├── core-features.md       # 화면/기능별 동작 명세
├── user-flows.md          # 주요 사용자 흐름
├── improvement-plan.md    # 후속 개선 계획
└── requirements/          # 해커톤 요구사항 원본, 수정 금지
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| service scope | `service-overview.md` | 제품 정의, 핵심 범위, 제외 범위 |
| routes and pages | `page-structure.md` | 실제 라우트와 화면 책임 |
| runtime architecture | `system-structure.md` | app, components, lib, storage, i18n 구조 |
| feature behavior | `core-features.md` | 기능별 규칙과 상태 처리 |
| user journeys | `user-flows.md` | 핵심 탐색/작성/제출 흐름 |
| future work | `improvement-plan.md` | 차기 개선 방향 |
| source assets | `requirements/예시자료/`, `requirements/*.png` | 원본 입력 자료, 수정 금지 |

## CONVENTIONS

- 문서는 한국어 중심으로 작성하되 코드 식별자, 라우트, 타입, 저장 키는 실제 값 그대로 유지한다.
- 범위가 바뀌면 `service-overview.md`를 먼저 갱신한다.
- 라우트나 페이지 책임이 바뀌면 `page-structure.md`와 `core-features.md`를 함께 갱신한다.
- `localStorage`, 시드 데이터, i18n, 메타데이터, 공개/비공개 노출 규칙이 바뀌면 `system-structure.md`와 `core-features.md`를 함께 갱신한다.
- 흐름이나 제품 방향이 바뀌면 `user-flows.md`와 `improvement-plan.md`를 같이 점검한다.
- `docs/requirements/` 는 원본 요구사항 보관용이므로 이 폴더 내부 파일은 수정하지 않는다.

## ANTI-PATTERNS

- 삭제된 구 문서 구조(`common/`, `features/`, `workstreams/`)를 다시 되살리지 않는다.
- 같은 계약을 여러 파일에 길게 중복 서술하지 않는다.
- i18n, storage, 공개 데이터 규칙을 코드와 다르게 문서화하지 않는다.
- 원본 요구사항 파일을 완성 문서처럼 직접 편집하지 않는다.

## VERIFY

- 구조 변경 후 `docs/index.md` 링크를 다시 확인한다.
- 문서 변경이 코드 계약에 닿으면 `app/`, `lib/storage/`, `lib/i18n/`와 일치하는지 교차 확인한다.
- 삭제한 문서를 참조하는 남은 파일이 없는지 검색한다.
