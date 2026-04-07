import { SlideShell } from '../components/SlideShell';
import { Eye, Edit3, ArrowRight, Save, Globe } from 'lucide-react';

export function Slide06() {
  return (
    <SlideShell title="아키텍처: 데이터 흐름 (Read & Write)" subtitle="백엔드 없이 브라우저 로컬 스토리지와 정적 데이터를 결합한 상태 관리" step="04 / 아키텍처 (데이터 흐름)">
      <div className="flex flex-col h-[480px] gap-8 justify-center">
        
        {/* Read Path */}
        <div className="rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-sm flex items-center gap-10 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-500" />
          
          <div className="flex flex-col items-center justify-center min-w-[140px] pl-4">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Eye size={40} strokeWidth={1.5} />
            </div>
            <span className="font-bold text-xl text-slate-800">읽기 (Read)</span>
          </div>

          <div className="flex-1 flex items-center justify-between px-4">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 w-[240px] text-center shadow-sm">
              <Globe className="w-8 h-8 text-slate-400 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-bold text-lg text-slate-700">공개 시드 데이터</p>
            </div>
            <ArrowRight className="text-slate-300 w-10 h-10" />
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 w-[240px] text-center shadow-sm">
              <p className="font-bold text-lg text-slate-700">lib/data 정규화</p>
              <p className="text-sm font-medium text-slate-500 mt-2">일관된 UI 형태 반환</p>
            </div>
            <ArrowRight className="text-blue-300 w-10 h-10" />
            <div className="bg-blue-600 rounded-3xl p-6 w-[240px] text-center text-white shadow-xl shadow-blue-600/20">
              <p className="font-bold text-lg">UI 렌더링</p>
              <p className="text-sm font-medium text-blue-200 mt-2">모두에게 공개</p>
            </div>
          </div>
        </div>

        {/* Write Path */}
        <div className="rounded-[2.5rem] border border-indigo-100 bg-white p-8 shadow-sm flex items-center gap-10 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-indigo-500" />
          
          <div className="flex flex-col items-center justify-center min-w-[140px] pl-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Edit3 size={40} strokeWidth={1.5} />
            </div>
            <span className="font-bold text-xl text-slate-800">쓰기 (Write)</span>
          </div>

          <div className="flex-1 flex items-center justify-between px-4">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 w-[240px] text-center shadow-sm">
              <p className="font-bold text-lg text-slate-700">사용자 액션</p>
              <p className="text-sm font-medium text-slate-500 mt-2">임시저장, 팀 모집</p>
            </div>
            <ArrowRight className="text-slate-300 w-10 h-10" />
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 w-[240px] text-center shadow-sm">
              <Save className="w-8 h-8 text-slate-400 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-bold text-lg text-slate-700">로컬 스토리지</p>
            </div>
            <ArrowRight className="text-indigo-300 w-10 h-10" />
            <div className="bg-indigo-600 rounded-3xl p-6 w-[240px] text-center text-white shadow-xl shadow-indigo-600/20">
              <p className="font-bold text-lg">랭킹 및 프로필 갱신</p>
              <p className="text-sm font-medium text-indigo-200 mt-2">UI 개인화 즉시 반영</p>
            </div>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}
