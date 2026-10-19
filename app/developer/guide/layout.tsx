import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "开发指南",
  description: "从零开始构建YanYuCloudCube集成中心集成应用的完整指南。",
  path: "/developer/guide/",
})

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
