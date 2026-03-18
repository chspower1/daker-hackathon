import * as React from "react";
import { cn } from "@/lib/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-slate-200 border-2 border-content-base rounded-none", className)}
      {...props}
    />
  );
}
