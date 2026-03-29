import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-base text-white hover:bg-primary-hover shadow-md hover:-translate-y-1 hover:shadow-lg font-semibold transition-all",
      secondary: "bg-surface-base text-content-base hover:bg-surface-muted border border-border-base shadow-sm hover:-translate-y-0.5 hover:shadow-md font-medium transition-all",
      outline: "bg-transparent text-content-base hover:bg-surface-subtle border border-border-strong font-medium shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all",
      ghost: "bg-transparent text-content-subtle hover:text-content-base hover:bg-surface-subtle font-medium transition-all",
      danger: "bg-danger-base text-white hover:bg-danger-hover shadow-md hover:-translate-y-1 hover:shadow-lg font-semibold transition-all",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
