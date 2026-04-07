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
      className="slide-container bg-slate-50 text-slate-900 relative overflow-hidden flex flex-col premium-shadow"
      style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-slate-200/40 rounded-full mix-blend-multiply blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-slate-300/30 rounded-full mix-blend-multiply blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />

      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col p-16">
        {(title || subtitle || step) && (
          <header className="mb-12 flex flex-col gap-4 animate-fade-in">
            {step && (
              <div className="inline-flex px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-mono font-medium tracking-[0.2em] uppercase self-start">
                {step}
              </div>
            )}
            <div>
              {title && <h1 className="text-[2.75rem] font-bold tracking-tight text-slate-900 leading-tight">{title}</h1>}
              {subtitle && <h2 className="text-xl font-medium text-slate-500 mt-2 tracking-wide">{subtitle}</h2>}
            </div>
          </header>
        )}

        <main className={`flex-1 w-full animate-fade-in ${centered ? 'flex flex-col items-center justify-center text-center' : ''}`} style={{ animationDelay: '0.1s' }}>
          {children}
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-0 left-0 right-0 h-16 flex items-center px-16 border-t border-slate-200/60 bg-white/50 backdrop-blur-md z-20 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-900" />
          <span className="font-semibold tracking-wide text-sm text-slate-900">HackPlatform</span>
        </div>
        <div className="text-xs text-slate-400 font-mono tracking-widest">2026. 04</div>
      </footer>
    </div>
  );
}
