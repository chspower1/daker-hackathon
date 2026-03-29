import * as React from "react";
import { cn } from "@/lib/cn";

export type DataTableProps = React.HTMLAttributes<HTMLTableElement>;

export function DataTable({ className, ...props }: DataTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-base/60 bg-surface-base shadow-sm">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b border-border-base/60 bg-surface-muted/50",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border-base/60 transition-colors hover:bg-surface-muted/80 data-[state=selected]:bg-surface-subtle",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-5 text-left align-middle font-semibold text-content-muted text-xs tracking-wide [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-5 align-middle text-sm text-content-muted [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";
