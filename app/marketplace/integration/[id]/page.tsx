import type { Metadata } from "next"
import ClientLoader from "./client-loader"

import { integrations } from "@/app/data/integrations"
import { createDynamicMetadata } from "@/lib/yyc3/metadata"

/**
 * 由数据源驱动生成全部应用市场详情页的静态路径。
 *
 * 必须遍历完整 `integrations` 集合，禁止硬编码数量，否则静态导出模式下
 * 未预渲染的应用编号会直接 404。
 *
 * @returns 全部集成应用的 `id` 参数列表
 */
export function generateStaticParams() {
  return integrations.map((integration) => ({ id: integration.id }))
}

/**
 * 动态元数据：「{应用名} - YanYuCloudCube集成中心系统」，描述取自集成数据源。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const integration = integrations.find((i) => i.id === id)
  if (!integration) return {}

  return createDynamicMetadata({
    title: integration.name,
    description: integration.description,
    path: `/marketplace/integration/${id}/`,
  })
}

export default function IntegrationDetailPage() {
  return <ClientLoader />
}
