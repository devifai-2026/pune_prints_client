import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors focus-visible:outline-none focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary-blue text-white hover:bg-primary-dark shadow-sm hover:shadow-card-hover": variant === "primary",
            "bg-transparent border-[1.5px] border-primary-blue text-primary-blue hover:bg-blue-50": variant === "secondary",
            "bg-transparent text-primary-blue hover:bg-blue-50": variant === "ghost",
            "bg-error-red text-white hover:bg-red-600": variant === "danger",
            "bg-accent-orange text-white hover:bg-orange-600 shadow-sm hover:shadow-card": variant === "orange",
            "border border-border bg-white hover:bg-surface text-text-medium": variant === "icon",
          },
          {
            "h-12 px-6 font-display font-medium text-[15px]": size === "default" && variant !== "icon",
            "h-10 px-5 text-sm": size === "sm",
            "h-14 px-8 font-display font-semibold text-base": size === "lg",
            "h-10 w-10 shrink-0": variant === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
