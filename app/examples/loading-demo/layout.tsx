import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "加载动画示例",
  description: "加载态组件的使用示例。",
  path: "/examples/loading-demo/",
})

export default function LoadingExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
