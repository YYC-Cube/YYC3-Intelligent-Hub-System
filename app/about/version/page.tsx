"use client"

import { PageHeader } from "@/app/components/layout/page-header"
import { VersionDisplay } from "@/app/components/ui/version-display"
import { CheckUpdateButton } from "@/app/components/version/check-update-button"
import { VersionCheckProvider } from "@/app/context/version-check-context"
import { useI18n } from "@/app/hooks/use-i18n"
import { Badge } from "@/components/ui/badge"
import { tc } from "@/lib/yyc3/i18n/data"

function VersionPageContent() {
  const { t } = useI18n()

  return (
    <div className="mx-auto w-full max-w-page px-4 py-10">
      <div className="max-w-content mx-auto">
        <PageHeader
          crumbs={[{ label: t("ui.关于我们"), href: "/about" }, { label: t("pages.版本信息") }]}
          title={t("pages.版本信息")}
          className="mb-6"
        />

        <div className="bg-card rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t("pages.当前版本")}</h2>
            <CheckUpdateButton />
          </div>

          <div className="mb-6">
            <VersionDisplay showDetails={true} />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t("pages.版本历史")}</h2>

          <div className="space-y-8">
            <VersionHistoryItem
              version="1.1.0"
              date="2025年4月15日"
              changes={[
                { type: "feature", text: "添加了收藏云同步功能" },
                { type: "feature", text: "实现了分类热度指标" },
                { type: "feature", text: "添加了订阅功能" },
                { type: "fix", text: "修复了移动设备上的显示问题" },
                { type: "improvement", text: "优化了应用加载速度" },
              ]}
            />

            <VersionHistoryItem
              version="1.0.0"
              date="2025年3月1日"
              changes={[
                { type: "feature", text: "首次发布" },
                { type: "feature", text: "集成应用浏览和搜索" },
                { type: "feature", text: "应用市场功能" },
                { type: "feature", text: "收藏功能" },
                { type: "feature", text: "AI助手集成" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VersionPage() {
  return (
    <VersionCheckProvider>
      <VersionPageContent />
    </VersionCheckProvider>
  )
}

interface VersionHistoryItemProps {
  version: string
  date: string
  changes: Array<{
    type: "feature" | "fix" | "improvement"
    text: string
  }>
}

function VersionHistoryItem({ version, date, changes }: VersionHistoryItemProps) {
  const { t } = useI18n()

  return (
    <div className="border-b pb-6 last:border-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t("pages.版本 {version}", { version })}</h3>
        <span className="text-sm text-muted-foreground">{tc("pages", date)}</span>
      </div>

      <div className="space-y-3">
        {changes.map((change, index) => (
          <div key={index} className="flex items-start">
            {/* 变更类型标签：收编至 Badge 语义变体（feature=secondary / fix=destructive / improvement=success） */}
            <Badge
              variant={change.type === "feature" ? "secondary" : change.type === "fix" ? "destructive" : "success"}
              className="mr-3 mt-0.5"
            >
              {change.type === "feature" ? t("pages.新功能") : change.type === "fix" ? t("pages.修复") : t("pages.改进")}
            </Badge>
            <span>{tc("pages", change.text)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
