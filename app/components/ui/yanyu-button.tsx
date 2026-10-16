"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
        accent: "bg-accent text-accent-foreground hover:bg-accent-dark",
        outline: "border border-input bg-background hover:bg-muted hover:text-foreground",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        success: "bg-success text-white hover:bg-success-dark",
        warning: "bg-warning text-white hover:bg-warning-dark",
        error: "bg-error text-white hover:bg-error-dark",
        info: "bg-info text-white hover:bg-info-dark",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
      width: {
        default: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      width: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const YanyuButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, width, asChild = false, ...props }, ref) => {
    if (asChild) {
      return <>{props.children}</>
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, rounded, width, className }))}
        {...props}
      />
    )
  },
)
YanyuButton.displayName = "YanyuButton"

export { YanyuButton, buttonVariants }
