import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300",
        destructive:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        outline:
          "text-foreground border border-input",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        info:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
