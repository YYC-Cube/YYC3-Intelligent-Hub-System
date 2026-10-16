"use client"

import type React from "react"
import type { HeatLevel, TrendDirection } from "@/app/services/category-trends"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, Minus, Flame, Activity } from "lucide-react"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

interface CategoryHeatBadgeProps {
  heatLevel: HeatLevel
  trend: TrendDirection
  growthRate: number
  showTrend?: boolean
  size?: "sm" | "md" | "lg"
}

export default function CategoryHeatBadge({
  heatLevel,
  trend,
  growthRate,
  showTrend = true,
  size = "md",
}: CategoryHeatBadgeProps) {
  const { t } = useI18n()
  // 热度级别对应的样式和图标
  const heatStyles: Record<HeatLevel, { bg: string; text: string; icon: React.ReactNode }> = {
    极热: {
      bg: "bg-gradient-to-r from-red-500 to-orange-500",
      text: "text-white",
      icon: <Flame className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
    },
    热门: {
      bg: "bg-orange-500",
      text: "text-white",
      icon: <Flame className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
    },
    活跃: {
      bg: "bg-yellow-500",
      text: "text-black",
      icon: <Activity className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
    },
    稳定: {
      bg: "bg-blue-500",
      text: "text-white",
      icon: null,
    },
    冷门: {
      bg: "bg-gray-500",
      text: "text-white",
      icon: null,
    },
  }

  // 趋势对应的图标
  const trendIcons: Record<TrendDirection, React.ReactNode> = {
    上升: <TrendingUp className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
    平稳: <Minus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
    下降: <TrendingDown className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />,
  }

  // 趋势对应的样式
  const trendStyles: Record<TrendDirection, { text: string }> = {
    上升: { text: "text-green-500" },
    平稳: { text: "text-blue-500" },
    下降: { text: "text-red-500" },
  }

  const { bg, text, icon } = heatStyles[heatLevel]
  const trendIcon = trendIcons[trend]
  const { text: trendText } = trendStyles[trend]

  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${bg} ${text} ${sizeClasses[size]} flex items-center gap-1 font-medium`}>
            {icon && <span className="mr-0.5">{icon}</span>}
            {tc("category", heatLevel)}
            {showTrend && (
              <span className={`ml-1 flex items-center ${trendText}`}>
                {trendIcon}
                <span className="ml-0.5">{growthRate > 0 ? `+${String(growthRate)}%` : `${String(growthRate)}%`}</span>
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("category.热度: {level}", { level: tc("category", heatLevel) })}</p>
          <p>
            {t("category.趋势: {trend} ({rate})", {
              trend: tc("category", trend),
              rate: growthRate > 0 ? `+${String(growthRate)}%` : `${String(growthRate)}%`,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
