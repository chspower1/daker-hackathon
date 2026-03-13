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
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-base rounded-xl bg-surface-subtle/50 transition-colors duration-200 hover:bg-surface-subtle", className)}>
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-base text-content-muted mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="mt-2 text-sm font-semibold text-content-base">{title}</h3>
      <p className="mt-1 text-sm text-content-subtle max-w-sm">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
