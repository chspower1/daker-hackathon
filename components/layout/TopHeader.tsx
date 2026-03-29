"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

interface TopHeaderProps {
  variant?: "landing" | "app";
  rightSlot?: React.ReactNode;
}

export function TopHeader({ variant = "app", rightSlot }: TopHeaderProps) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/hackathons", label: dict.nav.discover },
    { href: "/camp", label: dict.nav.teams },
    { href: "/rankings", label: dict.nav.rankings },
  ];

  return (
    <header className={cn(
      "w-full z-50 transition-all duration-500 ease-in-out flex flex-col",
      variant === "landing" ? "fixed top-0" : "sticky top-0",
      isScrolled 
        ? "bg-surface-base/80 backdrop-blur-xl border-b border-border-base/50 shadow-sm py-1.5" 
        : "bg-transparent border-b-0 py-3"
    )}>
      <div className="max-w-[90rem] w-full mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight shrink-0 group">
            <div className="relative flex h-8 w-8 items-center justify-center">
              {/* Outer glowing ring */}
              <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-20 blur-md transition-all duration-500 group-hover:opacity-40 group-hover:blur-lg group-hover:bg-blue-400"></div>
              
              {/* Main geometric shape */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 shadow-sm transition-transform duration-500 group-hover:scale-[1.05] group-hover:rotate-3 group-hover:shadow-blue-500/50"></div>
              
              {/* Inner geometric accent */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-bl from-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              
              {/* Abstract icon (e.g. geometric 'H' / nodes) */}
              <svg aria-hidden="true" className="relative z-10 h-4 w-4 text-white transition-transform duration-500 group-hover:scale-95" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M12 4V20M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <path d="M7 8V16M17 8V16M7 12H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:opacity-0 transition-opacity duration-300" />
              </svg>
            </div>
            <div className="flex flex-col ml-1">
              <span className="hidden sm:block text-lg leading-none text-content-base font-extrabold tracking-tighter">{dict.brand.hack}</span>
              <span className="hidden sm:block text-[0.6rem] leading-none text-blue-600 font-bold tracking-[0.2em] uppercase mt-0.5">{dict.brand.platform}</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-content-muted">
            {navItems.map((item) => {
              const isActive = variant === "app" && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 transition-colors whitespace-nowrap group hover:text-content-base",
                    isActive ? "text-blue-600" : ""
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full transform origin-left transition-transform duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-4 shrink-0">
          <ThemeSwitcher />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          {rightSlot}
          
          {/* Mobile Menu Button (Optional, can be wired up later) */}
          <button type="button" className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 rounded-full bg-surface-muted text-content-muted hover:bg-surface-subtle transition-colors">
            <span className="w-5 h-0.5 bg-current rounded-full"></span>
            <span className="w-5 h-0.5 bg-current rounded-full"></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Bar (Scrollable horizontally) */}
      <div className={cn(
        "md:hidden w-full transition-all duration-300",
        isScrolled ? "hidden" : "block mt-3 border-t border-border-muted"
      )}>
        <nav className="flex overflow-x-auto px-6 h-12 items-center gap-6 text-sm font-semibold text-content-subtle no-scrollbar">
          {navItems.map((item) => {
            const isActive = variant === "app" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-3 transition-colors whitespace-nowrap shrink-0 hover:text-content-base",
                  isActive ? "text-blue-600" : ""
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
