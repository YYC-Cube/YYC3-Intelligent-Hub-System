import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "联系我们",
  description: "与YanYuCloudCube集成中心团队取得联系，获取产品支持与合作咨询。",
  path: "/contact/",
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
