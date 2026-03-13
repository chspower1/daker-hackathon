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
          "flex h-10 w-full rounded-md border border-border-strong bg-surface-base px-3 py-2 text-sm text-content-base placeholder:text-content-subtle focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
          error && "border-danger-base focus:ring-danger-base text-danger-content placeholder:text-danger-content/50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
