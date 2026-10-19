import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "版本信息",
  description: "查看YanYuCloudCube集成中心的当前版本与构建信息。",
  path: "/about/version/",
})

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
