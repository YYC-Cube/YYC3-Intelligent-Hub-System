import type { Metadata } from "next"
import { DesignSystem } from "@/app/components/ui/design-system"
import { createMetadata } from "@/lib/yyc3/metadata"

export const metadata: Metadata = createMetadata({
  title: "设计系统",
  description: "统一的UI设计系统，确保整个应用保持一致的视觉风格",
})

export default function DesignSystemPage() {
  return <DesignSystem />
}
