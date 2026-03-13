import * as React from "react";
import { cn } from "@/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <select
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex h-10 w-full rounded-md border border-border-strong bg-surface-base px-3 py-2 text-sm text-content-base focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
          error && "border-danger-base focus:ring-danger-base text-danger-content",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
