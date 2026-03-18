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
    const childProps = children.props as {
      id?: string;
      ["aria-describedby"]?: string;
      ["aria-invalid"]?: boolean | "true" | "false";
    };
    const controlId = htmlFor ?? childProps.id ?? generatedId;
    const describedBy = [childProps["aria-describedby"], descriptionId, errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    control = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      id: controlId,
      "aria-describedby": describedBy,
      "aria-invalid": childProps["aria-invalid"] ?? (error ? true : undefined),
    });
  }

  const labelFor = htmlFor ?? (React.isValidElement(control) ? ((control.props as { id?: string }).id ?? fallbackId) : fallbackId);

  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props}>
      <label 
        htmlFor={labelFor}
        className={cn(
          "text-lg font-black uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error ? "text-red-600" : "text-content-base"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-2">*</span>}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm font-bold text-content-subtle">{description}</p>
      )}
      <div className="pt-2">
        {control}
      </div>
      {error && (
        <p id={errorId} className="text-sm font-black text-white bg-red-500 p-2 border-2 border-content-base inline-block mt-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">{error}</p>
      )}
    </div>
  );
}

