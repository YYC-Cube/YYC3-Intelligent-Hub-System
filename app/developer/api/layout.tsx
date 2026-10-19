import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "API 文档",
  description: "YanYuCloudCube集成中心开放 API 的接口文档与调用示例。",
  path: "/developer/api/",
})

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
