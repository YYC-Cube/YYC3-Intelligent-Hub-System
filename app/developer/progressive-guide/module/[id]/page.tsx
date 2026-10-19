import type { Metadata } from "next"
import ClientLoader from "./client-loader"

import { findModuleById, getAllModuleIds } from "@/app/data/learning-paths"
import { createDynamicMetadata } from "@/lib/yyc3/metadata"

/** 由共享数据源（learning-paths）驱动生成全部学习模块的静态路径。 */
export function generateStaticParams() {
  return getAllModuleIds().map((id) => ({ id }))
}

/**
 * 动态元数据：「{模块标题} - YanYuCloudCube集成中心系统」，描述取自模块真实数据。
 * id 不存在时（理论不可达：静态参数已穷举）回退全站默认元数据。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const lookup = findModuleById(id)
  if (!lookup) return {}

  return createDynamicMetadata({
    title: lookup.module.title,
    description: `${lookup.module.description}（${lookup.path.title}路径 · ${lookup.module.duration} 分钟）`,
    path: `/developer/progressive-guide/module/${id}/`,
  })
}

export default function ModuleDetailPage() {
  return <ClientLoader />
}
