import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "环境变量检查",
  description: "查看并管理系统环境变量的配置状态。",
  path: "/admin/env-check/",
})

export default function EnvCheckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
