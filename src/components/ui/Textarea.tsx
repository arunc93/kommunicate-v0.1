import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={inputId}
          className={cn("field min-h-[88px] resize-y", className)}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
