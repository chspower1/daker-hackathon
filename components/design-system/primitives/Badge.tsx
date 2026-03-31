import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-subtle text-content-muted",
    success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
