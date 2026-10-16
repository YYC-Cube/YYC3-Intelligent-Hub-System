"use client"

import { useEncryption } from "@/app/context/encryption-context"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock } from "lucide-react"
import { useI18n } from "@/app/hooks/use-i18n"

export function EncryptionStatus() {
  const { encryptionStatus, encryptionSettings } = useEncryption()
  const { t } = useI18n()

  if ((encryptionStatus as string) === "loading") {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500">
        <span className="animate-pulse">{t("encryption.加载中...")}</span>
      </Badge>
    )
  }

  if (encryptionStatus === "enabled" && encryptionSettings.enabled) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
        <Lock className="h-3 w-3 mr-1" />
        {t("encryption.已加密")}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
      <Unlock className="h-3 w-3 mr-1" />
      {t("encryption.未加密")}
    </Badge>
  )
}
