import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "可关闭标签页示例",
  description: "CustomTabs 可关闭标签页组件的交互演示。",
  path: "/examples/custom-tabs-example/",
})

export default function CustomTabsExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
