"use client"

import { useI18n } from "@/app/hooks/use-i18n"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useWizard } from "./wizard-context"
import { WizardNavigation } from "./wizard-navigation"

export function StepConfiguration() {
  const { t } = useI18n()
  const { formData, updateFormData } = useWizard()
  const [webhookUrl, setWebhookUrl] = useState(formData.webhookUrl || "")
  const [syncInterval, setSyncInterval] = useState(formData.syncInterval || 15)
  const [dataFormat, setDataFormat] = useState(formData.dataFormat || "json")
  const [enableNotifications, setEnableNotifications] = useState(formData.enableNotifications || false)
  const [enableLogging, setEnableLogging] = useState(formData.enableLogging || true)

  const handleNext = () => {
    updateFormData({
      webhookUrl,
      syncInterval,
      dataFormat,
      enableNotifications,
      enableLogging,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">{t("install.Webhook URL（可选）")}</Label>
          <Input
            id="webhookUrl"
            placeholder="https://your-domain.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="max-w-md"
          />
          <p className="text-xs text-muted-foreground">{t("install.输入接收事件通知的Webhook URL")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataFormat">{t("install.数据格式")}</Label>
          <Select value={dataFormat} onValueChange={setDataFormat}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t("install.选择数据格式")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t("install.选择数据交换的格式")}</p>
        </div>

        <div className="space-y-2">
          <Label>{t("install.同步间隔（分钟）: {syncInterval}", { syncInterval: String(syncInterval) })}</Label>
          <Slider
            value={[syncInterval]}
            onValueChange={(value) => setSyncInterval(value[0])}
            min={5}
            max={60}
            step={5}
            className="max-w-md"
          />
          <p className="text-xs text-muted-foreground">{t("install.设置数据同步的频率")}</p>
        </div>

        <div className="flex items-center justify-between max-w-md">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">{t("install.启用通知")}</Label>
            <p className="text-xs text-muted-foreground">{t("install.接收有关集成状态的通知")}</p>
          </div>
          <Switch id="notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
        </div>

        <div className="flex items-center justify-between max-w-md">
          <div className="space-y-0.5">
            <Label htmlFor="logging">{t("install.启用日志记录")}</Label>
            <p className="text-xs text-muted-foreground">{t("install.记录集成活动以便于故障排除")}</p>
          </div>
          <Switch id="logging" checked={enableLogging} onCheckedChange={setEnableLogging} />
        </div>
      </div>

      <WizardNavigation onComplete={handleNext} />
    </div>
  )
}
