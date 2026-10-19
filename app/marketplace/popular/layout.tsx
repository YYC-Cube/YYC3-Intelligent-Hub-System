import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "热门应用",
  description: "应用市场中最受欢迎的集成应用榜单。",
  path: "/marketplace/popular/",
})

export default function PopularLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
