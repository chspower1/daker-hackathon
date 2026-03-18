import * as React from "react";
import { cn } from "@/lib/cn";
import { Button } from "../primitives/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border-8 border-content-base bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(37,99,235,1)] transition-all duration-300", className)}>
      {icon && (
        <div className="mx-auto flex h-24 w-24 items-center justify-center bg-yellow-300 border-4 border-content-base text-content-base mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-6deg]">
          {icon}
        </div>
      )}
      <h3 className="text-4xl font-black text-content-base uppercase tracking-tighter mb-4">{title}</h3>
      <p className="text-xl font-bold text-content-subtle max-w-lg leading-relaxed">{description}</p>
      {actionLabel && (
        <div className="mt-10">
          <Button onClick={onAction} variant="brutal" className="text-xl h-16 px-10">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

