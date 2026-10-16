"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Download, Trash2, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Integration } from "@/app/data/integrations"
import { iconMap } from "@/app/data/integrations"
import { useFavorites } from "@/app/context/favorites-context"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n"
import {
  dataCat,
  dataIntegrationDesc,
  dataIntegrationName,
} from "@/lib/yyc3/i18n/data"

interface FavoriteCardProps {
  integration: Integration
  onRemove?: () => void
  isSelected?: boolean
  onSelect?: () => void
  showSelectCheckbox?: boolean
}

export function FavoriteCard({
  integration,
  onRemove,
  isSelected = false,
  onSelect,
  showSelectCheckbox = false,
}: FavoriteCardProps) {
  const { removeFavorite } = useFavorites()
  const { t } = useI18n()
  const [isHovering, setIsHovering] = useState(false)
  const Icon = iconMap[integration.icon as keyof typeof iconMap] || iconMap.Calendar

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeFavorite(integration.id)
    if (onRemove) onRemove()
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onSelect) onSelect()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn("relative", isSelected && "ring-2 ring-primary ring-offset-2")}
    >
      {showSelectCheckbox && (
        <button
          type="button"
          aria-label={isSelected ? t("favorites.取消选择") : t("favorites.选择")}
          aria-pressed={isSelected}
          className="absolute left-2 top-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer"
          onClick={handleSelect}
        >
          {isSelected && <span className="w-3 h-3 rounded-full bg-primary" />}
        </button>
      )}

      <Link href={`/marketplace/integration/${integration.id}`}>
        <Card
          className={cn(
            "overflow-hidden h-full border hover:border-primary/50 transition-all duration-300 group relative",
            isSelected && "border-primary",
          )}
        >
          {integration.new && <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">{t("favorites.新上线")}</Badge>}
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: integration.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{dataIntegrationName(integration.name)}</h3>
                <div className="text-xs text-gray-500">{integration.developer}</div>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{dataIntegrationDesc(integration.description)}</p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{integration.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({integration.reviewCount})</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Download className="w-3 h-3 mr-1" />
                  {integration.installCount > 1000
                    ? `${(integration.installCount / 1000).toFixed(1)}K`
                    : integration.installCount}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={
                    integration.price.type === "free"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : integration.price.type === "freemium"
                        ? "text-blue-600 border-blue-200 bg-blue-50"
                        : "text-gray-600 border-gray-200 bg-gray-50"
                  }
                >
                  {integration.price.type === "free"
                    ? tc("favorites", "免费")
                    : integration.price.type === "freemium"
                      ? tc("favorites", "免费增值")
                      : t("favorites.¥{price}/月", { price: String(integration.price.value) })}
                </Badge>
                <div className="text-xs text-gray-500">{dataCat(integration.category)}</div>
              </div>
            </div>

            {/* 悬停时显示的操作按钮 */}
            {isHovering && (
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center gap-2">
                <Button size="sm" variant="default" asChild>
                  <Link href={`/integrations/${integration.id}/install`}>{t("favorites.安装")}</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/marketplace/integration/${integration.id}`}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {t("favorites.详情")}
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={handleRemove}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
