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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {required && <span className="ml-0.5 text-error">*</span>}
          </label>
        )}
        <input ref={ref} id={inputId} className={cn("field", className)} {...props} />
      </div>
    );
  }
);
Input.displayName = "Input";
