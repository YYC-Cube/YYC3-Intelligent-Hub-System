import type { Metadata } from "next"
import ClientLoader from "./client-loader"

import { integrations } from "@/app/data/integrations"
import { createDynamicMetadata } from "@/lib/yyc3/metadata"

/**
 * 由数据源驱动生成全部应用安装页的静态路径。
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
 * 动态元数据：「安装 {应用名} - YanYuCloudCube集成中心系统」。
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
    title: `安装 ${integration.name}`,
    description: `安装并配置 ${integration.name}：${integration.description}`,
    path: `/integrations/${id}/install/`,
  })
}

export default function IntegrationInstallPage() {
  return <ClientLoader />
}
