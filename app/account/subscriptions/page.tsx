"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { SubscriptionProvider, useSubscription, type Subscription, type SubscriptionType } from "@/app/context/subscription-context"
import { AuthProvider, useAuth } from "@/app/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bell, Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

function SubscriptionsPageContent() {
  const { subscriptions, unsubscribe, updateSubscriptionSettings } = useSubscription()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500" />
              <h2 className="text-xl font-semibold">需要登录</h2>
              <p className="text-muted-foreground">请登录以管理您的订阅</p>
              <Button onClick={() => router.push("/login")}>前往登录</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeSubscriptions = subscriptions.filter(s => s.notificationEnabled)
  const pausedSubscriptions = subscriptions.filter(s => !s.notificationEnabled)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">订阅管理</h1>
            <p className="text-muted-foreground">管理您的通知和更新订阅</p>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                活跃订阅 ({activeSubscriptions.length})
              </TabsTrigger>
              <TabsTrigger value="paused">
                已暂停 ({pausedSubscriptions.length})
              </TabsTrigger>
              <TabsTrigger value="settings">
                设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeSubscriptions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    暂无活跃订阅
                  </CardContent>
                </Card>
              ) : (
                activeSubscriptions.map((sub) => (
                  <Card key={sub.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{sub.targetName}</CardTitle>
                        <CardDescription>{sub.type} - {sub.frequency}</CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认取消订阅？</AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作将停止接收 &ldquo;{sub.targetName}&rdquo; 的所有通知。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => unsubscribe(sub.id)}>
                              确认
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                          <Label>{sub.notificationEnabled ? "已启用" : "已禁用"}</Label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {sub.emailNotification ? "邮件通知已开启" : "仅应用内通知"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="paused" className="space-y-4">
              {pausedSubscriptions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    暂无已暂停的订阅
                  </CardContent>
                </Card>
              ) : (
                pausedSubscriptions.map((sub) => (
                  <Card key={sub.id} className="opacity-60">
                    <CardHeader>
                      <CardTitle className="text-base">{sub.targetName}</CardTitle>
                      <CardDescription>{sub.type}</CardDescription>
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
                        重新启用
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>全局设置</CardTitle>
                  <CardDescription>配置所有订阅的全局偏好设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>启用邮件通知</Label>
                        <p className="text-sm text-muted-foreground">
                          通过电子邮件接收重要更新
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>启用浏览器推送</Label>
                        <p className="text-sm text-muted-foreground">
                          在浏览器中接收实时通知
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="space-y-2">
                      <Label>通知频率</Label>
                      <RadioGroup defaultValue="instant" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="instant" id="instant" />
                          <Label htmlFor="instant">实时</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily2" />
                          <Label htmlFor="daily2">每日摘要</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly2" />
                          <Label htmlFor="weekly2">每周摘要</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
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