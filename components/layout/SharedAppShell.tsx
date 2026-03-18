"use client";

import { useEffect } from "react";
import { bootstrapStorage } from "@/lib/storage/bootstrap";
import { TopHeader } from "@/components/layout/TopHeader";

export function SharedAppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    bootstrapStorage();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col font-sans selection:bg-primary-base selection:text-white">
      <TopHeader variant="app" />
      <main className="flex-1 w-full animate-fade-in relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50 h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/200/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        {children}
      </main>
    </div>
  );
}
