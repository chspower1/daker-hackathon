import { SlideShell } from '../components/SlideShell';
import { Layers } from 'lucide-react';

export function Slide01() {
  return (
    <SlideShell centered>
      <div className="flex flex-col items-center justify-center h-full gap-8 max-w-5xl">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-blue-600/20 shadow-2xl mb-8 animate-float">
          <Layers className="text-white w-12 h-12" />
        </div>
        <h1 className="text-[6.5rem] font-bold tracking-tight leading-none">
          HackPlatform
        </h1>
        <p className="text-3xl text-slate-600 max-w-4xl leading-snug">
          해커톤 탐색, 팀 구성, 결과물 제출, 랭킹 조회를 하나의 흐름으로 연결하는 문서 주도형(docs-driven) 프론트엔드 프로토타입입니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold tracking-[0.18em] text-slate-600">
          <span className="rounded-full border border-slate-300 px-4 py-2">/hackathons</span>
          <span className="rounded-full border border-slate-300 px-4 py-2">/hackathons/[slug]</span>
          <span className="rounded-full border border-slate-300 px-4 py-2">/camp</span>
          <span className="rounded-full border border-slate-300 px-4 py-2">/rankings</span>
        </div>
        <div className="mt-8 flex gap-4">
          <span className="px-6 py-2 rounded-full bg-blue-50 text-blue-600 font-bold tracking-wider text-sm">프로토타입</span>
          <span className="px-6 py-2 rounded-full border border-slate-300 text-slate-600 font-bold tracking-wider text-sm">프론트엔드 전용</span>
        </div>
      </div>
    </SlideShell>
  );
}
