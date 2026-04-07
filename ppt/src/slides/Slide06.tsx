import { SlideShell } from '../components/SlideShell';
import { XCircle, ArrowRight } from 'lucide-react';

export function Slide06() {
  return (
    <SlideShell title="요약 및 제외 범위" subtitle="이번 이터레이션의 범위 한계" step="05 / 결론">
      <div className="grid grid-cols-2 gap-12 h-[500px]">
        {/* Exclusions */}
        <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <XCircle className="text-red-500 w-8 h-8" />
            <h3 className="text-3xl font-bold text-slate-950">개발 범위 제외 (Out of Scope)</h3>
          </div>
          <ul className="space-y-6 text-lg text-slate-600">
            <li className="flex gap-4"><span className="text-red-400 mt-1">×</span> 실시간 채팅 연동</li>
            <li className="flex gap-4"><span className="text-red-400 mt-1">×</span> 실제 백엔드 데이터베이스 (Postgres 등)</li>
            <li className="flex gap-4"><span className="text-red-400 mt-1">×</span> 상용 수준의 인증 (OAuth / JWT)</li>
            <li className="flex gap-4"><span className="text-red-400 mt-1">×</span> UI 폼에서의 개인정보(PII) 수집</li>
          </ul>
        </div>

        {/* Summary */}
        <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-6">핵심 제품 흐름 검증 완료</h3>
            <p className="text-xl text-blue-100 leading-relaxed">
              HackPlatform은 탐색, 팀 구성, 결과물 제출, 리더보드 반영, 글로벌 랭킹 조회에 이르는 공개 해커톤의 엔드투엔드 여정을 문서 주도형 프론트엔드 프로토타입으로 증명합니다.
            </p>
          </div>
          <div className="flex items-center gap-4 font-bold text-xl">
            <ArrowRight className="w-8 h-8 text-blue-200" />
            검증 및 다음 이터레이션 준비 완료
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
