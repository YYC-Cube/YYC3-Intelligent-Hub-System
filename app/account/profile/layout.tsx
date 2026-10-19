import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "个人资料",
  description: "管理您的账户基本信息与头像。",
  path: "/account/profile/",
})

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
