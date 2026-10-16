"use client"

import { useState } from "react"
import { Info, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDate, getRelativeTimeString } from "@/app/utils/format-date"
import { useI18n } from "@/app/hooks/use-i18n"

interface VersionDisplayProps {
  className?: string
  showDetails?: boolean
}

export function VersionDisplay({ className = "", showDetails = false }: VersionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useI18n()
  const version = process.env.NEXT_PUBLIC_APP_VERSION || t("ui.开发版本")
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE

  // 解析版本信息（假设格式为 v1.2.3-hash 或 1.2.3）
  const versionInfo = parseVersion(version)

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Info className="h-3 w-3 mr-1" />
                <span>{t("ui.版本 {version}", { version: versionInfo.display })}</span>
                {showDetails &&
                  (isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />)}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{t("ui.应用当前版本信息")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDetails && isExpanded && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
          <table className="w-full text-left">
            <tbody>
              {versionInfo.major !== undefined && (
                <tr>
                  <td className="pr-4 py-1 font-medium">{t("ui.主版本:")}</td>
                  <td>{versionInfo.major}</td>
                </tr>
              )}
              {versionInfo.minor !== undefined && (
                <tr>
                  <td className="pr-4 py-1 font-medium">{t("ui.次版本:")}</td>
                  <td>{versionInfo.minor}</td>
                </tr>
              )}
              {versionInfo.patch !== undefined && (
                <tr>
                  <td className="pr-4 py-1 font-medium">{t("ui.修订号:")}</td>
                  <td>{versionInfo.patch}</td>
                </tr>
              )}
              {versionInfo.hash && (
                <tr>
                  <td className="pr-4 py-1 font-medium">{t("ui.提交哈希:")}</td>
                  <td>{versionInfo.hash}</td>
                </tr>
              )}
              <tr>
                <td className="pr-4 py-1 font-medium">{t("ui.构建时间:")}</td>
                <td>
                  {buildDate ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{formatDate(buildDate)}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{getRelativeTimeString(buildDate)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    t("ui.未知")
                  )}
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-1 font-medium">{t("ui.环境:")}</td>
                <td>{process.env.NODE_ENV || "development"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// 版本信息接口
interface VersionInfo {
  display: string;
  major?: string;
  minor?: string;
  patch?: string;
  hash?: string;
  prerelease?: string;
  buildMeta?: string;
}

// 解析版本字符串
function parseVersion(version: string): VersionInfo {
  // 默认值
  const result: VersionInfo = {
    display: version,
  }

  // 尝试解析语义化版本
  const semVerRegex = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/
  const match = version.match(semVerRegex)

  if (match) {
    result.major = match[1]
    result.minor = match[2]
    result.patch = match[3]
    if (match[4]) result.prerelease = match[4]
    if (match[5]) result.buildMeta = match[5]
  }

  // 检查是否包含Git哈希
  const hashRegex = /-([a-f0-9]{7,40})$/
  const hashMatch = version.match(hashRegex)
  if (hashMatch) {
    result.hash = hashMatch[1]
  }

  return result
}
