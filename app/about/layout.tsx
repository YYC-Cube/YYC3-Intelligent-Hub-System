import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "关于我们",
  description: "了解YanYuCloudCube集成中心的愿景、团队与产品理念。",
  path: "/about/",
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
