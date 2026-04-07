import { SlideShell } from '../components/SlideShell';
import { Hexagon, Layers, Zap, Code2, Paintbrush } from 'lucide-react';

export function Slide04() {
  return (
    <SlideShell title="기술 스택 (Tech Stack)" subtitle="최신 프론트엔드 생태계를 활용한 빠르고 가벼운 프로토타입 환경" step="03 / 기술 스택">
      <div className="grid grid-cols-5 gap-6 h-[480px] items-center">
        {[
          { icon: Layers, name: 'Next.js 16', label: 'App Router', color: 'bg-slate-50 text-slate-800 border-slate-200', delay: '0ms' },
          { icon: Hexagon, name: 'React 19', label: 'UI Library', color: 'bg-sky-50 text-sky-600 border-sky-200', delay: '100ms' },
          { icon: Code2, name: 'TypeScript 5', label: 'Type Safety', color: 'bg-blue-50 text-blue-700 border-blue-200', delay: '200ms' },
          { icon: Paintbrush, name: 'Tailwind 4', label: 'Styling', color: 'bg-cyan-50 text-cyan-500 border-cyan-200', delay: '300ms' },
          { icon: Zap, name: 'ESLint 9', label: 'Linting', color: 'bg-purple-50 text-purple-600 border-purple-200', delay: '400ms' }
        ].map((tech) => (
          <div 
            key={tech.name} 
            className={`flex flex-col items-center justify-center text-center p-6 rounded-[2rem] border-2 shadow-xl hover:-translate-y-4 transition-transform duration-500 ${tech.color} h-[300px]`}
          >
            <tech.icon className="w-20 h-20 mb-8 opacity-90" strokeWidth={1.5} />
            <h3 className="text-2xl font-black tracking-tight mb-3">{tech.name}</h3>
            <p className="text-lg opacity-80 font-medium tracking-widest uppercase">{tech.label}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
