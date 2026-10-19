"use client"

import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import type React from "react"

interface ErrorDisplayProps {
  error: Error | null
  errorInfo?: React.ErrorInfo | null
  resetError?: () => void
  title?: string
  showDetails?: boolean
}

/**
 * 区块级错误展示（Card 容器）—— ErrorBoundary fallback / 局部加载失败。
 * 页面级异常请使用 StatusPage（404/403/500/网络错误），勿用本组件。
 *
 * 安全约定：生产环境不渲染 error.message 原文（可能含接口地址、堆栈片段等
 * 技术细节），统一展示面向用户的通用文案 + digest；开发环境保留原文与技术
 * 栈便于排查。
 */
export function ErrorDisplay({
  error,
  errorInfo,
  resetError,
  title,
  showDetails = process.env.NODE_ENV === "development",
}: ErrorDisplayProps) {
  const { t } = useI18n()
  const isDev = process.env.NODE_ENV === "development"
  const resolvedTitle = title ?? t("errors.页面出现了问题")
  // 生产环境隐藏原始报错，仅保留 digest 检索锚点
  const errorMessage = isDev
    ? error?.message || t("errors.未知错误")
    : t("errors.这是一个意外问题，请重试；若问题持续，请联系我们。")
  const errorId = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-destructive/30">
        <CardHeader className="bg-destructive/15 text-destructive rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            <CardTitle>{resolvedTitle}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <p className="text-foreground">{errorMessage}</p>

            {!isDev && errorId && (
              <p className="text-xs text-muted-foreground">
                {t("errors.错误编号")}: {errorId}
              </p>
            )}

            {showDetails && errorInfo && (
              <div className="mt-4">
                <details className="text-xs">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                    {t("errors.查看技术详情")}
                  </summary>
                  <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-xs text-foreground">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 border-t pt-4">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>{t("errors.返回首页")}</span>
            </Link>
          </Button>

          {resetError && (
            <Button onClick={resetError} variant="destructive" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>{t("errors.重试")}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
