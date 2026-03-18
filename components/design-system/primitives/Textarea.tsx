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
          "flex min-h-[120px] w-full border-4 border-content-base bg-white px-4 py-3 font-bold text-content-base placeholder:text-content-subtle placeholder:font-normal focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 resize-y",
          error && "border-red-500 focus:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] text-red-700 placeholder:text-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

