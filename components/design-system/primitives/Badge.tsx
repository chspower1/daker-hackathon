import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brutal";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#f4f4f0] text-content-base border-content-base",
    success: "bg-green-400 text-content-base border-content-base",
    warning: "bg-yellow-400 text-content-base border-content-base",
    danger: "bg-red-400 text-content-base border-content-base",
    info: "bg-blue-400 text-content-base border-content-base",
    brutal: "bg-yellow-300 text-content-base border-content-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-4 px-3 py-1 text-sm font-black uppercase tracking-widest transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

