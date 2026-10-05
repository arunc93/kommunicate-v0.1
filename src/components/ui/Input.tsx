import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
            {required && <span className="ml-0.5 text-error">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt",
            props.readOnly && "cursor-default bg-white",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
