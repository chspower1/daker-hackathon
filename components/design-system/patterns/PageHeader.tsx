import * as React from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b-4 border-content-base gap-4 animate-slide-up", className)} {...props}>
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.9] text-content-base inline-block bg-yellow-300 px-3 py-1 border-2 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">{title}</h1>
        {description && <p className="text-base font-bold text-content-base max-w-2xl border-l-4 border-primary-base pl-3">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
