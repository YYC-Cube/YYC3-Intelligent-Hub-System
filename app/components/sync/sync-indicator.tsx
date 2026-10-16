"use client"

import { useFavorites } from "@/app/context/favorites-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Check, Cloud, CloudOff, RefreshCw } from "lucide-react"
import { useI18n } from "@/app/hooks/use-i18n"

export function SyncIndicator() {
  const { syncStatus, lastSyncTime, syncWithCloud, hasPendingChanges } = useFavorites()
  const { t } = useI18n()

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "success":
        return <Check className="h-3 w-3 mr-1" />
      case "syncing":
        return <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
      case "error":
        return <CloudOff className="h-3 w-3 mr-1" />
      case "conflict":
        return <Cloud className="h-3 w-3 mr-1 text-yellow-500" />
      default:
        return <Cloud className="h-3 w-3 mr-1" />
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

  const getStatusClass = () => {
    switch (syncStatus) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200"
      case "syncing":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "error":
        return "bg-red-100 text-red-700 border-red-200"
      case "conflict":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return hasPendingChanges
          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
          : "bg-green-100 text-green-700 border-green-200"
    }
  }

  const getTooltipText = () => {
    if (lastSyncTime) {
      const timeAgo = formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true, locale: zhCN })
      return t("sync.上次同步: {time}", { time: timeAgo })
    }
    return t("sync.尚未同步")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`cursor-pointer ${getStatusClass()}`} onClick={() => syncWithCloud()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
          {hasPendingChanges && <p className="text-xs text-yellow-600">{t("sync.有未同步的更改")}</p>}
          <p className="text-xs text-gray-500">{t("sync.点击进行同步")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
