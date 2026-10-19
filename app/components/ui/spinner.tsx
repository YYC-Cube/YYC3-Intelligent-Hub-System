"use client"

import { cn } from "@/lib/utils"
import { useI18n } from "@/app/hooks/use-i18n"

interface SpinnerProps {
  size?: "small" | "medium" | "large"
  className?: string
}

/**
 * YYC³ 独立加载指示器（块级场景使用；按钮内加载请直接使用 <Button loading />）。
 * - role="status" + i18n aria-label，保证读屏可感知；
 * - border-current 跟随文字颜色，无需按主题逐处调色。
 */
export function Spinner({ size = "medium", className }: SpinnerProps) {
  const { t } = useI18n()
  const sizeClasses = {
    small: "size-4 border-2",
    medium: "size-8 border-[3px]",
    large: "size-12 border-4",
  }

  return (
    <div
      role="status"
      aria-label={t("ui.加载中")}
      className={cn(
        "animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
}
