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
    <dl className={cn("grid gap-y-6 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 border-4 border-content-base bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", className)} {...props}>
      {items.map((item) => (
        <div key={item.id ?? item.label} className="flex flex-col gap-2 border-b-4 border-content-base pb-4">
          <dt className="text-sm font-black uppercase tracking-widest text-content-subtle">{item.label}</dt>
          <dd className="text-xl font-bold text-content-base">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
