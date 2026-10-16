"use client"

import { useMemo } from "react"

import { integrations } from "@/app/data/integrations"

import { IntegrationBrowser } from "../components/integration-browser"

/**
 * 应用市场「热门集成」页面。
 *
 * 展示安装量超过 5000 的热门连接器，便于用户快速发现高采用度应用。
 *
 * @returns 热门集成分页视图
 */
export default function PopularIntegrationsPage() {
  const popularIntegrations = useMemo(() => integrations.filter((integration) => integration.popular), [])

  return (
    <IntegrationBrowser
      title="热门集成"
      description="按安装量筛选出的高采用度连接器，覆盖数据分析、营销推广、AI 等 29 大领域。"
      source={popularIntegrations}
      showCategoryFilter
      emptyHint="暂无热门应用数据。"
    />
  )
}
