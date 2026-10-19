import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { RequireAuth } from "@/components/auth/route-guard"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "管理控制台",
  description: "系统全局配置、用户、数据与安全的统一管理入口。",
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  )
}
