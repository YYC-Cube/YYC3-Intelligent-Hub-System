import dynamic from "next/dynamic"

import { integrations } from "@/app/data/integrations"

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

const IntegrationInstallClient = dynamic(() => import("./client-page"), { ssr: false })

export default function IntegrationInstallPage() {
  return <IntegrationInstallClient />
}
