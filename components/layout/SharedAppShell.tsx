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
    <div className="min-h-screen bg-surface-muted flex flex-col font-sans selection:bg-primary-subtle selection:text-primary-content">
      <header className="sticky top-0 z-40 w-full border-b border-border-base bg-surface-base/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 max-w-7xl mx-auto items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary-base flex items-center justify-center text-white">H</div>
            <span className="hidden md:inline-block">HackPlatform</span>
          </Link>
          <nav className="ml-8 flex gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center h-16 border-b-2 transition-colors",
                    isActive
                      ? "border-primary-base text-primary-base"
                      : "border-transparent text-content-muted hover:text-content-base hover:border-border-strong"
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
      <main className="flex-1 w-full animate-fade-in">{children}</main>
    </div>
  );
}
