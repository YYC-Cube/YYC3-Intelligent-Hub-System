import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * YYC³ 品牌输入框 —— 在基线 Input 形态规范之上提供版式变体。
 * 焦点环统一走 --ring 令牌（禁止 ring-primary/20 私有焦点色）；
 * 错误态统一 aria-invalid → destructive（与 react-hook-form FormControl 联动）。
 */
const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:focus-visible:ring-destructive",
        underlined:
          "rounded-none border-0 border-b focus-visible:border-primary",
        filled: "border-transparent bg-muted focus-visible:bg-background",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3 text-base",
      },
      rounded: {
        default: "",
        full: "rounded-full",
        none: "rounded-none",
      },
      width: {
        default: "w-full",
        auto: "w-auto",
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

type InputVariantProps = VariantProps<typeof inputVariants>

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "className" | "width"
  > {
  className?: string
  variant?: InputVariantProps["variant"]
  size?: InputVariantProps["size"]
  rounded?: InputVariantProps["rounded"]
  width?: InputVariantProps["width"]
}

const YanyuInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, rounded, width, ...props }, ref) => {
    return (
      <input
        className={cn(
          inputVariants({
            variant: variant || "default",
            size: size || "default",
            rounded: rounded || "default",
            width: width || "default",
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
YanyuInput.displayName = "YanyuInput"

export { YanyuInput }
