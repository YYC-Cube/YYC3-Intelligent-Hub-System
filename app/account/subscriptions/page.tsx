"use client"

import { PageContainer } from "@/app/components/layout/page-container"
import { PageHeader } from "@/app/components/layout/page-header"
import { ConfirmActionDialog } from "@/app/components/ui/confirm-action-dialog"
import { EmptyState } from "@/app/components/ui/empty-state"
import { AuthProvider, useAuth } from "@/app/context/auth-context"
import { SubscriptionProvider, useSubscription } from "@/app/context/subscription-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tc } from "@/lib/yyc3/i18n"
import { AlertTriangle, BellOff, PauseCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function SubscriptionsPageContent() {
  const { subscriptions, unsubscribe, updateSubscriptionSettings } = useSubscription()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { t } = useI18n()

  if (!isAuthenticated) {
    return (
      <PageContainer className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-warning" />
              <h2 className="text-xl font-semibold">{t("account.需要登录")}</h2>
              <p className="text-muted-foreground">{t("account.请登录以管理您的订阅")}</p>
              <Button onClick={() => router.push("/login")}>{t("account.前往登录")}</Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const activeSubscriptions = subscriptions.filter(s => s.notificationEnabled)
  const pausedSubscriptions = subscriptions.filter(s => !s.notificationEnabled)

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title={t("account.订阅管理")}
          description={t("account.管理您的通知和更新订阅")}
        />

        <Tabs defaultValue="active" className="w-full">
          {/* 移动端缩小标签字号避免三列挤压（grid-cols-3 在 sm 以下会截断文案） */}
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="active">
              {t("account.活跃订阅 ({count})", { count: String(activeSubscriptions.length) })}
            </TabsTrigger>
            <TabsTrigger value="paused">
              {t("account.已暂停 ({count})", { count: String(pausedSubscriptions.length) })}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {t("account.设置")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeSubscriptions.length === 0 ? (
              <EmptyState
                size="sm"
                icon={<BellOff className="h-6 w-6 text-brand-500" aria-hidden="true" />}
                title={t("account.暂无活跃订阅")}
                description={t("account.您可以在集成应用详情页订阅感兴趣的内容更新。")}
                actions={
                  <Button asChild variant="outline">
                    <Link href="/marketplace">{t("account.浏览集成市场")}</Link>
                  </Button>
                }
              />
            ) : (
              activeSubscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{sub.targetName}</CardTitle>
                      <CardDescription>{tc("account", sub.type)} - {tc("account", sub.frequency)}</CardDescription>
                    </div>
                    <ConfirmActionDialog
                      trigger={
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title={t("account.确认取消订阅？")}
                      description={t("account.此操作将停止接收 “{name}” 的所有通知。", {
                        name: sub.targetName,
                      })}
                      onConfirm={() => unsubscribe(sub.id)}
                      cancelLabel={t("account.取消")}
                      confirmLabel={t("account.确认")}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={sub.notificationEnabled}
                          onCheckedChange={(checked) =>
                            updateSubscriptionSettings(sub.id, {
                              notificationEnabled: checked,
                            })
                          }
                        />
                        <Label>{sub.notificationEnabled ? t("account.已启用") : t("account.已禁用")}</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {sub.emailNotification ? t("account.邮件通知已开启") : t("account.仅应用内通知")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-4">
            {pausedSubscriptions.length === 0 ? (
              <EmptyState
                size="sm"
                icon={<PauseCircle className="h-6 w-6 text-brand-500" aria-hidden="true" />}
                title={t("account.暂无已暂停的订阅")}
                description={t("account.暂停的订阅将保留在此处，可随时恢复接收通知。")}
              />
            ) : (
              pausedSubscriptions.map((sub) => (
                <Card key={sub.id} className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-base">{sub.targetName}</CardTitle>
                    <CardDescription>{tc("account", sub.type)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateSubscriptionSettings(sub.id, {
                          notificationEnabled: true,
                        })
                      }
                    >
                      {t("account.重新启用")}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t("account.全局设置")}</CardTitle>
                <CardDescription>{t("account.配置所有订阅的全局偏好设置")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t("account.启用邮件通知")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("account.通过电子邮件接收重要更新")}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t("account.启用浏览器推送")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t("account.在浏览器中接收实时通知")}
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("account.通知频率")}</Label>
                    <RadioGroup defaultValue="instant" className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instant" id="instant" />
                        <Label htmlFor="instant">{t("account.实时")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily2" />
                        <Label htmlFor="daily2">{t("account.每日摘要")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly2" />
                        <Label htmlFor="weekly2">{t("account.每周摘要")}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default function SubscriptionsPage() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <SubscriptionsPageContent />
      </SubscriptionProvider>
    </AuthProvider>
  )
}
