import { SlideShell } from '../components/SlideShell';
import { Layers } from 'lucide-react';

export function Slide01() {
  return (
    <SlideShell centered>
      <div className="flex flex-col items-center justify-center h-full gap-8 max-w-5xl">
        <div className="w-24 h-24 glass-panel rounded-3xl flex items-center justify-center premium-shadow mb-8 animate-float">
          <Layers className="text-slate-800 w-10 h-10" strokeWidth={1.5} />
        </div>
        <h1 className="text-[7rem] font-extrabold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 pb-4 print-safe-title">
          HackPlatform
        </h1>
        <p className="text-2xl text-slate-500 max-w-3xl leading-relaxed font-light">
          해커톤 탐색, 팀 구성, 결과물 제출, 랭킹 조회를 하나의 흐름으로 연결하는 문서 주도형(docs-driven) 프론트엔드 프로토타입입니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-mono tracking-[0.2em] text-slate-400">
          <span className="rounded-md glass-panel px-4 py-2 uppercase">/hackathons</span>
          <span className="rounded-md glass-panel px-4 py-2 uppercase">/hackathons/[slug]</span>
          <span className="rounded-md glass-panel px-4 py-2 uppercase">/camp</span>
          <span className="rounded-md glass-panel px-4 py-2 uppercase">/rankings</span>
        </div>
        <div className="mt-10 flex gap-4">
          <span className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium tracking-widest text-sm premium-shadow">프로토타입</span>
          <span className="px-8 py-3 rounded-full glass-panel text-slate-600 font-medium tracking-widest text-sm">프론트엔드 전용</span>
        </div>
      </div>
    </SlideShell>
  );
}
