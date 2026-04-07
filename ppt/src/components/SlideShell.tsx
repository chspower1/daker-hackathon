import React from 'react';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../deck';

export interface SlideProps {
  title?: string;
  subtitle?: string;
  step?: string;
  children: React.ReactNode;
  centered?: boolean;
}

export function SlideShell({ title, subtitle, step, children, centered = false }: SlideProps) {
  return (
    <div
      className="slide-container bg-white text-slate-950 relative overflow-hidden flex flex-col shadow-2xl"
      style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full mix-blend-multiply blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full mix-blend-multiply blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col p-16">
        {(title || subtitle || step) && (
          <header className="mb-12 flex flex-col gap-4 animate-fade-in">
            {step && (
              <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-widest uppercase self-start">
                {step}
              </div>
            )}
            <div>
              {title && <h1 className="text-5xl font-bold tracking-tight text-slate-950">{title}</h1>}
              {subtitle && <h2 className="text-2xl font-medium text-slate-600 mt-2">{subtitle}</h2>}
            </div>
          </header>
        )}

        <main className={`flex-1 w-full animate-fade-in ${centered ? 'flex flex-col items-center justify-center text-center' : ''}`} style={{ animationDelay: '0.2s' }}>
          {children}
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-0 left-0 right-0 h-16 flex items-center px-16 border-t border-slate-200 bg-white/80 backdrop-blur-sm z-20 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600" />
          <span className="font-bold tracking-tight text-slate-950">HackPlatform</span>
        </div>
        <div className="text-sm text-slate-500 font-mono">2026. 04</div>
      </footer>
    </div>
  );
}
