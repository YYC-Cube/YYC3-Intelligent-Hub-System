"use client"

import type { Integration } from "../../data/integrations"
// H-1 收敛：统一卡片与 /marketplace 共用；detailHref 透传保持 /integrations 详情路由不变
import IntegrationCard from "@/app/components/integrations/integration-card"
import { useI18n } from "@/app/hooks/use-i18n"

type IntegrationGridProps = {
  integrations: Integration[]
  /** 详情页路由基路径，透传给统一卡片（默认 marketplace 详情）。 */
  detailHref?: string
}

export default function IntegrationGrid({ integrations, detailHref }: IntegrationGridProps) {
  const { t } = useI18n()

  if (integrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t("integrations.未找到匹配的集成应用")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} detailHref={detailHref} />
      ))}
    </div>
  )
}
