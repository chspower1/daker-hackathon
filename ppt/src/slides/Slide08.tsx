import { SlideShell } from '../components/SlideShell';
import { XCircle, ArrowRight } from 'lucide-react';

export function Slide08() {
  return (
    <SlideShell title="요약 및 제외 범위" subtitle="이번 이터레이션의 범위 한계" step="06 / 결론">
      <div className="grid grid-cols-2 gap-10 h-[500px] mt-4">
        {/* Exclusions */}
        <div className="glass-panel rounded-3xl p-10 premium-shadow">
          <div className="flex items-center gap-4 mb-10">
            <XCircle className="text-slate-400 w-8 h-8" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">개발 범위 제외 (Out of Scope)</h3>
          </div>
          <ul className="space-y-6 text-base text-slate-600 font-light">
            <li className="flex gap-4 items-center"><span className="text-slate-300 text-xl font-mono">×</span> 실시간 채팅 연동</li>
            <li className="flex gap-4 items-center"><span className="text-slate-300 text-xl font-mono">×</span> 실제 백엔드 데이터베이스 (Postgres 등)</li>
            <li className="flex gap-4 items-center"><span className="text-slate-300 text-xl font-mono">×</span> 상용 수준의 인증 (OAuth / JWT)</li>
            <li className="flex gap-4 items-center"><span className="text-slate-300 text-xl font-mono">×</span> UI 폼에서의 개인정보(PII) 수집</li>
          </ul>
        </div>

        {/* Summary */}
        <div className="bg-slate-900 rounded-3xl p-10 text-white premium-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-20%] w-[100%] h-[100%] bg-slate-800 rounded-full mix-blend-overlay blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6 tracking-tight">핵심 제품 흐름 검증 완료</h3>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              HackPlatform은 탐색, 팀 구성, 결과물 제출, 리더보드 반영, 글로벌 랭킹 조회에 이르는 공개 해커톤의 엔드투엔드 여정을 문서 주도형 프론트엔드 프로토타입으로 증명합니다.
            </p>
          </div>
          <div className="flex items-center gap-4 font-semibold text-lg text-white relative z-10">
            <ArrowRight className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
            검증 및 다음 이터레이션 준비 완료
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
