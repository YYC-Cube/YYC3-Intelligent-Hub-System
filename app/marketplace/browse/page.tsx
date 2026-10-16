"use client"

import { integrations } from "@/app/data/integrations"

import { IntegrationBrowser } from "../components/integration-browser"
import { useI18n } from "@/app/hooks/use-i18n"

/**
 * 应用市场「浏览全部」页面。
 *
 * 提供覆盖全部 29 大类、1000 个集成应用的分页列表，支持关键字检索、
 * 分类筛选与多维排序。
 *
 * @returns 分页浏览视图
 */
export default function BrowseIntegrationsPage() {
  const { t } = useI18n()

  return (
    <IntegrationBrowser
      title={t("marketplace.浏览全部应用")}
      description={t("marketplace.按分类、评分与安装量浏览集成中心上架的全部连接器。")}
      source={integrations}
      showCategoryFilter
      emptyHint={t("marketplace.没有符合条件的应用，试试调整分类或关键字。")}
    />
  )
}
