import { SlideShell } from '../components/SlideShell';
import { Eye, Edit3, ArrowRight, Save, Globe } from 'lucide-react';

export function Slide06() {
  return (
    <SlideShell title="아키텍처: 데이터 흐름 (Read & Write)" subtitle="백엔드 없이 브라우저 로컬 스토리지와 정적 데이터를 결합한 상태 관리" step="04 / 아키텍처 (데이터 흐름)">
      <div className="flex flex-col h-[480px] gap-8 justify-center mt-2">
        
        {/* Read Path */}
        <div className="rounded-[2rem] glass-panel p-8 premium-shadow flex items-center gap-10 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-300 to-slate-200" />
          
          <div className="flex flex-col items-center justify-center min-w-[140px] pl-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100/50 border border-slate-200/60 text-slate-700 flex items-center justify-center mb-4">
              <Eye size={28} strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-lg text-slate-800 tracking-tight">읽기 (Read)</span>
          </div>

          <div className="flex-1 flex items-center justify-between px-4">
            <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 w-[220px] text-center shadow-sm">
              <Globe className="w-6 h-6 text-slate-400 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-slate-800">공개 시드 데이터</p>
            </div>
            <ArrowRight className="text-slate-300 w-6 h-6" strokeWidth={1.5} />
            <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 w-[220px] text-center shadow-sm">
              <p className="font-semibold text-slate-800">lib/data 정규화</p>
              <p className="text-xs font-light text-slate-500 mt-2">일관된 UI 형태 반환</p>
            </div>
            <ArrowRight className="text-slate-400 w-6 h-6" strokeWidth={1.5} />
            <div className="bg-slate-800 rounded-2xl p-6 w-[220px] text-center text-white shadow-lg shadow-slate-900/10">
              <p className="font-semibold">UI 렌더링</p>
              <p className="text-xs font-light text-slate-300 mt-2">모두에게 공개</p>
            </div>
          </div>
        </div>

        {/* Write Path */}
        <div className="rounded-[2rem] glass-panel p-8 premium-shadow flex items-center gap-10 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-400 to-slate-300" />
          
          <div className="flex flex-col items-center justify-center min-w-[140px] pl-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100/50 border border-slate-200/60 text-slate-700 flex items-center justify-center mb-4">
              <Edit3 size={28} strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-lg text-slate-800 tracking-tight">쓰기 (Write)</span>
          </div>

          <div className="flex-1 flex items-center justify-between px-4">
            <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 w-[220px] text-center shadow-sm">
              <p className="font-semibold text-slate-800">사용자 액션</p>
              <p className="text-xs font-light text-slate-500 mt-2">임시저장, 팀 모집</p>
            </div>
            <ArrowRight className="text-slate-300 w-6 h-6" strokeWidth={1.5} />
            <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 w-[220px] text-center shadow-sm">
              <Save className="w-6 h-6 text-slate-400 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-slate-800">로컬 스토리지</p>
            </div>
            <ArrowRight className="text-slate-400 w-6 h-6" strokeWidth={1.5} />
            <div className="bg-slate-800 rounded-2xl p-6 w-[220px] text-center text-white shadow-lg shadow-slate-900/10">
              <p className="font-semibold">랭킹 및 프로필 갱신</p>
              <p className="text-xs font-light text-slate-300 mt-2">UI 개인화 즉시 반영</p>
            </div>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}
