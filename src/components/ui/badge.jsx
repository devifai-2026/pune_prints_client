import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "blue", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-[10px] py-[4px] text-[13px] font-medium transition-colors",
        {
          "bg-blue-50 text-primary-blue": variant === "blue",
          "bg-orange-50 text-accent-orange": variant === "orange",
          "bg-emerald-50 text-success-green": variant === "green",
          "bg-red-50 text-error-red": variant === "red",
          "bg-gray-900 text-white": variant === "dark",
          "border border-current bg-transparent": variant === "outlined",
          "bg-gray-100 text-gray-700": variant === "gray",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
