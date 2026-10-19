"use client"

import { useVersionCheck } from "@/app/context/version-check-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { formatDate } from "@/app/utils/format-date"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Download, Settings, X } from "lucide-react"
import { useState } from "react"

export function UpdateNotification() {
  const { updateAvailable, updateInfo, dismissUpdate } = useVersionCheck()
  const { t } = useI18n()
  const [showDetails, setShowDetails] = useState(false)

  if (!updateAvailable || !updateInfo) {
    return null
  }

  const { currentVersion, latestVersion, updateType } = updateInfo
  const updateTypeText =
    updateType === "major" ? t("common.重大更新") : updateType === "minor" ? t("common.功能更新") : t("common.补丁更新")

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full shadow-lg">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                {t("common.发现新版本")}
                {/* 更新类型标签：收编至 Badge 语义变体（major=destructive / minor=info / patch=success） */}
                <Badge
                  variant={updateType === "major" ? "destructive" : updateType === "minor" ? "info" : "success"}
                  className="ml-2"
                >
                  {updateTypeText}
                </Badge>
              </CardTitle>
              <CardDescription>
                {t("common.版本 {latest} 已发布，您当前的版本是 {current}", {
                  latest: latestVersion.version,
                  current: currentVersion,
                })}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={dismissUpdate} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">{t("common.关闭")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {showDetails ? (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">{t("common.发布日期：")}</span> {formatDate(latestVersion.releaseDate)}
              </div>
              <div>
                <span className="font-medium">{t("common.更新内容：")}</span>
                <div className="mt-1 p-2 bg-muted rounded text-xs whitespace-pre-line">
                  {latestVersion.releaseNotes}
                </div>
              </div>
            </div>
          ) : (
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowDetails(true)}>
              {t("common.查看更新详情")}
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <UpdateSettings />
          <Button size="sm" className="gap-1" onClick={() => window.open(latestVersion.downloadUrl, "_blank")}>
            <Download className="h-4 w-4" />
            {t("common.立即更新")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function UpdateSettings() {
  const { settings, updateSettings } = useVersionCheck()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const handleIntervalChange = (value: string) => {
    const intervals: Record<string, number> = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      never: 0,
    }
    updateSettings({ checkInterval: intervals[value] })
  }

  const getIntervalValue = () => {
    const interval = settings.checkInterval
    if (interval === 0) return "never"
    if (interval <= 60 * 60 * 1000) return "hourly"
    if (interval <= 24 * 60 * 60 * 1000) return "daily"
    if (interval <= 7 * 24 * 60 * 60 * 1000) return "weekly"
    return "monthly"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          {t("common.更新设置")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("common.更新检查设置")}</DialogTitle>
          <DialogDescription>{t("common.配置应用如何检查和通知新版本")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-check">{t("common.自动检查更新")}</Label>
              <p className="text-sm text-muted-foreground">{t("common.允许应用定期检查新版本")}</p>
            </div>
            <Switch
              id="auto-check"
              checked={settings.autoCheck}
              onCheckedChange={(checked) => updateSettings({ autoCheck: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notify-startup">{t("common.启动时通知")}</Label>
              <p className="text-sm text-muted-foreground">{t("common.应用启动时检查并通知更新")}</p>
            </div>
            <Switch
              id="notify-startup"
              checked={settings.notifyOnStartup}
              onCheckedChange={(checked) => updateSettings({ notifyOnStartup: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-interval">{t("common.检查频率")}</Label>
            <Select value={getIntervalValue()} onValueChange={handleIntervalChange} disabled={!settings.autoCheck}>
              <SelectTrigger id="check-interval" className="w-full">
                <SelectValue placeholder={t("common.选择检查频率")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">{t("common.每小时")}</SelectItem>
                <SelectItem value="daily">{t("common.每天")}</SelectItem>
                <SelectItem value="weekly">{t("common.每周")}</SelectItem>
                <SelectItem value="monthly">{t("common.每月")}</SelectItem>
                <SelectItem value="never">{t("common.从不")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("common.保存设置")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
