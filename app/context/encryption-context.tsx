"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"
import {
  deriveKey,
  encryptData,
  decryptData,
  generateKeyPackage,
  verifyPassword,
  getUserEncryptionSettings,
  saveUserEncryptionSettings,
  saveKeyPackage,
  getKeyPackage,
  isEncryptionSupported,
  type EncryptionStatus,
  type EncryptionSettings,
  defaultEncryptionSettings,
} from "../services/encryption"

type EncryptionContextType = {
  encryptionStatus: EncryptionStatus
  encryptionSettings: EncryptionSettings
  isSupported: boolean
  encryptionKey: CryptoKey | null
  setupEncryption: (password: string, hint?: string) => Promise<boolean>
  unlockEncryption: (password: string) => Promise<boolean>
  disableEncryption: () => Promise<boolean>
  updateEncryptionSettings: (settings: Partial<EncryptionSettings>) => void
  encrypt: (data: string) => Promise<string>
  decrypt: (encryptedData: string) => Promise<string>
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined)

export function useEncryption() {
  const context = useContext(EncryptionContext)
  if (!context) {
    throw new Error("useEncryption must be used within an EncryptionProvider")
  }
  return context
}

interface EncryptionProviderProps {
  children: ReactNode
}

export function EncryptionProvider({ children }: EncryptionProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { t } = useI18n()
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus>("disabled")
  const [encryptionSettings, setEncryptionSettings] = useState<EncryptionSettings>(defaultEncryptionSettings)
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  // 检查浏览器是否支持加密API
  useEffect(() => {
    setIsSupported(isEncryptionSupported())
    if (!isEncryptionSupported()) {
      toast({
        title: t("encryption.浏览器不支持加密"),
        description: t(
          "encryption.您的浏览器不支持所需的加密API，请使用最新版本的Chrome、Firefox、Safari或Edge浏览器。",
        ),
        variant: "destructive",
      })
    }
  }, [toast])

  // 当用户登录状态改变时，加载加密设置
  useEffect(() => {
    const loadEncryptionSettings = () => {
      if (isAuthenticated && user) {
        try {
          // 加载加密设置
          const settings = getUserEncryptionSettings(user.id)
          setEncryptionSettings(settings)

          // 如果加密已启用，设置状态为等待解锁
          if (settings.enabled) {
            setEncryptionStatus("initializing")
          } else {
            setEncryptionStatus("disabled")
          }
        } catch (error) {
          console.error("加载加密设置失败:", error)
          setEncryptionStatus("error")
        }
      } else {
        // 用户未登录，重置状态
        setEncryptionStatus("disabled")
        setEncryptionSettings(defaultEncryptionSettings)
        setEncryptionKey(null)
      }
    }

    loadEncryptionSettings()
  }, [isAuthenticated, user])

  // 设置加密
  const setupEncryption = useCallback(
    async (password: string, hint?: string): Promise<boolean> => {
      if (!isAuthenticated || !user || !isSupported) {
        toast({
          title: t("encryption.设置加密失败"),
          description: t("encryption.请先登录或使用支持的浏览器"),
          variant: "destructive",
        })
        return false
      }

      try {
        setEncryptionStatus("initializing")

        // 生成密钥包
        const keyPackage = await generateKeyPackage(password)

        // 保存密钥包
        saveKeyPackage(user.id, keyPackage)

        // 从密码派生密钥
        const salt = Uint8Array.from(atob(keyPackage.salt), (c) => c.charCodeAt(0))
        const key = await deriveKey(password, salt)
        setEncryptionKey(key)

        // 更新加密设置
        const newSettings: EncryptionSettings = {
          ...encryptionSettings,
          enabled: true,
          passwordHint: hint || "",
        }
        setEncryptionSettings(newSettings)
        saveUserEncryptionSettings(user.id, newSettings)

        setEncryptionStatus("enabled")

        toast({
          title: t("encryption.加密已启用"),
          description: t("encryption.您的数据现在将使用端到端加密进行保护"),
        })

        return true
      } catch (error) {
        console.error("设置加密失败:", error)
        setEncryptionStatus("error")

        toast({
          title: t("encryption.设置加密失败"),
          description: t("encryption.无法设置加密，请稍后重试"),
          variant: "destructive",
        })

        return false
      }
    },
    [isAuthenticated, user, isSupported, encryptionSettings, toast],
  )

  // 解锁加密
  const unlockEncryption = useCallback(
    async (password: string): Promise<boolean> => {
      if (!isAuthenticated || !user || !isSupported) {
        return false
      }

      try {
        // 获取密钥包
        const keyPackage = getKeyPackage(user.id)
        if (!keyPackage) {
          throw new Error("密钥包不存在")
        }

        // 验证密码
        const isValid = await verifyPassword(password, keyPackage.salt, keyPackage.encryptedValidationToken)
        if (!isValid) {
          toast({
            title: t("encryption.解锁失败"),
            description: t("encryption.密码不正确"),
            variant: "destructive",
          })
          return false
        }

        // 从密码派生密钥
        const salt = Uint8Array.from(atob(keyPackage.salt), (c) => c.charCodeAt(0))
        const key = await deriveKey(password, salt)
        setEncryptionKey(key)

        setEncryptionStatus("enabled")

        toast({
          title: t("encryption.加密已解锁"),
          description: t("encryption.您现在可以访问加密的数据"),
        })

        return true
      } catch (error) {
        console.error("解锁加密失败:", error)
        setEncryptionStatus("error")

        toast({
          title: t("encryption.解锁失败"),
          description: t("encryption.无法解锁加密，请稍后重试"),
          variant: "destructive",
        })

        return false
      }
    },
    [isAuthenticated, user, isSupported, toast],
  )

  // 禁用加密
  const disableEncryption = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false
    }

    try {
      // 更新加密设置
      const newSettings: EncryptionSettings = {
        ...encryptionSettings,
        enabled: false,
      }
      setEncryptionSettings(newSettings)
      saveUserEncryptionSettings(user.id, newSettings)

      // 清除密钥
      setEncryptionKey(null)
      setEncryptionStatus("disabled")

      // 清除密钥包
      localStorage.removeItem(`key_package_${user.id}`)

      toast({
        title: t("encryption.加密已禁用"),
        description: t("encryption.您的数据将不再使用端到端加密"),
      })

      return true
    } catch (error) {
      console.error("禁用加密失败:", error)

      toast({
        title: t("encryption.禁用加密失败"),
        description: t("encryption.无法禁用加密，请稍后重试"),
        variant: "destructive",
      })

      return false
    }
  }, [isAuthenticated, user, encryptionSettings, toast])

  // 更新加密设置
  const updateEncryptionSettings = useCallback(
    (settings: Partial<EncryptionSettings>) => {
      if (!isAuthenticated || !user) return

      const newSettings = { ...encryptionSettings, ...settings }
      setEncryptionSettings(newSettings)
      saveUserEncryptionSettings(user.id, newSettings)
    },
    [isAuthenticated, user, encryptionSettings],
  )

  // 加密数据
  const encrypt = useCallback(
    async (data: string): Promise<string> => {
      if (!encryptionKey || encryptionStatus !== "enabled") {
        // 如果加密未启用，返回原始数据
        return data
      }

      try {
        return await encryptData(data, encryptionKey)
      } catch (error) {
        console.error("加密数据失败:", error)
        throw new Error("加密数据失败")
      }
    },
    [encryptionKey, encryptionStatus],
  )

  // 解密数据
  const decrypt = useCallback(
    async (encryptedData: string): Promise<string> => {
      if (!encryptionKey || encryptionStatus !== "enabled") {
        // 如果加密未启用，返回原始数据
        return encryptedData
      }

      try {
        // 检查数据是否已加密（简单检查，可能需要更复杂的逻辑）
        if (encryptedData.length < 10 || !encryptedData.match(/^[A-Za-z0-9+/=]+$/)) {
          // 可能未加密，返回原始数据
          return encryptedData
        }

        return await decryptData(encryptedData, encryptionKey)
      } catch (error) {
        console.error("解密数据失败:", error)
        throw new Error("解密数据失败")
      }
    },
    [encryptionKey, encryptionStatus],
  )

  // 更改密码
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      if (!isAuthenticated || !user || !isSupported || encryptionStatus !== "enabled") {
        return false
      }

      try {
        // 验证旧密码
        const keyPackage = getKeyPackage(user.id)
        if (!keyPackage) {
          throw new Error("密钥包不存在")
        }

        const isValid = await verifyPassword(oldPassword, keyPackage.salt, keyPackage.encryptedValidationToken)
        if (!isValid) {
          toast({
            title: t("encryption.更改密码失败"),
            description: t("encryption.当前密码不正确"),
            variant: "destructive",
          })
          return false
        }

        // 生成新的密钥包
        const newKeyPackage = await generateKeyPackage(newPassword)

        // 保存新的密钥包
        saveKeyPackage(user.id, newKeyPackage)

        // 从新密码派生密钥
        const salt = Uint8Array.from(atob(newKeyPackage.salt), (c) => c.charCodeAt(0))
        const key = await deriveKey(newPassword, salt)
        setEncryptionKey(key)

        toast({
          title: t("encryption.密码已更改"),
          description: t("encryption.您的加密密码已成功更改"),
        })

        return true
      } catch (error) {
        console.error("更改密码失败:", error)

        toast({
          title: t("encryption.更改密码失败"),
          description: t("encryption.无法更改密码，请稍后重试"),
          variant: "destructive",
        })

        return false
      }
    },
    [isAuthenticated, user, isSupported, encryptionStatus, toast],
  )

  return (
    <EncryptionContext.Provider
      value={{
        encryptionStatus,
        encryptionSettings,
        isSupported,
        encryptionKey,
        setupEncryption,
        unlockEncryption,
        disableEncryption,
        updateEncryptionSettings,
        encrypt,
        decrypt,
        changePassword,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  )
}
