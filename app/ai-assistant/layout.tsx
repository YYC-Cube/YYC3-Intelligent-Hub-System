import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "AI 助手",
  description: "智能集成推荐与数据库助手，让集成配置更高效。",
  path: "/ai-assistant/",
})

export default function AiAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
