import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "应用搜索",
  description: "按关键字搜索应用市场中的集成应用。",
  path: "/marketplace/search/",
})

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
