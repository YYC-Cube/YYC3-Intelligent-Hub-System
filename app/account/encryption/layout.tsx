import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "加密设置",
  description: "配置收藏数据的端到端加密保护。",
  path: "/account/encryption/",
})

export default function EncryptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
