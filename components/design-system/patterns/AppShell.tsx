import * as React from "react";
import { cn } from "@/lib/cn";

export function AppShell({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-h-screen bg-surface-muted flex flex-col", className)}>
      <header className="sticky top-0 z-40 w-full border-b border-border-base bg-surface-base shadow-sm">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded bg-primary-base text-white flex items-center justify-center">
              D
            </div>
            <span className="text-content-base">Design System</span>
          </div>
          <nav className="ml-auto flex gap-4 text-sm text-content-subtle">
            <span className="text-primary-base font-medium border-b-2 border-primary-base pb-5 pt-5">Components</span>
            <span className="pb-5 pt-5 hover:text-content-base cursor-pointer transition-colors duration-200">Documentation</span>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
