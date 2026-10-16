"use client"

import { useRouter } from "next/navigation"

import { Navbar } from "@/components/ui/navbar"
import { LoginForm } from "@/app/components/auth/login-form"

/**
 * 账户登录页。
 *
 * 承接全站「前往登录」入口（如 `/account/subscriptions` 未登录态），
 * 复用既有 `LoginForm` 与根布局注入的 `AuthProvider`，不再重复实现认证 UI。
 */
export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <LoginForm
          onSuccess={() => router.push("/account/subscriptions")}
          onCancel={() => router.push("/")}
        />
      </main>
    </div>
  )
}
