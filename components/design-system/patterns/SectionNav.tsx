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
    <nav aria-label="Section navigation" className={cn("flex space-x-1 border-b border-border-base overflow-x-auto", className)} {...props}>
      {items.map((item) => (
        item.href ? (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              item.active
                ? "border-primary-base text-primary-base"
                : "border-transparent text-content-muted hover:text-content-base hover:border-border-strong"
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
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              item.active
                ? "border-primary-base text-primary-base"
                : "border-transparent text-content-muted hover:text-content-base hover:border-border-strong"
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
