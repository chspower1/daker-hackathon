import * as React from "react";
import { cn } from "@/lib/cn";

export type ToastVariant = "default" | "success" | "danger" | "warning";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title: string;
  description?: React.ReactNode;
  onDismiss?: () => void;
}

const toastVariants: Record<ToastVariant, string> = {
  default: "border-primary-base/20 shadow-primary-base/10 dark:border-primary-base/20",
  success: "border-success-base/30 shadow-success-base/10 dark:border-success-base/20",
  danger: "border-danger-base/30 shadow-danger-base/10 dark:border-danger-base/20",
  warning: "border-warning-base/30 shadow-warning-base/10 dark:border-warning-base/20",
};

const titleVariants: Record<ToastVariant, string> = {
  default: "text-primary-base dark:text-blue-400",
  success: "text-success-content dark:text-success-base",
  danger: "text-danger-hover dark:text-danger-base",
  warning: "text-warning-content dark:text-warning-base",
};

export function Toast({ className, variant = "default", title, description, onDismiss, ...props }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-surface-base/85 p-4 pr-12 shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-up",
        toastVariants[variant],
        className,
      )}
      {...props}
    >
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5",
          variant === "default" && "bg-primary-base",
          variant === "success" && "bg-success-base",
          variant === "danger" && "bg-danger-base",
          variant === "warning" && "bg-warning-base",
        )} 
      />

      <div className="space-y-1.5 pl-2">
        <div className={cn("text-sm font-bold leading-tight tracking-tight", titleVariants[variant])}>
          {title}
        </div>
        {description !== undefined && (
          <div className="text-sm font-medium leading-relaxed text-content-muted">
            {description}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-content-subtle transition-colors hover:bg-border-muted hover:text-content-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
        >
          <svg 
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
