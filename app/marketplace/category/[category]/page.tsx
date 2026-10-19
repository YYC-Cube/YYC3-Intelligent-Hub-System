import type { Metadata } from "next"
import ClientLoader from "./client-loader"

// 分类清单由 `app/data/integrations.ts` 单一数据源派生，
// 消除硬编码副本与数据源漂移（原 STATIC_CATEGORIES 曾与 29 大类不一致：物联网/区块链）。
import { categories } from "@/app/data/integrations"
import { createDynamicMetadata } from "@/lib/yyc3/metadata"

export function generateStaticParams() {
  // 跳过「全部分类」聚合项，仅对真实业务分类生成静态路由
  return categories
    .filter((c) => c !== "全部分类")
    .map((c) => ({ category: encodeURIComponent(c) }))
}

/**
 * 动态元数据：「{分类名}分类 - YanYuCloudCube集成中心系统」。
 * 注意：generateStaticParams 传入的是 encodeURIComponent 后的值，需先解码再匹配。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: encoded } = await params
  const category = decodeURIComponent(encoded)
  if (!categories.includes(category)) return {}

  return createDynamicMetadata({
    title: `${category}分类`,
    description: `发现并浏览「${category}」分类下的全部集成应用，提升业务效率。`,
    path: `/marketplace/category/${encoded}/`,
  })
}

export default function CategoryPage() {
  return <ClientLoader />
}
