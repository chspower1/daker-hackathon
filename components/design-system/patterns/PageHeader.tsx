import * as React from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b-8 border-content-base gap-6 animate-slide-up", className)} {...props}>
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-content-base inline-block bg-yellow-300 px-4 py-2 border-4 border-content-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">{title}</h1>
        {description && <p className="text-xl font-bold text-content-base max-w-2xl border-l-8 border-primary-base pl-4">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}

