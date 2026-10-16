"use client"

import { useState } from "react"
import { useEncryption } from "@/app/context/encryption-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Lock, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"

export function EncryptionSetupDialog() {
  const { setupEncryption, encryptionStatus } = useEncryption()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hint, setHint] = useState("")
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleSetup = async () => {
    if (password !== confirmPassword) {
      setError(t("encryption.密码不匹配"))
      return
    }

    if (password.length < 8) {
      setError(t("encryption.密码长度必须至少为8个字符"))
      return
    }

    try {
      await setupEncryption(password, hint)
      setOpen(false)
      setPassword("")
      setConfirmPassword("")
      setHint("")
      setError(null)
      toast({
        title: t("encryption.加密设置成功"),
        description: t("encryption.您的数据现在已受到保护"),
      })
    } catch (err) {
      setError(t("encryption.设置加密失败，请重试"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Lock className="h-4 w-4" />
          {t("encryption.设置加密")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            {t("encryption.设置数据加密")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "encryption.加密将保护您的敏感数据。请设置一个强密码，并记住它 - 如果您忘记了密码，数据将无法恢复。",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              {t("encryption.密码")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              placeholder={t("encryption.输入强密码")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              {t("encryption.确认密码")}
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              placeholder={t("encryption.再次输入密码")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hint" className="text-right">
              {t("encryption.密码提示")}
            </Label>
            <Input
              id="hint"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="col-span-3"
              placeholder={t("encryption.可选的密码提示")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSetup} disabled={(encryptionStatus as string) === "loading"}>
            {(encryptionStatus as string) === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> {t("encryption.设置中...")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> {t("encryption.确认设置")}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
