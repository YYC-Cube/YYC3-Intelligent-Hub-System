"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuth } from "@/app/context/auth-context"

/**
 * 路由权限守卫 —— 全站唯一的客户端鉴权出口。
 *
 * 背景：项目为 `output: "export"` 静态导出，无法使用 middleware.ts 做边缘守卫，
 * 因此守卫统一在受保护路由段的 layout 中以客户端组件形态挂载。
 *
 * 行为约定（三态，禁止业务页自行实现）：
 * 1. isLoading（会话恢复中）→ 渲染无障碍骨架（aria-busy），不泄露受保护内容；
 * 2. 未登录 → 重定向 `/login?redirect={当前路径}`，登录成功后原路回跳；
 * 3. 已登录 → 直接放行 children。
 *
 * 使用方式：仅在受保护路由段的 layout.tsx 中包裹（如 /admin、/account）。
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-busy="true"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="sr-only">正在验证登录状态</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    // 重定向进行中：渲染空白避免受保护内容闪现
    return null
  }

  return <>{children}</>
}
