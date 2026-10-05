import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "sidebar";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#4e5d94] hover:bg-[#3d4a7a] text-white border-transparent",
      outline: "bg-white hover:bg-gray-50 text-[#1a2b4b] border border-gray-300",
      ghost: "bg-transparent hover:bg-white/10 text-white border-transparent",
      sidebar: "bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white border-transparent w-full justify-start",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-2.5 text-base",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded font-medium transition-colors border",
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
