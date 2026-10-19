import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { RequireAuth } from "@/components/auth/route-guard"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "账户中心",
  description: "管理个人资料、加密设置、订阅与云端同步。",
})

export default function AccountLayout({
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
