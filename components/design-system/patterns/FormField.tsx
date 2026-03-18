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
