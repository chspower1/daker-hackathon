import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-content-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md",
          error && "border-red-500 focus:ring-red-500/20 text-red-700 placeholder:text-red-400",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
