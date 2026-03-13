import * as React from "react";
import { cn } from "@/lib/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning";
  title?: string;
}

export function Alert({ className, variant = "default", title, children, ...props }: AlertProps) {
  const variants = {
    default: "bg-primary-subtle border-primary-base/20 text-primary-content",
    danger: "bg-danger-subtle border-danger-base/20 text-danger-content",
    success: "bg-success-subtle border-success-base/20 text-success-content",
    warning: "bg-warning-subtle border-warning-base/20 text-warning-content",
  };

  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-current [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] transition-all duration-200", variants[variant], className)}
      {...props}
    >
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
}
