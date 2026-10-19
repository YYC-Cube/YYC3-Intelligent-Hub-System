"use client"

import { useFavorites } from "@/app/context/favorites-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { statusVariant } from "@/lib/yyc3/status-variants"
import { formatDistanceToNow } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { Check, Cloud, CloudOff, RefreshCw } from "lucide-react"

/**
 * 云同步状态指示器 —— 业务状态视觉统一示范：
 * 色彩不再内联拼类，统一取自 lib/yyc3/status-variants 的 STATUS_VARIANT 语义映射表
 * （success=已同步 / info=同步中 / warning=未同步·冲突 / destructive=失败）。
 */
export function SyncIndicator() {
  const { syncStatus, lastSyncTime, syncWithCloud, hasPendingChanges } = useFavorites()
  const { locale, t } = useI18n()

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "success":
        return <Check className="mr-1 h-3 w-3" />
      case "syncing":
        return <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
      case "error":
        return <CloudOff className="mr-1 h-3 w-3" />
      case "conflict":
        return <Cloud className="mr-1 h-3 w-3" />
      default:
        return <Cloud className="mr-1 h-3 w-3" />
    }
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case "success":
        return t("sync.已同步")
      case "syncing":
        return t("sync.同步中...")
      case "error":
        return t("sync.同步失败")
      case "conflict":
        return t("sync.冲突")
      default:
        return hasPendingChanges ? t("sync.未同步") : t("sync.已同步")
    }
  }

  /** 状态 → Badge 语义变体：冲突与未同步同属「待处理」warning 组，失败归 destructive 组 */
  const getVariant = (): BadgeProps["variant"] => {
    switch (syncStatus) {
      case "success":
        return statusVariant("synced")
      case "syncing":
        return statusVariant("syncing")
      case "error":
        return statusVariant("error")
      case "conflict":
        return statusVariant("conflict")
      default:
        return hasPendingChanges ? statusVariant("pending") : statusVariant("synced")
    }
  }

  const getTooltipText = () => {
    if (lastSyncTime) {
      // 相对时间需随 UI 语言本地化：英文环境使用 enUS，避免出现「约 1 小时前」中文回退
      const dateLocale = locale === "en" ? enUS : zhCN
      const timeAgo = formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true, locale: dateLocale })
      return t("sync.上次同步: {time}", { time: timeAgo })
    }
    return t("sync.尚未同步")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className="cursor-pointer" onClick={() => syncWithCloud()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
          {hasPendingChanges && <p className="text-xs text-warning">{t("sync.有未同步的更改")}</p>}
          <p className="text-xs text-muted-foreground">{t("sync.点击进行同步")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
