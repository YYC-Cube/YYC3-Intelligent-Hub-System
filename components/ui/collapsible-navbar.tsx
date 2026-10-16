"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/app/components/ui/logo"
import { Button3D } from "@/app/components/ui/3d-button"
import { LanguageSwitcher } from "@/app/components/i18n/language-switcher"
import { Menu, X, Home, Grid3X3, Store, Heart, User, Settings, Bell, Search, ChevronDown } from "lucide-react"
import { SyncIndicator } from "@/app/components/sync/sync-indicator"
import { EncryptionStatus } from "@/app/components/encryption/encryption-status"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "系统首页",
    href: "/",
    icon: Home,
    description: "返回系统主页",
  },
  {
    name: "集成中心",
    href: "/integrations",
    icon: Grid3X3,
    description: "管理所有集成应用",
  },
  {
    name: "应用市场",
    href: "/marketplace",
    icon: Store,
    description: "发现新的集成应用",
  },
  {
    name: "我的收藏",
    href: "/favorites",
    icon: Heart,
    description: "查看收藏的应用",
  },
]

const accountItems = [
  {
    name: "账户设置",
    href: "/account/sync",
    icon: User,
    description: "管理账户信息",
  },
  {
    name: "系统设置",
    href: "/admin",
    icon: Settings,
    description: "系统配置管理",
  },
]

interface CollapsibleNavbarProps {
  className?: string
}

export function CollapsibleNavbar({ className }: CollapsibleNavbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountExpanded, setIsAccountExpanded] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  // 自动收缩逻辑
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsCollapsed(scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-blue-50/95 via-sky-50/95 to-cyan-50/95",
        "backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r",
        "supports-[backdrop-filter]:from-blue-50/80 supports-[backdrop-filter]:via-sky-50/80 supports-[backdrop-filter]:to-cyan-50/80",
        "border-b border-blue-200/50 shadow-sm",
        "h-16",
        className
      )}>
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* 左侧：Logo和系统名称 */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Logo />
            
          </div>

          {/* 中央：导航菜单 - 桌面端 */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)

              return (
                <Button3D
                  key={item.name}
                  variant={isActive ? "primary" : "glass"}
                  size="sm"
                  effect={isActive ? "glow" : "float"}
                  className={cn(
                    "transition-all duration-300 px-3 py-2 whitespace-nowrap",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-lg"
                      : "text-blue-700 hover:bg-blue-100/50",
                  )}
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{tc("nav", item.name)}</span>
                  </Link>
                </Button3D>
              )
            })}
          </nav>

          {/* 右侧：搜索和操作区域 */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 语言切换 */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* 搜索框 - 桌面端 */}
            <div className="relative hidden xl:block w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t("nav.搜索应用...")}
                className="w-full pl-10 pr-4 py-1.5 text-sm rounded-lg border border-blue-200/50 bg-white/70 backdrop-blur-sm text-gray-700 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 shadow-sm"
              />
            </div>

            {/* 状态指示器 - 桌面端 */}
            <div className="hidden md:flex items-center space-x-2">
              <EncryptionStatus />
              <SyncIndicator />
            </div>

            {/* 通知按钮 - 桌面端 */}
            <Button3D
              variant="glass"
              size="sm"
              effect="float"
              icon={<Bell className="h-4 w-4" />}
              className="relative hidden md:flex text-blue-600 hover:bg-blue-100/50"
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button3D>

            {/* 账户菜单 - 桌面端 */}
            <div className="hidden lg:block relative">
              <Button3D
                variant="glass"
                size="sm"
                effect="float"
                onClick={() => setIsAccountExpanded(!isAccountExpanded)}
                className="flex items-center space-x-1 text-blue-700 hover:bg-blue-100/50 px-2"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">{t("nav.账户")}</span>
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-200", isAccountExpanded && "rotate-180")}
                />
              </Button3D>

              {isAccountExpanded && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-blue-200/50 py-2 z-50">
                  {accountItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsAccountExpanded(false)}
                      >
                        <Icon className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium text-sm">{tc("nav", item.name)}</div>
                          <div className="text-xs text-gray-500">{tc("nav", item.description)}</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 移动端菜单按钮 */}
            <Button3D
              variant="glass"
              size="sm"
              effect="float"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-blue-700 hover:bg-blue-100/50"
              icon={isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-blue-200/50 shadow-lg z-50">
            <div className="container mx-auto px-4 py-4">
              {/* 语言切换 - 移动端 */}
              <div className="mb-4 flex justify-center">
                <LanguageSwitcher />
              </div>

              {/* 搜索栏 - 移动端 */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={t("nav.搜索集成应用...")}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200/50 bg-white/70 backdrop-blur-sm text-gray-700 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
                  />
                </div>
              </div>

              {/* 导航菜单 */}
              <div className="space-y-2 mb-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.href)

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{tc("nav", item.name)}</div>
                        <div className={cn("text-xs", isActive ? "text-blue-100" : "text-gray-500")}>
                          {tc("nav", item.description)}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* 状态指示器 - 移动端 */}
              <div className="flex items-center justify-between mb-4 p-3 bg-blue-50/50 rounded-lg">
                <EncryptionStatus />
                <SyncIndicator />
              </div>

              {/* 账户菜单 - 移动端 */}
              <div className="pt-4 border-t border-blue-200/50">
                <div className="space-y-2">
                  {accountItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{tc("nav", item.name)}</div>
                          <div className="text-xs text-gray-500">{tc("nav", item.description)}</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
