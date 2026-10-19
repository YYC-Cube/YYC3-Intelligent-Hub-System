import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "错误处理测试",
  description: "错误边界与错误处理链路的内部验证页面。",
  path: "/error-test/",
})

export default function ErrorTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
