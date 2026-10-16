import ClientLoader from "./client-loader"

// 分类清单由 `app/data/integrations.ts` 单一数据源派生，
// 消除硬编码副本与数据源漂移（原 STATIC_CATEGORIES 曾与 29 大类不一致：物联网/区块链）。
import { categories } from "@/app/data/integrations"

export function generateStaticParams() {
  // 跳过「全部分类」聚合项，仅对真实业务分类生成静态路由
  return categories
    .filter((c) => c !== "全部分类")
    .map((c) => ({ category: encodeURIComponent(c) }))
}

export default function CategoryPage() {
  return <ClientLoader />
}
