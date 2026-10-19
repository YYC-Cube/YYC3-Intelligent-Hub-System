"use client"

import { Badge } from "@/components/ui/badge"

import { EncryptionSetupDialog } from "@/app/components/encryption/encryption-setup-dialog"
import { PageContainer } from "@/app/components/layout/page-container"
import { PageHeader } from "@/app/components/layout/page-header"
import { ConfirmActionDialog } from "@/app/components/ui/confirm-action-dialog"
import { useAuth } from "@/app/context/auth-context"
import { useEncryption } from "@/app/context/encryption-context"
import { useFavorites } from "@/app/context/favorites-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  ArrowLeft,
  Key,
  Loader2,
  Lock,
  LockOpen,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EncryptionSettingsPage() {
  const { isAuthenticated, user } = useAuth()
  const {
    encryptionStatus,
    encryptionSettings,
    isSupported,
    setupEncryption,
    disableEncryption,
    updateEncryptionSettings,
    changePassword,
  } = useEncryption()
  const { syncWithCloud, isEncrypted } = useFavorites()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()

  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordHint, setPasswordHint] = useState(encryptionSettings.passwordHint || "")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // 处理密码更改
  const handleChangePassword = async () => {
    setPasswordError("")

    if (!currentPassword) {
      setPasswordError(t("account.请输入当前密码"))
      return
    }

    if (!newPassword) {
      setPasswordError(t("account.请输入新密码"))
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError(t("account.两次输入的新密码不一致"))
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(t("account.新密码长度至少为8个字符"))
      return
    }

    setIsChangingPassword(true)
    try {
      const success = await changePassword(currentPassword, newPassword)
      if (success) {
        // 更新密码提示
        updateEncryptionSettings({ passwordHint })

        toast({
          title: t("account.密码已更改"),
          description: t("account.您的加密密码已成功更改"),
        })

        // 清空表单
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      }
    } catch (error) {
      setPasswordError(t("account.更改密码失败，请稍后重试"))
    } finally {
      setIsChangingPassword(false)
    }
  }

  // 处理禁用加密
  const handleDisableEncryption = async () => {
    const success = await disableEncryption()
    if (success) {
      setShowDisableDialog(false)

      // 同步到云端
      await syncWithCloud()
    }
  }

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="flex items-center mb-6">
          <Link href="/favorites" className="text-primary hover:underline mr-2">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            {t("account.返回收藏")}
          </Link>
        </div>

        <div className="max-w-content mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LockOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                {t("account.未登录")}
              </CardTitle>
              <CardDescription>{t("account.请登录以管理您的加密设置")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">{t("account.您需要登录才能访问加密设置")}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/")}>{t("account.返回首页")}</Button>
            </CardFooter>
          </Card>
        </div>
      </PageContainer>
    )
  }

  // 如果浏览器不支持加密
  if (!isSupported) {
    return (
      <PageContainer>
        <div className="flex items-center mb-6">
          <Link href="/favorites" className="text-primary hover:underline mr-2">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            {t("account.返回收藏")}
          </Link>
        </div>

        <div className="max-w-content mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-destructive" />
                {t("account.不支持加密")}
              </CardTitle>
              <CardDescription>{t("account.您的浏览器不支持所需的加密API")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <div className="text-sm text-destructive">
                    <p className="font-medium">{t("account.浏览器不兼容")}</p>
                    <p>
                      {t(
                        "account.您的浏览器不支持所需的Web Crypto API，无法使用端到端加密功能。请使用最新版本的Chrome、Firefox、Safari或Edge浏览器。"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/favorites")}>{t("account.返回收藏")}</Button>
            </CardFooter>
          </Card>
        </div>
      </PageContainer>
    )
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          crumbs={[
            { label: t("account.账户中心"), href: "/account/sync" },
            { label: t("account.端到端加密设置") },
          ]}
          title={t("account.端到端加密设置")}
          description={t("account.管理您的数据加密设置，保护您的隐私")}
          className="mb-6"
        />

        <div className="flex items-center mb-6">
          <Link href="/favorites" className="text-primary hover:underline mr-2">
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            {t("account.返回收藏")}
          </Link>
        </div>

        <div className="max-w-content mx-auto">
          <Card className="mb-8">
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-brand-50 border border-brand-100 mb-6">
                <div className="flex items-center">
                  {encryptionStatus === "enabled" ? (
                    <ShieldCheck className="h-5 w-5 mr-3 text-success" />
                  ) : encryptionStatus === "initializing" ? (
                    <Loader2 className="h-5 w-5 mr-3 text-primary animate-spin" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 mr-3 text-warning" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {encryptionStatus === "enabled"
                        ? t("account.加密已启用")
                        : encryptionStatus === "initializing"
                          ? t("account.需要解锁加密")
                          : t("account.加密未启用")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {encryptionStatus === "enabled"
                        ? isEncrypted
                          ? t("account.您的数据已使用端到端加密保护")
                          : t("account.加密已启用，但当前数据未加密")
                        : encryptionStatus === "initializing"
                          ? t("account.请输入密码解锁加密数据")
                          : t("account.启用加密以保护您的数据隐私")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (encryptionStatus === "enabled" || encryptionStatus === "initializing") {
                      setShowDisableDialog(true)
                    } else {
                      setShowSetupDialog(true)
                    }
                  }}
                  variant={encryptionStatus === "enabled" ? "destructive" : "default"}
                >
                  {encryptionStatus === "enabled" ? t("account.禁用加密") : t("account.启用加密")}
                </Button>
              </div>

              {encryptionStatus === "enabled" && (
                <Tabs defaultValue="settings" className="mt-6">
                  <TabsList className="mb-4">
                    <TabsTrigger value="settings">{t("account.加密设置")}</TabsTrigger>
                    <TabsTrigger value="password">{t("account.密码管理")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoEncrypt">{t("account.自动加密")}</Label>
                          <p className="text-sm text-muted-foreground">{t("account.自动加密所有新添加的收藏数据")}</p>
                        </div>
                        <Switch
                          id="autoEncrypt"
                          checked={encryptionSettings.autoEncrypt}
                          onCheckedChange={(checked) => updateEncryptionSettings({ autoEncrypt: checked })}
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-base font-medium mb-2">{t("account.密码提示")}</h3>
                        <div className="space-y-2">
                          <Input
                            value={passwordHint}
                            onChange={(e) => setPasswordHint(e.target.value)}
                            placeholder={t("account.输入密码提示（可选）")}
                          />
                          <p className="text-xs text-muted-foreground">{t("account.密码提示可以帮助您记住密码，但不要输入您的实际密码")}</p>
                          <Button
                            onClick={() => updateEncryptionSettings({ passwordHint })}
                            size="sm"
                            variant="outline"
                          >
                            {t("account.保存提示")}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-base font-medium mb-2">{t("account.加密状态")}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                            <span className="text-sm">{t("account.收藏数据加密状态")}</span>
                            <Badge variant={isEncrypted ? "success" : "warning"}>
                              {isEncrypted ? t("account.已加密") : t("account.未加密")}
                            </Badge>
                          </div>
                          {!isEncrypted && encryptionStatus === "enabled" && (
                            <Button onClick={() => syncWithCloud()} size="sm" className="gap-2">
                              <RefreshCw className="h-4 w-4" />
                              {t("account.立即加密并同步")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="password" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">{t("account.更改加密密码")}</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">{t("account.当前密码")}</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder={t("account.输入当前密码")}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">{t("account.新密码")}</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder={t("account.输入新密码")}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmNewPassword">{t("account.确认新密码")}</Label>
                          <Input
                            id="confirmNewPassword"
                            type="password"
                            placeholder={t("account.再次输入新密码")}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                          />
                        </div>

                        {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

                        <Button onClick={handleChangePassword} disabled={isChangingPassword} className="gap-2">
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t("account.更改中...")}
                            </>
                          ) : (
                            <>
                              <Key className="h-4 w-4" />
                              {t("account.更改密码")}
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-warning/10 p-3 rounded-md border border-warning/30 mt-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-warning mr-2 mt-0.5" />
                          <div className="text-sm text-warning">
                            <p className="font-medium">{t("account.重要提示")}</p>
                            <p>
                              {t("account.请务必记住您的新密码。如果忘记密码，您将无法恢复加密的数据。我们不存储您的密码，也无法帮您重置。")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {encryptionStatus === "initializing" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <ShieldAlert className="h-16 w-16 text-warning mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("account.需要解锁加密数据")}</h3>
                  <p className="text-muted-foreground text-center mb-4 max-w-md">
                    {t("account.您的数据已加密，但尚未解锁。请输入您的加密密码以访问数据。")}
                    {encryptionSettings.passwordHint && (
                      <span className="block mt-2 font-medium">
                        {t("account.密码提示: {hint}", { hint: encryptionSettings.passwordHint })}
                      </span>
                    )}
                  </p>
                  <Button onClick={() => setShowSetupDialog(true)}>{t("account.解锁数据")}</Button>
                </div>
              )}

              {encryptionStatus === "disabled" && (
                <div className="space-y-6 py-4">
                  <div className="bg-brand-50 p-4 rounded-md border border-brand-100">
                    <div className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div className="text-sm text-primary">
                        <p className="font-medium">{t("account.关于端到端加密")}</p>
                        <p>
                          {t("account.启用端到端加密后，您的收藏数据将在本地加密，然后再同步到云端。这意味着只有您知道密码，即使是服务提供商也无法查看您的数据内容。")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-medium">{t("account.端到端加密的优势")}</h3>
                    <ul className="space-y-2 list-disc pl-5 text-sm">
                      <li>{t("account.您的数据在传输和存储过程中都是加密的")}</li>
                      <li>{t("account.只有您知道密码，可以解密数据")}</li>
                      <li>{t("account.即使服务器被入侵，您的数据也是安全的")}</li>
                      <li>{t("account.保护您的隐私，防止未经授权的访问")}</li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={() => setShowSetupDialog(true)} className="gap-2">
                      <Lock className="h-4 w-4" />
                      {t("account.启用端到端加密")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      {/* 加密设置对话框 */}
      <EncryptionSetupDialog />

      {/* 禁用加密确认对话框 —— 统一 ConfirmActionDialog 四段规范结构 */}
      <ConfirmActionDialog
        open={showDisableDialog}
        onOpenChange={setShowDisableDialog}
        title={t("account.确认禁用加密？")}
        description={t(
          "account.禁用加密后，您的数据将不再受到端到端加密保护。这意味着您的数据可能在传输和存储过程中以明文形式存在。"
        )}
        onConfirm={handleDisableEncryption}
        cancelLabel={t("account.取消")}
        confirmLabel={t("account.确认禁用")}
      />
    </>
  )
}
