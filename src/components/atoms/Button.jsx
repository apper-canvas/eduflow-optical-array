import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "medium", children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white border-primary",
    secondary: "bg-secondary hover:bg-slate-600 text-white border-secondary",
    outline: "bg-transparent hover:bg-primary/10 text-primary border-primary",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;