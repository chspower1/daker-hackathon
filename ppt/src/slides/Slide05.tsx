import { SlideShell } from '../components/SlideShell';
import { FileText, Database, LayoutTemplate, ArrowRight } from 'lucide-react';

export function Slide05() {
  return (
    <SlideShell title="아키텍처: 문서 주도형(Docs-Driven) 구조" subtitle="기획 문서가 시스템의 기준이 되는 3계층 아키텍처" step="04 / 아키텍처 (구조)">
      <div className="flex h-[480px] items-center justify-center gap-6">
        
        {/* Layer 1: Docs */}
        <div className="flex-1 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center text-center h-[360px] relative group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center mb-6">
            <FileText size={40} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-bold text-slate-500 mb-2">단일 진실 공급원</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">1. 문서 & 시드 (docs/)</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">제품 범위, 런타임 규약, 공개 데이터</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-mono text-slate-500 border border-slate-100">docs/service-overview.md</div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-mono text-slate-500 border border-slate-100">docs/requirements/예시자료/</div>
          </div>
        </div>

        <ArrowRight className="text-slate-300 w-12 h-12 shrink-0" strokeWidth={1.5} />

        {/* Layer 2: Runtime */}
        <div className="flex-1 rounded-[2.5rem] border border-blue-200 bg-blue-50/50 p-8 shadow-lg flex flex-col items-center text-center h-[360px] relative group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
            <Database size={40} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-bold text-blue-600 mb-2">정규화 및 영구 저장</div>
          <h3 className="text-2xl font-bold text-blue-950 mb-4">2. 런타임 레이어 (lib/)</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">정규화 로직, 스토리지 기반 쓰기, 다국어 처리</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-white px-4 py-3 text-sm font-mono text-slate-600 border border-blue-100 shadow-sm">lib/data (정규화)</div>
            <div className="rounded-xl bg-white px-4 py-3 text-sm font-mono text-slate-600 border border-blue-100 shadow-sm">lib/storage (스토리지)</div>
          </div>
        </div>

        <ArrowRight className="text-slate-300 w-12 h-12 shrink-0" strokeWidth={1.5} />

        {/* Layer 3: UI */}
        <div className="flex-1 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center text-center h-[360px] relative group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-lg">
            <LayoutTemplate size={40} strokeWidth={1.5} />
          </div>
          <div className="text-sm font-bold text-slate-500 mb-2">라우트 및 뷰</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">3. 뷰 레이어 (app/)</h3>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">가벼운 라우트 셸과 공통 디자인 시스템의 조합</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-mono text-slate-500 border border-slate-100">app/(app)/layout.tsx</div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-mono text-slate-500 border border-slate-100">components/design-system/</div>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}
