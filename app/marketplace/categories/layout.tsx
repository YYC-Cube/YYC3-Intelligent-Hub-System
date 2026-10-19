import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "分类目录",
  description: "应用市场全部分类的结构化目录导航。",
  path: "/marketplace/categories/",
})

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
