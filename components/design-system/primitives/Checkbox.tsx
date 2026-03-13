import * as React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "h-4 w-4 rounded border-border-strong bg-surface-base text-primary-base focus:ring-2 focus:ring-primary-base focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-danger-base text-danger-base focus:ring-danger-base",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
