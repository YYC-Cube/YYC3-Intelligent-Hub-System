"use client"

import { useI18n } from "@/app/hooks/use-i18n"
import { useNetworkStatus } from "@/app/hooks/use-network-status"
import { WifiOff } from "lucide-react"

/**
 * 全局离线横幅 —— 网络断开时悬浮于视口底部（fixed，不产生布局位移），
 * 连接恢复后自动消失。warning 语义色，aria-live 播报状态变化。
 *
 * 挂载点：AppShell（全站唯一，页面禁止自行挂载）。
 */
export function OfflineBanner() {
  const isOnline = useNetworkStatus()
  const { t } = useI18n()

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-amber-500 py-2.5 px-4 text-sm font-medium text-white shadow-lg"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{t("errors.当前网络不可用，正在尝试重新连接…")}</span>
    </div>
  )
}
