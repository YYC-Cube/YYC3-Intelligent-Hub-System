"use client"

import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useI18n } from "@/app/hooks/use-i18n"

/**
 * 「连接」操作按钮 —— 基于 Button info 语义变体（替代旧 className 颜色覆盖），
 * 支持 loading 加载态与文案定制；默认尺寸 xs（工具条/卡片内嵌场景）。
 */
export type ConnectButtonProps = Omit<ButtonProps, "children"> & {
  children?: React.ReactNode
}

export function ConnectButton({
  children,
  size = "xs",
  variant = "info",
  ...props
}: ConnectButtonProps) {
  const { t } = useI18n()

  return (
    <Button size={size} variant={variant} {...props}>
      {children ?? t("ui.连接")}
    </Button>
  )
}
