import * as React from "react";
import { cn } from "@/lib/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "danger" | "success" | "warning";
  title?: string;
}

export function Alert({ className, variant = "default", title, children, ...props }: AlertProps) {
  const variants = {
    default: "bg-blue-200 border-content-base text-content-base",
    danger: "bg-red-400 border-content-base text-white",
    success: "bg-green-400 border-content-base text-content-base",
    warning: "bg-yellow-300 border-content-base text-content-base",
  };

  return (
    <div
      role="alert"
      className={cn("relative w-full rounded-none border-4 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]", variants[variant], className)}
      {...props}
    >
      {title && <h5 className="mb-2 font-black uppercase tracking-widest text-xl leading-none">{title}</h5>}
      <div className="text-lg font-bold">{children}</div>
    </div>
  );
}

