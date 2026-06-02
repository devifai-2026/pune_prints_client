import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  ({ className, error, success, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-sm border border-border bg-white px-3 py-2 text-[14px] text-text-dark placeholder:text-text-muted focus-visible:outline-none focus:border-vp-blue focus:ring-2 focus:ring-vp-blue/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-vp-red focus:border-vp-red focus:ring-vp-red/20",
            success && "border-vp-green focus:border-vp-green focus:ring-vp-green/20",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
