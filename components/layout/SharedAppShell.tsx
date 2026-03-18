"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { bootstrapStorage } from "@/lib/storage/bootstrap";

export function SharedAppShell({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    bootstrapStorage();
  }, []);

  const navItems = [
    { href: "/hackathons", label: dict.appNav?.hackathons || "Hackathons" },
    { href: "/camp", label: dict.appNav?.camp || "Camp" },
    { href: "/rankings", label: dict.appNav?.rankings || "Rankings" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col font-sans selection:bg-primary-base selection:text-white">
      <header className="sticky top-0 z-40 w-full border-b-4 border-content-base bg-[#f4f4f0]/95 backdrop-blur-md">
        <div className="flex h-20 max-w-[1400px] mx-auto items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-4 font-black text-2xl tracking-tighter uppercase">
            <div className="w-10 h-10 bg-content-base flex items-center justify-center text-[#f4f4f0] shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] text-xl">H</div>
            <span className="hidden md:inline-block">HackPlatform</span>
          </Link>
          <nav className="ml-12 flex gap-8 text-base font-black uppercase tracking-widest text-content-base">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center h-20 transition-colors hover:text-primary-base hover:underline decoration-4 underline-offset-8",
                    isActive
                      ? "text-primary-base underline decoration-4 underline-offset-8"
                      : "text-content-base"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full animate-fade-in relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50 h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/200/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        {children}
      </main>
    </div>
  );
}
