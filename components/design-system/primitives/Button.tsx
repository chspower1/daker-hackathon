import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "brutal";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-base text-white hover:bg-primary-hover border-4 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider",
      secondary: "bg-[#f4f4f0] text-content-base hover:bg-white border-4 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider",
      outline: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-4 border-content-base font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      ghost: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-4 border-transparent hover:border-content-base font-black uppercase tracking-wider",
      danger: "bg-red-500 text-white hover:bg-red-600 border-4 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider",
      brutal: "bg-content-base text-surface-base hover:bg-primary-base hover:text-white border-4 border-content-base hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-widest",
    };

    const sizes = {
      sm: "h-10 px-4 text-xs",
      md: "h-12 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-base focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
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

