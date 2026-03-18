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
          "flex h-12 w-full border-4 border-content-base bg-white px-4 py-2 font-bold text-content-base placeholder:text-content-subtle placeholder:font-normal focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
          error && "border-red-500 focus:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] text-red-700 placeholder:text-red-400",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

