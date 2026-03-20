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
    const childProps = children.props as { id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean | string };
    const controlId = htmlFor ?? childProps.id ?? generatedId;
    const describedBy = [childProps["aria-describedby"], descriptionId, errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    control = React.cloneElement(children as React.ReactElement<{id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean | string}>, {
      id: controlId,
      "aria-describedby": describedBy,
      "aria-invalid": childProps["aria-invalid"] ?? (error ? true : undefined),
    });
  }

  const labelFor = htmlFor ?? (React.isValidElement(control) ? ((control.props as { id?: string }).id ?? fallbackId) : fallbackId);

  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
      <label 
        htmlFor={labelFor}
        className={cn(
          "text-sm font-bold r leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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
        <p id={errorId} className="text-xs font-medium text-danger-base mt-1">{error}</p>
      )}
    </div>
  );
}
