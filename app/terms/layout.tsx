import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "服务条款",
  description: "YanYuCloudCube集成中心服务条款与使用协议。",
  path: "/terms/",
})

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
