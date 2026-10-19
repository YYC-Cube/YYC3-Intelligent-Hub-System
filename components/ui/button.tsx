import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * YYC³ 基线按钮 —— 全站唯一按钮真源。
 *
 * 五种基础类型：default（主要）/ secondary（次要）/ dashed（虚线）/ ghost·link（文字）/ destructive（危险）
 * 语义功能色：success / warning / info / accent（对应 globals.css 功能色令牌）
 * 状态六件套：默认 / hover（加深 10%）/ active（scale 按下反馈）/ disabled / loading（aria-busy）/ 焦点环，
 * 其中按下态 active:scale-[0.98] 全变体统一，transition 含 transform 保证松回平滑；
 * 禁用策略：disabled:pointer-events-none（asChild 链接场景同样阻断交互）；
 * 输入型组件（Input/Textarea/Select）统一采用 disabled:cursor-not-allowed，两类策略由组件类别定义，不混用。
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        dashed:
          "border border-dashed border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning",
        info: "bg-info text-info-foreground hover:bg-info/90 focus-visible:ring-info",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        xs: "h-7 rounded-sm px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
      },
      rounded: {
        default: "",
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
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** 加载态：自动禁用（disabled + aria-busy）并内联旋转指示器，替代业务各自实现 loading */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      width,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      buttonVariants({ variant, size, rounded, width, className })
    )

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
