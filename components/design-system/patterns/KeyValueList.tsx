import * as React from "react";
import { cn } from "@/lib/cn";

export interface KeyValuePair {
  id?: string;
  label: string;
  value: React.ReactNode;
}

interface KeyValueListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: KeyValuePair[];
}

export function KeyValueList({ items, className, ...props }: KeyValueListProps) {
  return (
    <dl className={cn("grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 border-2 border-content-base bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", className)} {...props}>
      {items.map((item) => (
        <div key={item.id ?? item.label} className="flex flex-col gap-1 border-b-2 border-content-base pb-3">
          <dt className="text-xs font-bold uppercase tracking-wider text-content-subtle">{item.label}</dt>
          <dd className="text-sm font-medium text-content-base">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
