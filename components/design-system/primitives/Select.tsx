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
          "flex h-10 w-full border border-border-base bg-white px-3 py-2 text-sm font-medium text-content-base focus:outline-none focus:ring-0 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 cursor-pointer",
          error && "border-red-500 focus:shadow-md text-red-700",
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
