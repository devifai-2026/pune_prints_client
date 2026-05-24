import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  ({ className, error, success, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-lg border-[1.5px] border-border bg-white px-4 py-3 text-[15px] font-body text-text-dark placeholder:text-gray-400 focus-visible:outline-none focus:border-primary-blue focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            leftIcon && "pl-[44px]",
            rightIcon && "pr-[44px]",
            error && "border-error-red bg-red-50 focus:border-error-red focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]",
            success && "border-success-green focus:border-success-green focus:shadow-[0_0_0_3px_rgba(16,185,129,0.25)]",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
