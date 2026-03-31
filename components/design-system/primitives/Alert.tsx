import * as React from "react";
import { cn } from "@/lib/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning";
  title?: string;
}

export function Alert({ className, variant = "default", title, children, ...props }: AlertProps) {
  const variants = {
    default: "bg-blue-200 border-content-base text-content-base dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-100",
    danger: "bg-red-400 border-content-base text-white dark:bg-red-900/30 dark:border-red-800 dark:text-red-100",
    success: "bg-green-400 border-content-base text-content-base dark:bg-green-900/30 dark:border-green-800 dark:text-green-100",
    warning: "bg-yellow-300 border-content-base text-content-base dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-100",
  };

  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md", variants[variant], className)}
      {...props}
    >
      {title && <h5 className="mb-1 font-bold text-lg leading-tight">{title}</h5>}
      <div className="text-base font-medium">{children}</div>
    </div>
  );
}

