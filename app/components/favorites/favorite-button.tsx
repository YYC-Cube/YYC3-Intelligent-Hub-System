"use client"

import type React from "react"

import { useFavorites } from "@/app/context/favorites-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface FavoriteButtonProps {
  id: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function FavoriteButton({
  id,
  variant = "outline",
  size = "default",
  showText = true,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  // H-4：文案走 i18n（favorites 命名空间），与其他组件一致，不再硬编码中文
  const { t } = useI18n()
  const isFav = isFavorite(id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toggleFavorite(id)

    toast({
      title: isFav ? t("favorites.已从收藏中移除") : t("favorites.已添加到收藏"),
      description: isFav
        ? t("favorites.该集成应用已从您的收藏列表中移除")
        : t("favorites.该集成应用已添加到您的收藏列表"),
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      className={cn(
        "group",
        isFav &&
        variant !== "ghost" &&
        "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100 hover:text-pink-700",
        className,
      )}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex items-center gap-2"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isFav ? "fill-pink-500 text-pink-500" : "fill-none group-hover:text-pink-500",
          )}
        />
        {showText && (isFav ? t("favorites.已收藏") : t("favorites.收藏"))}
      </motion.div>
    </Button>
  )
}
