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
    <dl className={cn("grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {items.map((item) => (
        <div key={item.id ?? item.label} className="flex flex-col gap-1">
          <dt className="text-sm font-medium text-content-subtle">{item.label}</dt>
          <dd className="text-sm text-content-base">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
