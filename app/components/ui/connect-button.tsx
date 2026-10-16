"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/app/hooks/use-i18n"

interface ConnectButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick?: () => void
  disabled?: boolean
}

export function ConnectButton({
  className,
  size = "default",
  variant = "default",
  onClick,
  disabled = false,
}: ConnectButtonProps) {
  const { t } = useI18n()

  return (
    <Button
      className={cn(
        "bg-sky-500 hover:bg-sky-600 text-white font-medium",
        size === "sm" && "text-xs py-1 px-2 h-7",
        className,
      )}
      size={size}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
    >
      {t("ui.连接")}
    </Button>
  )
}
