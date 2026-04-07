import { SlideShell } from '../components/SlideShell';

export function Slide04() {
  return (
    <SlideShell title="아키텍처 및 데이터 흐름" subtitle="문서 주도형 읽기 경로, 스토리지 기반 쓰기 경로, 명확한 런타임 경계" step="03 / 아키텍처">
      <div className="grid h-[480px] grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-8">
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-blue-600">단일 진실 공급원 (SOURCE OF TRUTH)</div>
          <h4 className="mt-3 text-2xl font-bold">문서 + 시드 JSON</h4>
          <p className="mt-3 text-sm font-mono text-slate-500">docs/service-overview.md</p>
          <p className="text-sm font-mono text-slate-500">docs/system-structure.md</p>
          <p className="text-sm font-mono text-slate-500">docs/requirements/예시자료/</p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">제품 범위, 런타임 규약, 공개 읽기 데이터는 UI에 도달하기 전 문서에서 정의됩니다.</p>
        </div>
        <div className="text-3xl font-black text-blue-500">→</div>
        <div className="rounded-3xl border border-blue-600 bg-blue-600 p-6 text-white shadow-xl shadow-blue-600/20">
          <div className="text-sm font-bold text-blue-100">정규화 및 영구 저장 (NORMALIZE + PERSIST)</div>
          <h4 className="mt-3 text-2xl font-bold">lib/data + lib/storage</h4>
          <p className="mt-3 text-sm font-mono text-blue-100">복구 · 초기화(bootstrap) · 쓰기 헬퍼</p>
          <p className="mt-4 text-base leading-relaxed text-blue-100">시드 데이터는 UI용으로 정규화되며, localStorage를 통해 프로필, 팀, 결과물, 리더보드 및 랭킹을 일관되게 유지합니다.</p>
        </div>
        <div className="text-3xl font-black text-blue-500">→</div>
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-blue-600">라우트 및 뷰 (ROUTE + VIEW)</div>
          <h4 className="mt-3 text-2xl font-bold">app + components</h4>
          <p className="mt-3 text-sm font-mono text-slate-500">가벼운 라우트 · 공통 셸 · 디자인 시스템</p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">라우트 파일은 가볍게 유지되고, 기능 화면과 디자인 시스템 요소가 조합되어 실제 제품 경험을 구성합니다.</p>
        </div>
        <div className="text-3xl font-black text-blue-500">→</div>
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-blue-600">사용자 효과 (USER EFFECT)</div>
          <h4 className="mt-3 text-2xl font-bold">읽고 쓰는 프로토타입</h4>
          <p className="mt-4 text-base leading-relaxed text-slate-600">누구나 공개 데이터를 읽을 수 있고, 쓰기 흐름은 로컬 프로필로 제어되어 UI에 즉시 반영됩니다.</p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">로케일(Locale)과 테마는 페이지 콘텐츠 마운트 전, 루트 레이아웃 + 프로바이더를 통해 복구됩니다.</div>
        </div>
      </div>
    </SlideShell>
  );
}
