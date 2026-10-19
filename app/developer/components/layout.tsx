import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "组件库",
  description: "可复用 UI 组件清单与集成开发组件规范。",
  path: "/developer/components/",
})

export default function ComponentsDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
