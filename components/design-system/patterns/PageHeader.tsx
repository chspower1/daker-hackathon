import * as React from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-border-base gap-4 animate-slide-up", className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-content-base">{title}</h1>
        {description && <p className="text-sm text-content-subtle max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
