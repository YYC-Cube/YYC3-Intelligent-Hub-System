"use client"

import { useEffect } from "react"

import { StatusPage } from "./components/error-handling/status-page"
import { useI18n } from "@/app/hooks/use-i18n"
import { logError } from "./services/error-logging"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 路由级错误页（500）—— 收敛至统一 StatusPage（server-error 变体）。
 *
 * 安全约定：生产环境不渲染 error.message 原文（避免泄露技术细节），
 * 仅展示 digest 供用户反馈与运维检索。
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useI18n()

  useEffect(() => {
    // 记录错误到日志服务
    logError({
      error: error.toString(),
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
      additionalInfo: {
        digest: error.digest,
      },
    })
  }, [error])

  return (
    <StatusPage
      variant="server-error"
      code="500"
      title={t("errors.页面加载失败")}
      onRetry={reset}
      errorId={error.digest}
    />
  )
}
