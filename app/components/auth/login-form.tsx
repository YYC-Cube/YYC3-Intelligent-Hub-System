"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/context/auth-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function LoginForm({ onSuccess, onCancel }: LoginFormProps) {
  const { login, register, isLoading } = useAuth()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  // 登录表单状态
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // 注册表单状态
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerError, setRegisterError] = useState("")

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError(t("auth.请填写所有字段"))
      return
    }

    const success = await login(loginEmail, loginPassword)
    if (success && onSuccess) {
      onSuccess()
    }
  }

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError(t("auth.请填写所有字段"))
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError(t("auth.两次输入的密码不一致"))
      return
    }

    const success = await register(registerName, registerEmail, registerPassword)
    if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.账户登录")}</CardTitle>
        <CardDescription>{t("auth.登录您的账户以同步收藏数据")}</CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">{t("auth.登录")}</TabsTrigger>
          <TabsTrigger value="register">{t("auth.注册")}</TabsTrigger>
        </TabsList>

        <CardContent className="pt-6">
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.电子邮箱")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.密码")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.登录中...")}
                  </>
                ) : (
                  t("auth.登录")
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.姓名")}</Label>
                <Input
                  id="name"
                  placeholder={t("auth.您的姓名")}
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">{t("auth.邮箱")}</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">{t("auth.密码")}</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t("auth.确认密码")}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {registerError && <p className="text-sm text-red-500">{registerError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.注册中...")}
                  </>
                ) : (
                  t("auth.注册")
                )}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          {t("auth.取消")}
        </Button>
        <p className="text-xs text-gray-500">
          {activeTab === "login" ? t("auth.没有账户？") : t("auth.已有账户？")}
          <button
            type="button"
            className="text-blue-600 hover:underline ml-1"
            onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
          >
            {activeTab === "login" ? t("auth.注册") : t("auth.登录")}
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}
