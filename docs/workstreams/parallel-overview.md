# 병렬 작업 공통 계약

이 문서는 `캠프`, `해커톤`, `랭킹` 트랙을 독립적으로 시작할 때만 읽으면 되는 최소 계약이다.

## 1. 병렬 작업 최소 계약

- 필수 읽기 공통: `docs/common/product-and-scope.md`, `docs/common/data-and-state.md`, `docs/common/acceptance.md`, `docs/common/implementation-architecture.md`
- 읽기 전용 확인: 기존 설계(라우팅/구조)와 충돌하지 않는지 비교 후 진행

## 2. 라우트 계약

작업 범위가 맞물리는 라우트만 공통 단일 출처로 고정한다.

- `/hackathons` : 해커톤 목록
- `/hackathons/[slug]` : 해커톤 상세
- `/camp` : 팀 모집 화면
- `/rankings` : 랭킹 화면
- `/` : 홈(진입 링크 점검용)

## 3. slug 사용 계약

- 해커톤 식별자는 `slug: string` 단일 키만 사용한다.
- 목록과 상세는 같은 slug를 사용해 연동한다.
- `/camp`의 해커톤 필터는 `hackathon` 쿼리로 전달한다.

## 4. localStorage 계약

고정 키는 다음 6개다.

- `localProfile`
- `hackathons`
- `teams`
- `submissions`
- `leaderboards`
- `rankings`

각 화면은 아래 원칙을 따른다.

- 읽기 화면은 `localProfile` 유무와 무관하게 동작해야 한다.
- 키가 비어 있으면 공통 데이터 시드로 복구한다.
- `rankings`는 랭킹 화면에서 읽기 전용 단일 출처로 사용한다.

## 5. 공개/비공개 노출 계약

- 공개 가능한 팀 정보와 제출 산출물만 표시한다.
- 내부 메모, 내부 식별자, 이메일, 실명/전화/인증정보는 렌더링하지 않는다.
- 팀/제출/리더보드 표시명은 로컬 스냅샷을 우선 사용한다.

## 6. 프로필 계약

- 브라우저당 하나의 `localProfile`만 유효하다.
- 프로필이 없으면 쓰기 동작 전에 생성/재사용 안내를 선행한다.
- 닉네임은 변경 가능하지만, 기존 팀/제출 표시명은 생성 시 스냅샷을 고정한다.

## 7. 트랙 인터페이스 계약

### 7.1 Hackathon -> Camp

- 상세 화면의 Teams CTA는 반드시 `/camp?hackathon={slug}`로 이동한다.
- `slug`는 URL 인코딩 값을 그대로 전달한다.

### 7.2 Camp -> Hackathon

- `/camp`는 `hackathon` 쿼리가 있으면 slug 필터만 적용한다.
- 쿼리가 비어 있으면 전체 목록을 노출한다.

### 7.3 Ranking 읽기 계약

- 랭킹은 `localStorage.rankings`만 읽는다.
- `localProfile` 생성/변경을 랭킹 표시와 자동 동기화하지 않는다.

## 8. 변경 절차

공유 계약 변경은 워크스트림만 수정해서는 안 된다.

1. 변경 제안이 생기면 `parallel-overview.md`와 함께 `docs/common/data-and-state.md`, `docs/common/product-and-scope.md`를 동시 수정한다.
2. 수정 범위가 `public interface` 또는 `localStorage` 키에 영향을 주면 `docs/workstreams/*.md`의 관련 섹션을 함께 갱신한다.
3. `docs/features/*`는 기존 의존성 링크만 정리해 새 진입점을 가리키도록 맞춘다.
4. `docs/planning.md`와 `docs/index.md`의 진입 순서를 최신 상태로 반영한다.

## 9. 병렬 시작 체크리스트

- `parallel-overview.md` 확인
- 본인 트랙 문서 확인
- 최소 공통 문서 2~3개만 더 확인
- 구현 전, 다른 트랙에서 요구한 인터페이스(라우트, 슬러그, 쿼리, localStorage 단일 출처)만 동의했는지 점검
