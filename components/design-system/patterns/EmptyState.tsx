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
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-surface-base shadow-sm border border-border-base rounded-xl transition-all duration-300", className)}>
      {icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center bg-blue-50 text-blue-600 rounded-full mb-4 ring-4 ring-blue-50/50">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold tracking-tight text-content-base mb-2">{title}</h3>
      <p className="text-sm text-content-subtle max-w-lg mx-auto">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary" className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

