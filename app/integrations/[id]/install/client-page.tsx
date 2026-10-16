"use client"

import { useParams, notFound } from "next/navigation"
import { integrations } from "@/app/data/integrations"
import { Navbar } from "@/components/ui/navbar"
import { InstallationWizard } from "@/app/components/installation-wizard/installation-wizard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataIntegrationName } from "@/lib/yyc3/i18n/data"

export default function IntegrationInstallClient() {
  const { t } = useI18n()
  const { id } = useParams()
  const integration = integrations.find((i) => i.id === id)

  if (!integration) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/integrations">{t("install.集成应用")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/integrations/${id}`}>{dataIntegrationName(integration.name)}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{t("install.安装")}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <InstallationWizard integration={integration} />
      </div>
    </div>
  )
}
