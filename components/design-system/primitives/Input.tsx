import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  inputSize?: "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, inputSize = "lg", "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex w-full border border-border-base bg-surface-base px-4 text-sm font-medium text-content-base placeholder:text-content-subtle focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md",
          inputSize === "lg" && "h-12 rounded-2xl py-3",
          inputSize === "md" && "h-10 rounded-xl py-2",
          error && "border-red-500 focus:ring-red-500/20 text-red-700 placeholder:text-red-400",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
