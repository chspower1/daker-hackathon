"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

interface TopHeaderProps {
  variant?: "landing" | "app";
  rightSlot?: React.ReactNode;
}

export function TopHeader({ variant = "app", rightSlot }: TopHeaderProps) {
  const { dict } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { href: "/hackathons", label: dict.nav.discover },
    { href: "/camp", label: dict.nav.teams },
    { href: "/rankings", label: dict.nav.rankings },
  ];

  return (
    <header className={cn(
      "w-full z-50 border-b-2 border-content-base bg-[#f4f4f0]/95 backdrop-blur-md flex flex-col",
      variant === "landing" ? "fixed top-0" : "sticky top-0"
    )}>
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-3 md:gap-4 font-black text-2xl md:text-3xl tracking-tighter uppercase shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-content-base flex items-center justify-center text-[#f4f4f0] shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] md:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] text-xl md:text-2xl">H</div>
            <span className="hidden sm:inline-block">HackPlatform</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-sm lg:text-base font-black uppercase tracking-widest text-content-base">
            {navItems.map((item) => {
              const isActive = variant === "app" && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "cursor-pointer transition-colors decoration-4 underline-offset-8 whitespace-nowrap",
                    isActive
                      ? "text-primary-base underline"
                      : "hover:text-primary-base hover:underline"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <LanguageSwitcher />
          {rightSlot}
        </div>
      </div>
      
      <div className="md:hidden w-full border-t-2 border-content-base bg-[#f4f4f0]">
        <nav className="flex overflow-x-auto px-4 h-12 items-center gap-6 text-xs font-black uppercase tracking-widest text-content-base no-scrollbar">
          {navItems.map((item) => {
            const isActive = variant === "app" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "cursor-pointer transition-colors decoration-2 underline-offset-4 whitespace-nowrap shrink-0",
                  isActive
                    ? "text-primary-base underline"
                    : "hover:text-primary-base hover:underline"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
