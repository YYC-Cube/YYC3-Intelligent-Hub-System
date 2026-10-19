import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "隐私政策",
  description: "了解YanYuCloudCube集成中心如何收集、使用与保护您的个人数据。",
  path: "/privacy/",
})

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
