"use client";

import { useEffect } from "react";
import { bootstrapStorage } from "@/lib/storage/bootstrap";
import { TopHeader } from "@/components/layout/TopHeader";

export function SharedAppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    bootstrapStorage();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)]"></div>
      <div className="fixed top-[-10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      <div className="fixed top-[-10%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopHeader variant="app" />
        <main className="flex-1 w-full animate-fade-in relative">
          {children}
        </main>
      </div>
    </div>
  );
}
