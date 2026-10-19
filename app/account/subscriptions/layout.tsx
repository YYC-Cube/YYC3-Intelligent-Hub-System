import type { Metadata } from "next"

import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "订阅管理",
  description: "查看与管理您的订阅方案与账单。",
  path: "/account/subscriptions/",
})

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
