import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "账户登录",
  description: "登录YanYuCloudCube集成中心，同步您的收藏与配置数据。",
  path: "/login/",
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
