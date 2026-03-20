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
          "h-6 w-6 rounded-2xl border-4 border-content-base bg-white text-primary-base focus:ring-0 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary-base appearance-none checked:before:content-['✓'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center checked:before:font-black checked:before:h-full checked:before:w-full",
          error && "border-red-500 text-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

