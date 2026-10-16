"use client"

import { useWizard } from "./wizard-context"
import { WizardNavigation } from "./wizard-navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataIntegrationName } from "@/lib/yyc3/i18n/data"

export function StepConnectionTest() {
  const { t } = useI18n()
  const { formData, connectionStatus, connectionMessage, setConnectionStatus } = useWizard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const testConnection = async () => {
    setConnectionStatus("testing")
    setIsSubmitting(true)

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 随机成功或失败，实际应用中应该调用真实的API
      const isSuccess = Math.random() > 0.3

      if (isSuccess) {
        setConnectionStatus("success", t("install.连接成功！集成应用已准备就绪。"))
      } else {
        setConnectionStatus("error", t("install.连接失败。请检查您的认证信息并重试。"))
      }
    } catch (error) {
      setConnectionStatus("error", t("install.发生错误，请稍后重试。"))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // 组件加载时自动测试连接
    testConnection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium mb-2">{t("install.连接信息")}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">{t("install.集成名称:")}</div>
            <div>{dataIntegrationName(formData.name)}</div>
            <div className="text-gray-500">{t("install.环境:")}</div>
            <div>
              {formData.environment === "production"
                ? t("install.生产环境")
                : formData.environment === "development"
                  ? t("install.开发环境")
                  : formData.environment === "testing"
                    ? t("install.测试环境")
                    : t("install.预发布环境")}
            </div>
            <div className="text-gray-500">{t("install.认证方式:")}</div>
            <div>{formData.authType === "apiKey" ? t("install.API密钥") : "OAuth 2.0"}</div>
            <div className="text-gray-500">{t("install.数据格式:")}</div>
            <div>{formData.dataFormat?.toUpperCase()}</div>
            <div className="text-gray-500">{t("install.同步间隔:")}</div>
            <div>{t("install.{count} 分钟", { count: String(formData.syncInterval) })}</div>
          </div>
        </div>

        <div
          className={cn(
            "p-4 rounded-lg",
            connectionStatus === "success" && "bg-green-50 border-green-200 border",
            connectionStatus === "error" && "bg-red-50 border-red-200 border",
            connectionStatus === "testing" && "bg-blue-50 border-blue-200 border",
            connectionStatus === "idle" && "bg-gray-50 border",
          )}
        >
          <div className="flex items-center gap-3">
            {connectionStatus === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {connectionStatus === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
            {connectionStatus === "testing" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
            {connectionStatus === "idle" && <RefreshCw className="h-5 w-5 text-gray-500" />}

            <div>
              <h3 className="font-medium">
                {connectionStatus === "success" && t("install.连接成功")}
                {connectionStatus === "error" && t("install.连接失败")}
                {connectionStatus === "testing" && t("install.正在测试连接")}
                {connectionStatus === "idle" && t("install.准备测试连接")}
              </h3>
              <p className="text-sm text-gray-600">{connectionMessage}</p>
            </div>
          </div>
        </div>

        {connectionStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("install.连接错误")}</AlertTitle>
            <AlertDescription>{t("install.无法连接到集成应用。请检查您的认证信息并确保网络连接正常。")}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button
            onClick={testConnection}
            disabled={isSubmitting || connectionStatus === "testing"}
            variant="outline"
            className="gap-2"
          >
            {isSubmitting || connectionStatus === "testing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("install.测试中...")}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                {t("install.重新测试连接")}
              </>
            )}
          </Button>
        </div>
      </div>

      <WizardNavigation disableNext={connectionStatus === "error" || connectionStatus === "testing"} />
    </div>
  )
}
