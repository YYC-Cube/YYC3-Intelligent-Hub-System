"use client"

import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"

/**
 * YYC³ 品牌按钮 —— 基线 Button 的兼容门面（facade）。
 *
 * v2.0 起全部变体/尺寸/加载态由基线 Button 提供，本组件仅保留：
 * 1. 旧 API 兼容：error → destructive 映射；
 * 2. asChild 修复：委托基线 Slot 实现（旧实现直接渲染 children 导致样式全丢，已废弃）。
 * 新业务请直接使用 @/components/ui/button 的 Button。
 */
type YanyuVariant = ButtonProps["variant"] | "error"

export interface YanyuButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: YanyuVariant
}

const YanyuButton = React.forwardRef<HTMLButtonElement, YanyuButtonProps>(
  ({ variant, ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant === "error" ? "destructive" : variant}
      {...props}
    />
  )
)
YanyuButton.displayName = "YanyuButton"

export { YanyuButton }
