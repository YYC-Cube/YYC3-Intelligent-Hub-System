import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "同步设置",
  description: "管理收藏与配置的云端同步选项。",
  path: "/account/sync/",
})

export default function SyncLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
