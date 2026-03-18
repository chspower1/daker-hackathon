#!/bin/bash

# 1. Button.tsx
cat << 'INNER_EOF' > components/design-system/primitives/Button.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "brutal";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-base text-white hover:bg-primary-hover border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      secondary: "bg-[#f4f4f0] text-content-base hover:bg-white border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      outline: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-2 border-content-base font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
      ghost: "bg-transparent text-content-base hover:bg-[#f4f4f0] border-2 border-transparent hover:border-content-base font-bold uppercase tracking-wide",
      danger: "bg-red-500 text-white hover:bg-red-600 border-2 border-content-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none font-bold uppercase tracking-wide",
      brutal: "bg-content-base text-surface-base hover:bg-primary-base hover:text-white border-2 border-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-black tracking-widest",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
INNER_EOF

# 2. Card.tsx
cat << 'INNER_EOF' > components/design-system/primitives/Card.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-none border-2 border-content-base bg-white text-content-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1 p-4 border-b-2 border-content-base bg-[#f4f4f0]", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-black text-lg uppercase tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 flex-1", className)} {...props} />;
}
INNER_EOF

# 3. Badge.tsx
cat << 'INNER_EOF' > components/design-system/primitives/Badge.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brutal";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#f4f4f0] text-content-base border-content-base",
    success: "bg-green-400 text-content-base border-content-base",
    warning: "bg-yellow-400 text-content-base border-content-base",
    danger: "bg-red-400 text-content-base border-content-base",
    info: "bg-blue-400 text-content-base border-content-base",
    brutal: "bg-yellow-300 text-content-base border-content-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
INNER_EOF

# 4. Input & Select & Textarea
cat << 'INNER_EOF' > components/design-system/primitives/Input.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex h-10 w-full border-2 border-content-base bg-white px-3 py-2 text-sm font-medium text-content-base placeholder:text-content-subtle placeholder:font-normal focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
          error && "border-red-500 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] text-red-700 placeholder:text-red-400",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
INNER_EOF

cat << 'INNER_EOF' > components/design-system/primitives/Select.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <select
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex h-10 w-full border-2 border-content-base bg-white px-3 py-2 text-sm font-medium text-content-base focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 cursor-pointer",
          error && "border-red-500 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] text-red-700",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
INNER_EOF

cat << 'INNER_EOF' > components/design-system/primitives/Textarea.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(
          "flex min-h-[100px] w-full border-2 border-content-base bg-white px-3 py-2 text-sm font-medium text-content-base placeholder:text-content-subtle placeholder:font-normal focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200 resize-y",
          error && "border-red-500 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] text-red-700 placeholder:text-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
INNER_EOF

# 5. DataTable.tsx
cat << 'INNER_EOF' > components/design-system/primitives/DataTable.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export type DataTableProps = React.HTMLAttributes<HTMLTableElement>;

export function DataTable({ className, ...props }: DataTableProps) {
  return (
    <div className="w-full overflow-auto border-2 border-content-base bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
  <thead ref={ref} className={cn("[&_tr]:border-b-2 border-content-base bg-[#f4f4f0]", className)} {...props} />
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
      "border-b-2 border-content-base transition-colors hover:bg-yellow-100 data-[state=selected]:bg-blue-100",
      className
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
      "h-10 px-4 text-left align-middle font-bold text-content-base uppercase tracking-wider text-xs [&:has([role=checkbox])]:pr-0",
      className
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
    className={cn("p-4 align-middle font-medium text-sm [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";
INNER_EOF

# 6. PageHeader.tsx
cat << 'INNER_EOF' > components/design-system/patterns/PageHeader.tsx
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
INNER_EOF

# 7. FormField.tsx & KeyValueList.tsx
cat << 'INNER_EOF' > components/design-system/patterns/FormField.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const fallbackId = htmlFor ?? generatedId;
  const descriptionId = description ? `${fallbackId}-description` : undefined;
  const errorId = error ? `${fallbackId}-error` : undefined;

  let control = children;

  if (React.isValidElement(children)) {
    const childProps = children.props as any;
    const controlId = htmlFor ?? childProps.id ?? generatedId;
    const describedBy = [childProps["aria-describedby"], descriptionId, errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    control = React.cloneElement(children as any, {
      id: controlId,
      "aria-describedby": describedBy,
      "aria-invalid": childProps["aria-invalid"] ?? (error ? true : undefined),
    });
  }

  const labelFor = htmlFor ?? (React.isValidElement(control) ? ((control.props as any).id ?? fallbackId) : fallbackId);

  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
      <label 
        htmlFor={labelFor}
        className={cn(
          "text-sm font-black uppercase tracking-wider leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error ? "text-red-600" : "text-content-base"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p id={descriptionId} className="text-xs font-bold text-content-subtle">{description}</p>
      )}
      <div className="pt-1">
        {control}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-bold text-white bg-red-500 px-2 py-1 border-2 border-content-base inline-block mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">{error}</p>
      )}
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > components/design-system/patterns/KeyValueList.tsx
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
INNER_EOF

echo "Files updated"
