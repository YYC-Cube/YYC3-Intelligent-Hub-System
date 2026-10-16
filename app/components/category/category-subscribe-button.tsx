"use client"

import { useState } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/app/context/subscription-context"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataCat } from "@/lib/yyc3/i18n/data"

interface CategorySubscribeButtonProps {
  categoryName: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showText?: boolean
}

export default function CategorySubscribeButton({
  categoryName,
  variant = "outline",
  size = "default",
  showText = true,
}: CategorySubscribeButtonProps) {
  const { isAuthenticated } = useAuth()
  const { subscribe, unsubscribe, isSubscribed, subscriptions } = useSubscription()
  const { toast } = useToast()
  const { t } = useI18n()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [emailNotification, setEmailNotification] = useState(true)
  const [frequency, setFrequency] = useState<"instant" | "daily" | "weekly">("instant")

  const subscribed = isSubscribed("category", categoryName)

  // 订阅 ID 由订阅列表派生，避免在 effect 中同步写入 state。
  const subscriptionId = subscribed
    ? (subscriptions.find((s) => s.type === "category" && s.targetId === categoryName)?.id ?? null)
    : null

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast({
        title: t("category.需要登录"),
        description: t("category.请先登录后再订阅分类"),
        variant: "destructive",
      })
      return
    }

    if (subscribed) {
      if (subscriptionId) {
        await unsubscribe(subscriptionId)
      }
    } else {
      setIsDialogOpen(true)
    }
  }

  const confirmSubscribe = async () => {
    const success = await subscribe("category", categoryName, categoryName)
    if (success) {
      setIsDialogOpen(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-2",
    default: "h-10 px-4",
    lg: "h-11 px-5",
  }

  return (
    <>
      <Button
        variant={subscribed ? "default" : variant}
        size={size}
        className={`${sizeClasses[size]} ${subscribed ? "bg-primary" : ""}`}
        onClick={handleSubscribe}
      >
        {subscribed ? (
          <>
            <BellOff className="h-4 w-4 mr-1" />
            {showText && t("category.取消订阅")}
          </>
        ) : (
          <>
            <Bell className="h-4 w-4 mr-1" />
            {showText && t("category.订阅分类")}
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("category.订阅分类: {name}", { name: dataCat(categoryName) })}</DialogTitle>
            <DialogDescription>
              {t("category.设置您希望如何接收该分类的更新通知。您可以随时在订阅管理中修改这些设置。")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>{t("category.应用内通知")}</span>
                <span className="font-normal text-xs text-muted-foreground">
                  {t("category.在应用中接收新集成和更新通知")}
                </span>
              </Label>
              <Switch id="notifications" checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                <span>{t("category.邮件通知")}</span>
                <span className="font-normal text-xs text-muted-foreground">
                  {t("category.通过邮件接收重要更新")}
                </span>
              </Label>
              <Switch id="email-notifications" checked={emailNotification} onCheckedChange={setEmailNotification} />
            </div>
            <div className="space-y-2">
              <Label>{t("category.通知频率")}</Label>
              <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant">{t("category.实时通知")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">{t("category.每日摘要")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">{t("category.每周摘要")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("category.取消")}
            </Button>
            <Button onClick={confirmSubscribe}>{t("category.确认订阅")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
