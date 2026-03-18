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
          "flex h-12 w-full border-4 border-content-base bg-white px-4 py-2 font-bold text-content-base focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 appearance-none cursor-pointer",
          error && "border-red-500 focus:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] text-red-700",
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

