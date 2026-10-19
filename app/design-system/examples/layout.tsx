import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "设计系统示例",
  description: "设计系统组件的真实用例演示。",
  path: "/design-system/examples/",
})

export default function DesignExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
