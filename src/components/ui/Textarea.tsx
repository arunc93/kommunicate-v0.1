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
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1a2b4b]">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded border border-gray-200 bg-[#f5f5f5] px-3 py-2 text-sm text-[#1a2b4b] outline-none focus:border-[#4ebce9] focus:ring-1 focus:ring-[#4ebce9] resize-none min-h-[80px]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
