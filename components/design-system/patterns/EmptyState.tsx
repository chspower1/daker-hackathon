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
    <div className={cn("flex flex-col items-center justify-center p-12 text-center  bg-white shadow-md hover:-translate-y-2 hover:shadow-md transition-all duration-300", className)}>
      {icon && (
        <div className="mx-auto flex h-24 w-24 items-center justify-center bg-yellow-300 border border-border-base text-content-base mb-8 shadow-md rotate-[-6deg]">
          {icon}
        </div>
      )}
      <h3 className="text-4xl font-bold text-content-base tracking-tight mb-4">{title}</h3>
      <p className="text-xl font-bold text-content-subtle max-w-lg leading-relaxed">{description}</p>
      {actionLabel && (
        <div className="mt-10">
          <Button onClick={onAction} variant="primary" className="text-xl h-16 px-10">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

