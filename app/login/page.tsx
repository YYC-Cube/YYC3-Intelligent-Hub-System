"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { LoginForm } from "@/app/components/auth/login-form"
import { PageContainer } from "@/app/components/layout/page-container"

/** 登录成功后的回跳目标；仅接受站内路径，防开放重定向。 */
function safeRedirectTarget(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw
  return "/account/subscriptions"
}

/**
 * 登录成功处理器 —— 承接守卫的 `?redirect=` 原路回跳约定。
 * useSearchParams 必须位于 Suspense 边界内才能参与静态导出（否则构建期 CSR bailout）。
 */
function LoginSuccessHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeRedirectTarget(searchParams.get("redirect"))

  return (
    <LoginForm
      onSuccess={() => router.replace(redirectTo)}
      onCancel={() => router.push("/")}
    />
  )
}

/**
 * 账户登录页。
 *
 * 承接全站「前往登录」入口（RequireAuth 守卫未登录重定向），
 * 复用既有 `LoginForm` 与根布局注入的 `AuthProvider`，不再重复实现认证 UI。
 */
export default function LoginPage() {
  return (
    <PageContainer className="py-16">
      <Suspense fallback={null}>
        <LoginSuccessHandler />
      </Suspense>
    </PageContainer>
  )
}
