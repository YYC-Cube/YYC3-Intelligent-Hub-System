"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type VersionCheckResult, versionCheckService } from "../services/version-check"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/app/hooks/use-i18n"

interface VersionCheckContextType {
  checking: boolean
  updateAvailable: boolean
  updateInfo: VersionCheckResult | null
  checkForUpdates: (force?: boolean) => Promise<void>
  dismissUpdate: () => void
  updateSettings: (settings: Partial<VersionCheckSettings>) => void
  settings: VersionCheckSettings
}

interface VersionCheckSettings {
  autoCheck: boolean
  checkInterval: number // 毫秒
  notifyOnStartup: boolean
  lastDismissedVersion: string | null
}

const defaultSettings: VersionCheckSettings = {
  autoCheck: true,
  checkInterval: 24 * 60 * 60 * 1000, // 默认每24小时
  notifyOnStartup: true,
  lastDismissedVersion: null,
}

const VersionCheckContext = createContext<VersionCheckContextType | undefined>(undefined)

export function useVersionCheck() {
  const context = useContext(VersionCheckContext)
  if (!context) {
    throw new Error("useVersionCheck must be used within a VersionCheckProvider")
  }
  return context
}

interface VersionCheckProviderProps {
  children: ReactNode
}

export function VersionCheckProvider({ children }: VersionCheckProviderProps) {
  const [checking, setChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<VersionCheckResult | null>(null)
  const [settings, setSettings] = useState<VersionCheckSettings>(defaultSettings)
  const { toast } = useToast()
  const { t } = useI18n()

  // 加载设置
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("version_check_settings")
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
        }

        // 加载版本检查服务的状态
        versionCheckService.loadLastChecked()
        versionCheckService.loadCheckInterval()
      } catch (error) {
        console.error("加载版本检查设置失败:", error)
      }
    }

    loadSettings()
  }, [])

  // 自动检查更新
  useEffect(() => {
    if (settings.autoCheck && settings.notifyOnStartup) {
      checkForUpdates()
    }

    // 设置定期检查
    let intervalId: NodeJS.Timeout | null = null
    if (settings.autoCheck && settings.checkInterval > 0) {
      intervalId = setInterval(() => {
        checkForUpdates()
      }, settings.checkInterval)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [settings.autoCheck, settings.checkInterval, settings.notifyOnStartup])

  // 检查更新
  const checkForUpdates = async (force = false) => {
    try {
      setChecking(true)
      const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0"
      const result = await versionCheckService.checkForUpdates(currentVersion, force)

      if (result) {
        setUpdateInfo(result)

        // 检查是否已经忽略了这个版本
        const shouldNotify =
          result.hasUpdate &&
          (!settings.lastDismissedVersion || settings.lastDismissedVersion !== result.latestVersion.version)

        setUpdateAvailable(shouldNotify)

        // 如果有更新且需要通知，显示toast
        if (shouldNotify) {
          const updateType =
            result.updateType === "major"
              ? t("common.重大更新")
              : result.updateType === "minor"
                ? t("common.功能更新")
                : t("common.补丁更新")

          toast({
            title: t("common.有新的{type}可用", { type: updateType }),
            description: t("common.版本 {latest} 已发布，您当前的版本是 {current}", {
              latest: result.latestVersion.version,
              current: currentVersion,
            }),
            duration: 10000,
          })
        }
      }
    } catch (error) {
      console.error("检查更新失败:", error)
    } finally {
      setChecking(false)
    }
  }

  // 忽略更新
  const dismissUpdate = () => {
    if (updateInfo?.latestVersion.version) {
      const newSettings = {
        ...settings,
        lastDismissedVersion: updateInfo.latestVersion.version,
      }
      setSettings(newSettings)
      localStorage.setItem("version_check_settings", JSON.stringify(newSettings))
      setUpdateAvailable(false)
    }
  }

  // 更新设置
  const updateSettings = (newSettings: Partial<VersionCheckSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("version_check_settings", JSON.stringify(updatedSettings))

    // 更新版本检查服务的设置
    if (newSettings.checkInterval !== undefined) {
      versionCheckService.setCheckInterval(newSettings.checkInterval)
    }
  }

  return (
    <VersionCheckContext.Provider
      value={{
        checking,
        updateAvailable,
        updateInfo,
        checkForUpdates,
        dismissUpdate,
        updateSettings,
        settings,
      }}
    >
      {children}
    </VersionCheckContext.Provider>
  )
}
