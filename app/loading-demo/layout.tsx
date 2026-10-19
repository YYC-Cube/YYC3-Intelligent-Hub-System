import type { Metadata } from "next"

import { AppShell } from "@/app/components/layout/app-shell"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "加载动画演示",
  description: "全局加载与页面过渡动画的演示页面。",
  path: "/loading-demo/",
})

export default function LoadingDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
