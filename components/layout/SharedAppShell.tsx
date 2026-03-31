"use client";

import { useEffect } from "react";
import { bootstrapStorage } from "@/lib/storage/bootstrap";
import { TopHeader } from "@/components/layout/TopHeader";
import { HeaderAuth } from "@/components/layout/HeaderAuth";

export function SharedAppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    bootstrapStorage();
  }, []);

  return (
    <div className="min-h-screen bg-surface-base text-content-base flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-x-clip relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)]"></div>
      <div className="fixed top-[-10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>
      <div className="fixed top-[-10%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopHeader variant="app" rightSlot={<HeaderAuth />} />
        <main className="flex-1 w-full animate-fade-in relative">
          {children}
        </main>
      </div>
    </div>
  );
}
