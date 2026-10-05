import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "sidebar";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-cobalt hover:bg-kpmg-blue text-white border-transparent",
      outline: "bg-white hover:bg-surface text-text border border-border",
      ghost: "bg-transparent hover:bg-white/10 text-white border-transparent",
      sidebar: "bg-white/10 hover:bg-white/15 text-white border-transparent w-full justify-start",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-3.5 py-2.5 text-[13px]",
      lg: "px-4 py-2.5 text-sm",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
