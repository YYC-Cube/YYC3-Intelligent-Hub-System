"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"

export type SubscriptionType = "category" | "developer" | "integration"

export interface Subscription {
  id: string
  userId: string
  type: SubscriptionType
  targetId: string // 分类名称、开发者ID或集成ID
  targetName: string // 显示名称
  createdAt: string
  notificationEnabled: boolean
  emailNotification: boolean
  frequency: "instant" | "daily" | "weekly"
}

interface SubscriptionContextType {
  subscriptions: Subscription[]
  isLoading: boolean
  subscribe: (type: SubscriptionType, targetId: string, targetName: string) => Promise<boolean>
  unsubscribe: (subscriptionId: string) => Promise<boolean>
  isSubscribed: (type: SubscriptionType, targetId: string) => boolean
  updateSubscriptionSettings: (
    subscriptionId: string,
    settings: Partial<Pick<Subscription, "notificationEnabled" | "emailNotification" | "frequency">>,
  ) => Promise<boolean>
  getSubscriptionsByType: (type: SubscriptionType) => Subscription[]
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}

interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { t } = useI18n()

  // 加载订阅数据
  useEffect(() => {
    const loadSubscriptions = () => {
      if (!isAuthenticated || !user) {
        setSubscriptions([])
        setIsLoading(false)
        return
      }

      try {
        // 从localStorage加载订阅数据
        const storedSubscriptions = localStorage.getItem(`subscriptions_${user.id}`)
        if (storedSubscriptions) {
          setSubscriptions(JSON.parse(storedSubscriptions))
        }
      } catch (error) {
        console.error("加载订阅数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscriptions()
  }, [isAuthenticated, user])

  // 保存订阅数据到localStorage
  const saveSubscriptions = (newSubscriptions: Subscription[]) => {
    if (!user) return

    try {
      localStorage.setItem(`subscriptions_${user.id}`, JSON.stringify(newSubscriptions))
      setSubscriptions(newSubscriptions)
    } catch (error) {
      console.error("保存订阅数据失败:", error)
    }
  }

  // 添加订阅
  const subscribe = async (type: SubscriptionType, targetId: string, targetName: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: t("common.需要登录"),
        description: t("common.请先登录后再订阅"),
        variant: "destructive",
      })
      return false
    }

    try {
      // 检查是否已订阅
      if (isSubscribed(type, targetId)) {
        toast({
          title: t("common.已订阅"),
          description: t("common.您已经订阅了该{type}", {
            type: t(
              type === "category" ? "common.分类" : type === "developer" ? "common.开发者" : "common.集成",
            ),
          }),
        })
        return false
      }

      // 创建新订阅
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: user.id,
        type,
        targetId,
        targetName,
        createdAt: new Date().toISOString(),
        notificationEnabled: true,
        emailNotification: true,
        frequency: "instant",
      }

      const newSubscriptions = [...subscriptions, newSubscription]
      saveSubscriptions(newSubscriptions)

      toast({
        title: t("common.订阅成功"),
        description: t("common.您已成功订阅{name}", { name: targetName }),
      })

      return true
    } catch (error) {
      console.error("订阅失败:", error)
      toast({
        title: t("common.订阅失败"),
        description: t("common.发生错误，请稍后重试"),
        variant: "destructive",
      })
      return false
    }
  }

  // 取消订阅
  const unsubscribe = async (subscriptionId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false

    try {
      const subscription = subscriptions.find((sub) => sub.id === subscriptionId)
      if (!subscription) return false

      const newSubscriptions = subscriptions.filter((sub) => sub.id !== subscriptionId)
      saveSubscriptions(newSubscriptions)

      toast({
        title: "取消订阅成功",
        description: `您已取消订阅${subscription.targetName}`,
      })

      return true
    } catch (error) {
      console.error("取消订阅失败:", error)
      toast({
        title: "取消订阅失败",
        description: "发生错误，请稍后重试",
        variant: "destructive",
      })
      return false
    }
  }

  // 检查是否已订阅
  const isSubscribed = (type: SubscriptionType, targetId: string): boolean => {
    return subscriptions.some((sub) => sub.type === type && sub.targetId === targetId)
  }

  // 更新订阅设置
  const updateSubscriptionSettings = async (
    subscriptionId: string,
    settings: Partial<Pick<Subscription, "notificationEnabled" | "emailNotification" | "frequency">>,
  ): Promise<boolean> => {
    if (!isAuthenticated || !user) return false

    try {
      const newSubscriptions = subscriptions.map((sub) => {
        if (sub.id === subscriptionId) {
          return { ...sub, ...settings }
        }
        return sub
      })

      saveSubscriptions(newSubscriptions)

      toast({
        title: "设置已更新",
        description: "订阅设置已成功更新",
      })

      return true
    } catch (error) {
      console.error("更新订阅设置失败:", error)
      toast({
        title: "更新设置失败",
        description: "发生错误，请稍后重试",
        variant: "destructive",
      })
      return false
    }
  }

  // 按类型获取订阅
  const getSubscriptionsByType = (type: SubscriptionType): Subscription[] => {
    return subscriptions.filter((sub) => sub.type === type)
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        isLoading,
        subscribe,
        unsubscribe,
        isSubscribed,
        updateSubscriptionSettings,
        getSubscriptionsByType,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
