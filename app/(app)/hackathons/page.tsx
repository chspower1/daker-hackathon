"use client";

import { HackathonList } from "@/components/hackathons/HackathonList";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function HackathonsPage() {
  const { dict } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-10 shadow-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 opacity-[0.04] filter blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.03),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm mb-1">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {dict.nav?.discover || "Discover"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {dict.appPages?.hackathonsTitle || "Hackathons"}
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl">
            {dict.appPages?.hackathonsDesc || "Discover and join upcoming events."}
          </p>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 md:px-6 py-8 relative z-10">
        <HackathonList />
      </div>
    </div>
  );
}
