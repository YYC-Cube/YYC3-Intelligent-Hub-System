"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"
import { useI18n } from "@/app/hooks/use-i18n"

interface CategoryConnectButtonProps {
  categoryName: string
  size?: "default" | "sm" | "lg"
  showText?: boolean
  className?: string
  onClick?: () => void
}

export default function CategoryConnectButton({
  categoryName,
  size = "default",
  showText = true,
  className,
  onClick,
}: CategoryConnectButtonProps) {
  const { t } = useI18n()
  const handleConnect = () => {
    // 处理连接逻辑
    console.log(`连接到分类: ${categoryName}`)
    if (onClick) onClick()
  }

  return (
    <Button
      variant="info"
      size={size}
      onClick={handleConnect}
      className={cn(
        "font-medium",
        size === "sm" && "text-xs py-1 px-2 h-7",
        className,
      )}
      aria-label={t("category.连接到{name}", { name: categoryName })}
    >
      <LinkIcon className="h-4 w-4 mr-1" />
      {showText && t("category.连接")}
    </Button>
  )
}
