import { SlideShell } from '../components/SlideShell';
import { Hexagon, Layers, Zap, Code2, Paintbrush } from 'lucide-react';

export function Slide04() {
  return (
    <SlideShell title="기술 스택 (Tech Stack)" subtitle="최신 프론트엔드 생태계를 활용한 빠르고 가벼운 프로토타입 환경" step="03 / 기술 스택">
      <div className="grid grid-cols-5 gap-6 h-[480px] items-center">
        {[
          { icon: Layers, name: 'Next.js 16', label: 'App Router' },
          { icon: Hexagon, name: 'React 19', label: 'UI Library' },
          { icon: Code2, name: 'TypeScript 5', label: 'Type Safety' },
          { icon: Paintbrush, name: 'Tailwind 4', label: 'Styling' },
          { icon: Zap, name: 'ESLint 9', label: 'Linting' }
        ].map((tech) => (
          <div 
            key={tech.name} 
            className="glass-panel flex flex-col items-center justify-center text-center p-6 rounded-[2rem] premium-shadow hover:-translate-y-2 transition-transform duration-500 h-[320px] group"
          >
            <div className="w-20 h-20 mb-8 rounded-2xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center text-slate-700 group-hover:text-slate-900 transition-colors">
              <tech.icon className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-3 text-slate-900">{tech.name}</h3>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">{tech.label}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
