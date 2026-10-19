import { AppShell } from "@/app/components/layout/app-shell"

export default function IntegrationDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
