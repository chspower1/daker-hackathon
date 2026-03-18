import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "brutal";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-base text-white hover:bg-primary-hover border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      secondary: "bg-[#f4f4f0] text-content-base hover:bg-white border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      outline: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-2 border-content-base font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
      ghost: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-2 border-transparent hover:border-content-base font-bold uppercase tracking-wide",
      danger: "bg-red-500 text-white hover:bg-red-600 border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      brutal: "bg-content-base text-surface-base hover:bg-primary-base hover:text-white border-2 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-black tracking-widest",
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
          "inline-flex items-center justify-center rounded-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]",
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
