import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * YYC³ 品牌标签 —— 基线 Badge 的兼容门面。
 * 变体全部由基线 badgeVariants 提供（error → destructive 映射），
 * 本组件仅保留 size 扩展；微字号使用全局令牌 text-2xs（禁止 text-[10px] 魔法值）。
 */
const badgeSizeVariants = cva("", {
  variants: {
    size: {
      default: "px-2.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-2xs",
      lg: "px-3 py-1 text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type YanyuVariant =
  | NonNullable<VariantProps<typeof badgeVariants>["variant"]>
  | "error"
  | null

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeSizeVariants> {
  variant?: YanyuVariant
}

function YanyuBadge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant: variant === "error" ? "destructive" : variant }),
        badgeSizeVariants({ size }),
        className
      )}
      {...props}
    />
  )
}

export { YanyuBadge }
