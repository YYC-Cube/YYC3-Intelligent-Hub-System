import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * YYC³ 基线输入框 —— 输入型组件状态真源。
 * 状态链：默认 → hover:border-ring/60（可交互暗示）→ focus 焦点环 → aria-invalid 错误；
 * read-only 语义（只读≠禁用）：底色提示不可编辑，保留可选中复制；
 * 禁用策略沿用输入型二分法：disabled:cursor-not-allowed。
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-ring/60 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 read-only:cursor-default read-only:bg-muted/50 read-only:hover:border-input aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
