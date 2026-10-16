"use client"

import type React from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Settings, Users, Database, Shield, Terminal, FileText, BarChart, Globe, Zap, Layers } from "lucide-react"
import { useI18n } from "@/app/hooks/use-i18n"

interface AdminCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function AdminCard({ title, description, icon, href, color }: AdminCardProps) {
  const { t } = useI18n()
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={`h-2 ${color}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div
            className={`p-2 rounded-full ${color.replace("bg-", "bg-").replace("from-", "bg-").split(" ")[0].replace("600", "100")} ${color.replace("bg-", "text-").replace("from-", "text-").split(" ")[0]}`}
          >
            {icon}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className={`w-full ${color}`}>{t("admin.访问")}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function AdminDashboard() {
  const { t } = useI18n()
  const adminCards: AdminCardProps[] = [
    {
      title: t("admin.系统设置"),
      description: t("admin.管理系统全局配置和偏好设置"),
      icon: <Settings className="h-6 w-6" />,
      href: "/admin/settings",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: t("admin.用户管理"),
      description: t("admin.管理用户账户、权限和角色"),
      icon: <Users className="h-6 w-6" />,
      href: "/admin/users",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: t("admin.数据管理"),
      description: t("admin.管理系统数据和数据库配置"),
      icon: <Database className="h-6 w-6" />,
      href: "/admin/data",
      color: "bg-amber-600 hover:bg-amber-700",
    },
    {
      title: t("admin.安全中心"),
      description: t("admin.管理系统安全设置和访问控制"),
      icon: <Shield className="h-6 w-6" />,
      href: "/admin/security",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: t("admin.环境变量"),
      description: t("admin.查看和管理系统环境变量"),
      icon: <Terminal className="h-6 w-6" />,
      href: "/admin/env-check",
      color: "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800",
    },
    {
      title: t("admin.日志中心"),
      description: t("admin.查看系统日志和操作记录"),
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/logs",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: t("admin.统计分析"),
      description: t("admin.查看系统使用统计和分析报告"),
      icon: <BarChart className="h-6 w-6" />,
      href: "/admin/analytics",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: t("admin.集成管理"),
      description: t("admin.管理第三方服务集成和API配置"),
      icon: <Layers className="h-6 w-6" />,
      href: "/admin/integrations",
      color: "bg-pink-600 hover:bg-pink-700",
    },
    {
      title: t("admin.国际化"),
      description: t("admin.管理多语言翻译和本地化设置"),
      icon: <Globe className="h-6 w-6" />,
      href: "/admin/i18n",
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      title: t("admin.性能优化"),
      description: t("admin.监控和优化系统性能"),
      icon: <Zap className="h-6 w-6" />,
      href: "/admin/performance",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("admin.管理员控制台")}</h1>
        <p className="text-gray-500">{t("admin.管理和配置言语云³集成中心系统")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <AdminCard key={index} {...card} />
        ))}
      </div>
    </div>
  )
}
