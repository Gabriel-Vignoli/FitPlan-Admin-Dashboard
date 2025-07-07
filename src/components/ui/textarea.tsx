import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full border-2 border-white/40 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-white/50 transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/70 focus-visible:bg-black focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed rounded-[8px] hover:border-white/50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }