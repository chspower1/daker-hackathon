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
          "flex min-h-[100px] w-full border border-border-base bg-white px-3 py-2 text-sm font-medium text-content-base placeholder:text-content-subtle placeholder:font-normal focus:outline-none focus:ring-0 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 resize-y",
          error && "border-red-500 focus:shadow-md text-red-700 placeholder:text-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
