import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "blue", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold leading-none",
        {
          "bg-vp-blue text-white": variant === "blue",
          "bg-vp-red text-white": variant === "red",
          "bg-vp-yellow text-vp-blue": variant === "yellow",
          "bg-vp-green text-white": variant === "green",
          "bg-text-dark text-white": variant === "dark",
          "border border-current bg-transparent": variant === "outlined",
          "bg-surface text-text-dark": variant === "gray",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
