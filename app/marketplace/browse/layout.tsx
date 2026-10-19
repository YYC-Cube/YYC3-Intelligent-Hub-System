import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "浏览应用",
  description: "按分类与筛选条件浏览应用市场的全部集成应用。",
  path: "/marketplace/browse/",
})

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
