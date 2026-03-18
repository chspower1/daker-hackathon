"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionNavItem {
  id: string;
  label: string;
  active?: boolean;
  href?: string;
}

interface SectionNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  items: SectionNavItem[];
  onSelect?: (id: string) => void;
}

export function SectionNav({ items, onSelect, className, ...props }: SectionNavProps) {
  return (
    <nav aria-label="Section navigation" className={cn("flex space-x-4 border-b-8 border-content-base overflow-x-auto pb-4 mb-8", className)} {...props}>
      {items.map((item) => (
        item.href ? (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "px-6 py-3 text-lg font-black uppercase tracking-widest transition-all border-4 border-content-base whitespace-nowrap",
              item.active
                ? "bg-primary-base text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white text-content-base hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            )}
            aria-current={item.active ? "location" : undefined}
          >
            {item.label}
          </a>
        ) : (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={cn(
              "px-6 py-3 text-lg font-black uppercase tracking-widest transition-all border-4 border-content-base whitespace-nowrap",
              item.active
                ? "bg-primary-base text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white text-content-base hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            )}
            aria-pressed={item.active || undefined}
          >
            {item.label}
          </button>
        )
      ))}
    </nav>
  );
}

