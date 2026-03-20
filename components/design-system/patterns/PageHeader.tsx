import * as React from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-border-base gap-4 animate-slide-up", className)} {...props}>
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-content-base">{title}</h1>
        {description && <p className="text-base font-bold text-content-base max-w-2xl border-l-2 border-primary-base pl-3">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
