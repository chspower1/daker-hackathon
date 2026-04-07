import { SlideShell } from '../components/SlideShell';
import { Layers, PanelsTopLeft, Waypoints } from 'lucide-react';

export function Slide03() {
  return (
    <SlideShell title="제품 화면 및 런타임 셸" subtitle="라우트(Route)는 가볍게 유지하고, 공통 런타임 레이어가 일관된 동작을 보장합니다" step="02 / 화면 구성">
      <div className="grid grid-cols-[1.2fr_0.95fr] gap-10 h-[470px] items-stretch">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PanelsTopLeft size={24} />
            </div>
            <div className="text-sm font-bold tracking-[0.16em] text-blue-600">/</div>
            <h3 className="mt-3 text-2xl font-bold">랜딩 페이지</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">서비스의 핵심 기능과 4개의 주요 제품 화면을 소개합니다.</p>
          </div>
          <div className="rounded-3xl border border-blue-600 bg-white p-6 shadow-lg shadow-blue-600/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Waypoints size={24} />
            </div>
            <div className="text-sm font-bold tracking-[0.16em] text-blue-600">/hackathons + /hackathons/[slug]</div>
            <h3 className="mt-3 text-2xl font-bold">탐색 및 상세 정보</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">검색 및 다중 필터를 지원하는 목록과, 개요, 팀, 제출, 리더보드 섹션을 포함한 상세 페이지를 제공합니다.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold tracking-[0.16em] text-slate-500">/camp</div>
            <h3 className="mt-3 text-2xl font-bold">팀 구성</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">캠프(Camp)는 로컬 스토리지에 모집글을 보관하며, 필터링된 탐색 및 작성 흐름을 제공합니다.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold tracking-[0.16em] text-slate-500">/rankings</div>
            <h3 className="mt-3 text-2xl font-bold">공개 결과</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">글로벌 랭킹은 읽기 전용으로 유지되며, 프로필 수정에 종속되지 않고 영구 저장된 랭킹 스토어에서 갱신됩니다.</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.32),transparent_45%)]" />
          <div className="relative z-10 flex h-full flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold tracking-[0.18em] text-blue-300">
              <Layers className="h-4 w-4" /> 런타임 스택 (RUNTIME STACK)
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold tracking-[0.18em] text-blue-300">최상위 레이아웃 및 프로바이더</div>
              <p className="mt-3 text-lg font-semibold">쿠키 기반 로케일, 테마 초기화, ThemeProvider, I18nProvider</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold tracking-[0.18em] text-blue-300">공통 앱 셸 (SHARED APP SHELL)</div>
              <p className="mt-3 text-lg font-semibold">bootstrapStorage, TopHeader, HeaderAuth, ToastProvider</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-bold tracking-[0.18em] text-blue-300">페이지 기능 (PAGE FEATURES)</div>
              <p className="mt-3 text-lg font-semibold">필터, 섹션 목차(TOC), 임시저장/최종 제출, 리더보드 및 랭킹 갱신</p>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
