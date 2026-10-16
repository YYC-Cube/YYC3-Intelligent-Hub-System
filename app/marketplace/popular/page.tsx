"use client"

import { useMemo } from "react"

import { integrations } from "@/app/data/integrations"

import { IntegrationBrowser } from "../components/integration-browser"
import { useI18n } from "@/app/hooks/use-i18n"

/**
 * 应用市场「热门集成」页面。
 *
 * 展示安装量超过 5000 的热门连接器，便于用户快速发现高采用度应用。
 *
 * @returns 热门集成分页视图
 */
export default function PopularIntegrationsPage() {
  const { t } = useI18n()
  const popularIntegrations = useMemo(() => integrations.filter((integration) => integration.popular), [])

  return (
    <IntegrationBrowser
      title={t("marketplace.热门集成")}
      description={t("marketplace.按安装量筛选出的高采用度连接器，覆盖数据分析、营销推广、AI 等 29 大领域。")}
      source={popularIntegrations}
      showCategoryFilter
      emptyHint={t("marketplace.暂无热门应用数据。")}
    />
  )
}
