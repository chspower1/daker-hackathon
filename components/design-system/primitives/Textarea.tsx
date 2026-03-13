import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-border-strong bg-surface-base px-3 py-2 text-sm text-content-base placeholder:text-content-subtle focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
          error && "border-danger-base focus:ring-danger-base text-danger-content placeholder:text-danger-content/50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
