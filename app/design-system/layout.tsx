import { AppShell } from "@/app/components/layout/app-shell"

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
