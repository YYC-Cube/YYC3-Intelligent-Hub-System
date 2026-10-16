"use client"

import type React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useI18n } from "@/app/hooks/use-i18n"

interface ErrorDisplayProps {
  error: Error | null
  errorInfo?: React.ErrorInfo | null
  resetError?: () => void
  title?: string
  showDetails?: boolean
}

export function ErrorDisplay({
  error,
  errorInfo,
  resetError,
  title,
  showDetails = process.env.NODE_ENV === "development",
}: ErrorDisplayProps) {
  const { t } = useI18n()
  const resolvedTitle = title ?? t("errors.页面出现了问题")
  const errorMessage = error?.message || t("errors.未知错误")

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-red-200">
        <CardHeader className="bg-red-50 text-red-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle>{resolvedTitle}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <p className="text-gray-700">{errorMessage}</p>

            {showDetails && errorInfo && (
              <div className="mt-4">
                <details className="text-xs">
                  <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
                    {t("errors.查看技术详情")}
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto text-xs text-gray-800">
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
              <Home className="h-4 w-4" />
              <span>{t("errors.返回首页")}</span>
            </Link>
          </Button>

          {resetError && (
            <Button onClick={resetError} className="flex items-center gap-1 bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4" />
              <span>{t("errors.重试")}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
