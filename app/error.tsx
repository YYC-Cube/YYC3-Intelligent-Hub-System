"use client"

import { useEffect } from "react"
import { ErrorDisplay } from "./components/error-handling/error-display"
import { logError } from "./services/error-logging"
import { useI18n } from "@/app/hooks/use-i18n"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

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

  return <ErrorDisplay error={error} resetError={reset} title={t("errors.页面加载失败")} showDetails={true} />
}
