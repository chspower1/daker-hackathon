import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-subtle text-content-muted border-border-base",
    success: "bg-success-subtle text-success-content border-success-subtle",
    warning: "bg-warning-subtle text-warning-content border-warning-subtle",
    danger: "bg-danger-subtle text-danger-content border-danger-subtle",
    info: "bg-info-subtle text-info-content border-info-subtle",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
