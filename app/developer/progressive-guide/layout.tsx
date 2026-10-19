import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "渐进式学习路径",
  description: "按路径循序渐进掌握集成开发：入门、前端基础到部署运维。",
  path: "/developer/progressive-guide/",
})

export default function ProgressiveGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
