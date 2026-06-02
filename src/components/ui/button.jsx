import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vp-blue focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-vp-blue text-white hover:bg-vp-blue-hover": variant === "primary",
            "bg-white border border-vp-blue text-vp-blue hover:bg-vp-blue-light": variant === "secondary",
            "bg-transparent text-vp-blue hover:underline": variant === "ghost",
            "bg-vp-red text-white hover:bg-red-700": variant === "danger",
            "bg-vp-yellow text-vp-blue hover:bg-yellow-400": variant === "yellow",
            "border border-border bg-white hover:bg-surface text-text-dark": variant === "icon",
          },
          {
            "h-11 px-6 text-[14px]": size === "default" && variant !== "icon",
            "h-9 px-4 text-[13px]": size === "sm",
            "h-12 px-8 text-[15px]": size === "lg",
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
