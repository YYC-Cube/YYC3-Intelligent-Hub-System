"use client"

import { ArrowLeft, Heart, Loader2, Mail, ShieldCheck, User as UserIcon } from "lucide-react"
import Link from "next/link"

import { PageContainer } from "@/app/components/layout/page-container"
import { useAuth } from "@/app/context/auth-context"
import { useFavorites } from "@/app/context/favorites-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/**
 * 账号资料页面。
 *
 * 汇总当前登录用户的基本信息、收藏统计与账号相关快捷入口。页面不提供
 * 直接改写资料的入口，避免在缺少服务端持久化抽象层时产生「已保存但未生效」
 * 的误导性交互。
 *
 * @returns 账号资料视图
 */
export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { favorites } = useFavorites()
  const { t } = useI18n()

  /** 账号相关快捷入口 */
  const accountShortcuts = [
    { href: "/favorites", label: t("account.我的收藏"), description: t("account.查看已收藏的集成应用") },
    { href: "/account/encryption", label: t("account.加密设置"), description: t("account.管理本地数据加密与密钥") },
    { href: "/account/sync", label: t("account.同步设置"), description: t("account.配置多设备数据同步策略") },
    { href: "/account/subscriptions", label: t("account.订阅与积分"), description: t("account.查看套餐、积分余额与消耗记录") },
  ] as const

  const displayName = user?.name ?? t("account.未登录")
  const initial = displayName.slice(0, 1).toUpperCase()

  return (
    <PageContainer>
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        {t("account.返回首页")}
      </Link>

      <h1 className="mb-6 text-2xl font-bold">{t("account.账号资料")}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          {t("account.正在加载账号信息…")}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("account.基本信息")}</CardTitle>
              <CardDescription>{t("account.账号标识与安全状态概览")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{isAuthenticated ? initial : <UserIcon className="h-6 w-6" />}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{displayName}</p>
                  <Badge variant={isAuthenticated ? "default" : "secondary"}>
                    {isAuthenticated ? t("account.已登录") : t("account.未登录")}
                  </Badge>
                </div>
              </div>

              <Separator />

              <dl className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <dt className="w-20 text-sm text-muted-foreground">{t("account.邮箱")}</dt>
                  <dd className="text-sm">{user?.email ?? "—"}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <dt className="w-20 text-sm text-muted-foreground">{t("account.收藏")}</dt>
                  <dd className="text-sm">
                    {t("account.{count} 个集成应用", { count: String(favorites.length) })}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <dt className="w-20 text-sm text-muted-foreground">{t("account.最近同步")}</dt>
                  <dd className="text-sm">{user?.lastSyncTime ?? "—"}</dd>
                </div>
              </dl>

              {!isAuthenticated ? (
                <p className="rounded-md bg-warning/10 p-3 text-sm text-warning">
                  {t("account.登录后可同步收藏、订阅与加密配置。请前往")}
                  <Link href="/" className="mx-1 text-primary hover:underline">
                    {t("account.首页")}
                  </Link>
                  {t("account.完成登录。")}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("account.快捷入口")}</CardTitle>
              <CardDescription>{t("account.账号与数据管理")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {accountShortcuts.map((shortcut) => (
                <Button key={shortcut.href} asChild variant="outline" className="h-auto w-full justify-start py-3">
                  <Link href={shortcut.href} className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{shortcut.label}</span>
                    <span className="text-xs font-normal text-muted-foreground">{shortcut.description}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}
