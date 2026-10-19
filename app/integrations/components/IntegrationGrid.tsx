"use client"

import type { Integration } from "../../data/integrations"
// H-1 收敛：统一卡片与 /marketplace 共用；detailHref 透传保持 /integrations 详情路由不变
import IntegrationCard from "@/app/components/integrations/integration-card"
import { EmptyState } from "@/app/components/ui/empty-state"
import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"

type IntegrationGridProps = {
  integrations: Integration[]
  /** 详情页路由基路径，透传给统一卡片（默认 marketplace 详情）。 */
  detailHref?: string
  /** 空态「重置筛选」回调；传入时空态展示重置操作按钮。 */
  onReset?: () => void
}

export default function IntegrationGrid({ integrations, detailHref, onReset }: IntegrationGridProps) {
  const { t } = useI18n()

  // 数据四态之「空」：统一 EmptyState 规格（图标 + 标题 + 描述 + 引导操作），
  // 替代原先一行灰字的无引导空态
  if (integrations.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-10 w-10 text-brand-500" aria-hidden="true" />}
        title={t("integrations.未找到匹配的集成应用")}
        description={t("integrations.试试调整筛选条件或清除当前筛选")}
        actions={
          onReset ? (
            <Button variant="dashed" onClick={onReset}>
              {t("integrations.重置筛选")}
            </Button>
          ) : undefined
        }
        className="h-64"
      />
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
