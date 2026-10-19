"use client"

import { Badge } from "@/components/ui/badge"

import { LoginForm } from "@/app/components/auth/login-form"
import { PageContainer } from "@/app/components/layout/page-container"
import { PageHeader } from "@/app/components/layout/page-header"
import { useAuth } from "@/app/context/auth-context"
import { useFavorites } from "@/app/context/favorites-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, formatDistanceToNow } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { AlertTriangle, ArrowLeft, Check, Cloud, CloudOff, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SyncSettingsPage() {
  const { isAuthenticated, user } = useAuth()
  const { syncOptions, updateSyncOptions, syncWithCloud, syncStatus, lastSyncTime, hasPendingChanges } = useFavorites()
  const [localSyncOptions, setLocalSyncOptions] = useState(syncOptions)
  const router = useRouter()
  const { t, locale } = useI18n()

  // 当同步选项变化时更新本地状态
  useEffect(() => {
    setLocalSyncOptions(syncOptions)
  }, [syncOptions])

  // 处理同步选项变更
  const handleOptionChange = (key: keyof typeof syncOptions, value: any) => {
    const newOptions = { ...localSyncOptions, [key]: value }
    setLocalSyncOptions(newOptions)
    updateSyncOptions(newOptions)
  }

  // 处理手动同步（成功/失败反馈由 favorites-context 的 syncWithCloud 统一 toast，页面层不再重复）
  const handleSync = async () => {
    await syncWithCloud()
  }

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("account.从未同步")
    try {
      const date = new Date(dateString)
      const dateLocale = locale === "en" ? enUS : zhCN
      const pattern = locale === "en" ? "yyyy-MM-dd HH:mm:ss" : "yyyy年MM月dd日 HH:mm:ss"
      return `${format(date, pattern)} (${formatDistanceToNow(date, { addSuffix: true, locale: dateLocale })})`
    } catch (error) {
      return t("account.日期格式错误")
    }
  }

  // 如果未登录，显示登录表单
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="flex items-center mb-6">
          <Link href="/favorites" className="text-primary hover:underline mr-2">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            {t("account.返回收藏")}
          </Link>
        </div>

        <div className="max-w-content mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudOff className="mr-2 h-5 w-5 text-muted-foreground" />
                {t("account.未登录")}
              </CardTitle>
              <CardDescription>{t("account.请登录以管理您的同步设置")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={() => router.refresh()} />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        crumbs={[
          { label: t("account.账户中心"), href: "/account/sync" },
          { label: t("account.云同步设置") },
        ]}
        title={t("account.云同步设置")}
        description={t("account.管理您的收藏数据如何在多设备间同步")}
        className="mb-6"
      />

      <div className="flex items-center mb-6">
        <Link href="/favorites" className="text-primary hover:underline mr-2">
          <ArrowLeft className="mr-2 h-4 w-4 inline" />
          {t("account.返回收藏")}
        </Link>
      </div>

      <div className="max-w-content mx-auto">
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-brand-50 border border-brand-100">
              <div className="flex items-center">
                {syncStatus === "syncing" ? (
                  <Loader2 className="h-5 w-5 mr-3 text-warning animate-spin" />
                ) : syncStatus === "error" ? (
                  <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
                ) : syncStatus === "conflict" ? (
                  <AlertTriangle className="h-5 w-5 mr-3 text-warning" />
                ) : syncStatus === "success" ? (
                  <Check className="h-5 w-5 mr-3 text-success" />
                ) : hasPendingChanges ? (
                  <Cloud className="h-5 w-5 mr-3 text-primary" />
                ) : (
                  <Cloud className="h-5 w-5 mr-3 text-primary" />
                )}
                <div>
                  <h3 className="font-medium">
                    {syncStatus === "syncing"
                      ? t("account.正在同步...")
                      : syncStatus === "error"
                        ? t("account.同步失败")
                        : syncStatus === "conflict"
                          ? t("account.存在冲突")
                          : hasPendingChanges
                            ? t("account.有未同步的更改")
                            : t("account.同步状态")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lastSyncTime
                      ? t("account.上次同步: {time}", { time: formatDate(lastSyncTime) })
                      : t("account.从未同步")}
                  </p>
                </div>
              </div>
              <Button onClick={handleSync} disabled={syncStatus === "syncing"} className="gap-2">
                {syncStatus === "syncing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("account.同步中...")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {t("account.立即同步")}
                  </>
                )}
              </Button>
            </div>

            <Tabs defaultValue="general" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="general">{t("account.常规设置")}</TabsTrigger>
                <TabsTrigger value="advanced">{t("account.高级设置")}</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoSync">{t("account.自动同步")}</Label>
                      <p className="text-sm text-muted-foreground">{t("account.定期自动同步您的收藏数据")}</p>
                    </div>
                    <Switch
                      id="autoSync"
                      checked={localSyncOptions.autoSync}
                      onCheckedChange={(checked) => handleOptionChange("autoSync", checked)}
                    />
                  </div>

                  {localSyncOptions.autoSync && (
                    <div className="space-y-2 pl-6 border-l-2 border-border">
                      <Label>
                        {t("account.同步间隔: {interval} 分钟", { interval: String(localSyncOptions.syncInterval) })}
                      </Label>
                      <Slider
                        value={[localSyncOptions.syncInterval]}
                        min={5}
                        max={120}
                        step={5}
                        onValueChange={(value) => handleOptionChange("syncInterval", value[0])}
                      />
                      <p className="text-xs text-muted-foreground">{t("account.设置自动同步的时间间隔，建议设置为15-60分钟")}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="syncOnStartup">{t("account.启动时同步")}</Label>
                      <p className="text-sm text-muted-foreground">{t("account.每次打开应用时自动同步")}</p>
                    </div>
                    <Switch
                      id="syncOnStartup"
                      checked={localSyncOptions.syncOnStartup}
                      onCheckedChange={(checked) => handleOptionChange("syncOnStartup", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="syncOnChange">{t("account.变更时同步")}</Label>
                      <p className="text-sm text-muted-foreground">{t("account.当收藏列表变更时自动同步")}</p>
                    </div>
                    <Switch
                      id="syncOnChange"
                      checked={localSyncOptions.syncOnChange}
                      onCheckedChange={(checked) => handleOptionChange("syncOnChange", checked)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">{t("account.冲突解决策略")}</Label>
                    <p className="text-sm text-muted-foreground mb-4">{t("account.当本地数据与云端数据冲突时的处理方式")}</p>

                    <RadioGroup
                      value={localSyncOptions.conflictResolution}
                      onValueChange={(value) => handleOptionChange("conflictResolution", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="manual" id="manual" className="mt-1" />
                        <div>
                          <Label htmlFor="manual" className="font-medium">
                            {t("account.手动解决")}
                          </Label>
                          <p className="text-sm text-muted-foreground">{t("account.当发生冲突时提示您手动选择保留哪个版本")}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="local" id="local" className="mt-1" />
                        <div>
                          <Label htmlFor="local" className="font-medium">
                            {t("account.优先本地数据")}
                          </Label>
                          <p className="text-sm text-muted-foreground">{t("account.当发生冲突时，始终使用本地数据覆盖云端数据")}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="remote" id="remote" className="mt-1" />
                        <div>
                          <Label htmlFor="remote" className="font-medium">
                            {t("account.优先云端数据")}
                          </Label>
                          <p className="text-sm text-muted-foreground">{t("account.当发生冲突时，始终使用云端数据覆盖本地数据")}</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-base font-medium mb-2">{t("account.数据管理")}</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Cloud className="mr-2 h-4 w-4" />
                        {t("account.导出收藏数据")}
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Cloud className="mr-2 h-4 w-4" />
                        {t("account.导入收藏数据")}
                      </Button>
                      <Button variant="destructive" className="w-full justify-start">
                        <CloudOff className="mr-2 h-4 w-4" />
                        {t("account.清除云端数据")}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/favorites">{t("account.取消")}</Link>
            </Button>
            <Button onClick={handleSync}>{t("account.保存并同步")}</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("account.设备同步状态")}</CardTitle>
            <CardDescription>{t("account.查看您的收藏数据在不同设备上的同步状态")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-success/10 border-success/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center mr-3">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t("account.当前设备")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lastSyncTime
                          ? t("account.上次同步: {time}", { time: formatDate(lastSyncTime) })
                          : t("account.从未同步")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    {t("account.已同步")}
                  </Badge>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground py-4">
                {t("account.在其他设备上登录您的账户，即可在多设备间同步您的收藏数据")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
