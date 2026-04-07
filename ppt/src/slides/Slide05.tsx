import { SlideShell } from '../components/SlideShell';
import { FileText, Database, LayoutTemplate, ArrowRight } from 'lucide-react';

export function Slide05() {
  return (
    <SlideShell title="아키텍처: 문서 주도형(Docs-Driven) 구조" subtitle="기획 문서가 시스템의 기준이 되는 3계층 아키텍처" step="04 / 아키텍처 (구조)">
      <div className="flex h-[480px] items-center justify-center gap-6 mt-4">
        
        {/* Layer 1: Docs */}
        <div className="flex-1 rounded-[2rem] glass-panel p-8 premium-shadow flex flex-col items-center text-center h-[380px] relative group hover:-translate-y-1 transition-transform duration-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-100/50 border border-slate-200/60 text-slate-700 flex items-center justify-center mb-6">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div className="text-xs font-mono tracking-widest text-slate-400 mb-3 uppercase">단일 진실 공급원</div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">1. 문서 & 시드 (docs/)</h3>
          <p className="text-slate-500 font-light leading-relaxed mb-8 text-sm">제품 범위, 런타임 규약, 공개 데이터</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-slate-50/50 px-4 py-3 text-xs font-mono text-slate-500 border border-slate-200/60">docs/service-overview.md</div>
            <div className="rounded-xl bg-slate-50/50 px-4 py-3 text-xs font-mono text-slate-500 border border-slate-200/60">docs/requirements/예시자료/</div>
          </div>
        </div>

        <ArrowRight className="text-slate-300 w-8 h-8 shrink-0" strokeWidth={1.5} />

        {/* Layer 2: Runtime */}
        <div className="flex-1 rounded-[2rem] glass-panel border-slate-300 bg-white/40 p-8 premium-shadow flex flex-col items-center text-center h-[380px] relative group hover:-translate-y-1 transition-transform duration-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-6 shadow-lg shadow-slate-900/10">
            <Database size={28} strokeWidth={1.5} />
          </div>
          <div className="text-xs font-mono tracking-widest text-slate-500 mb-3 uppercase">정규화 및 영구 저장</div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">2. 런타임 레이어 (lib/)</h3>
          <p className="text-slate-500 font-light leading-relaxed mb-8 text-sm">정규화 로직, 스토리지 기반 쓰기, 다국어 처리</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-white/80 px-4 py-3 text-xs font-mono text-slate-600 border border-slate-200/60 shadow-sm">lib/data (정규화)</div>
            <div className="rounded-xl bg-white/80 px-4 py-3 text-xs font-mono text-slate-600 border border-slate-200/60 shadow-sm">lib/storage (스토리지)</div>
          </div>
        </div>

        <ArrowRight className="text-slate-300 w-8 h-8 shrink-0" strokeWidth={1.5} />

        {/* Layer 3: UI */}
        <div className="flex-1 rounded-[2rem] glass-panel p-8 premium-shadow flex flex-col items-center text-center h-[380px] relative group hover:-translate-y-1 transition-transform duration-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-100/50 border border-slate-200/60 text-slate-700 flex items-center justify-center mb-6">
            <LayoutTemplate size={28} strokeWidth={1.5} />
          </div>
          <div className="text-xs font-mono tracking-widest text-slate-400 mb-3 uppercase">라우트 및 뷰</div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">3. 뷰 레이어 (app/)</h3>
          <p className="text-slate-500 font-light leading-relaxed mb-8 text-sm">가벼운 라우트 셸과 공통 디자인 시스템의 조합</p>
          <div className="mt-auto flex flex-col gap-3 w-full">
            <div className="rounded-xl bg-slate-50/50 px-4 py-3 text-xs font-mono text-slate-500 border border-slate-200/60">app/(app)/layout.tsx</div>
            <div className="rounded-xl bg-slate-50/50 px-4 py-3 text-xs font-mono text-slate-500 border border-slate-200/60">components/design-system/</div>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}
