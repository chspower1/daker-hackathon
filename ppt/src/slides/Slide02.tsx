import { SlideShell } from '../components/SlideShell';
import { Search, Users, Code, Trophy } from 'lucide-react';

export function Slide02() {
  return (
    <SlideShell title="엔드투엔드(End-to-End) 흐름" subtitle="백엔드 없이 구현된 전체 사용자 여정" step="01 / 흐름">
      <div className="grid grid-cols-4 gap-6 h-[500px] mt-4">
        {[
          { icon: Search, title: '1. 탐색', desc: '검색 가능한 목록과 상세 뷰를 통해 일정, 규칙, 상금, 진행 상태를 비교합니다.' },
          { icon: Users, title: '2. 팀 구성', desc: '캠프(Camp) 게시글을 둘러보고, 모집 분야를 필터링하며, 로컬 프로필로 모집글을 작성합니다.' },
          { icon: Code, title: '3. 제출', desc: '먼저 임시저장을 한 뒤, 최종 제출로 전환하여 해커톤 리더보드에 반영합니다.' },
          { icon: Trophy, title: '4. 랭킹', desc: '해커톤 리더보드와 글로벌 랭킹 화면에서 공개된 결과와 순위를 확인합니다.' },
        ].map((item, i) => (
          <div key={item.title} className="glass-panel rounded-3xl p-8 premium-shadow flex flex-col gap-6 relative group hover:-translate-y-1 transition-transform duration-500">
            <div className="w-14 h-14 rounded-2xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center text-slate-800">
              <item.icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
              <p className="text-base text-slate-500 leading-relaxed font-light">{item.desc}</p>
            </div>
            {i !== 3 && (
              <div className="absolute top-14 right-[-1.5rem] w-6 border-t border-slate-300/60" />
            )}
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
