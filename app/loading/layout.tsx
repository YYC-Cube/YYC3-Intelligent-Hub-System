import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "加载演示",
  description: "全局加载流程的演示路由。",
  path: "/loading/",
})

export default function LoadingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
