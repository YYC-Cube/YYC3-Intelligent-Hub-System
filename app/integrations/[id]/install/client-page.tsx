"use client"

import { InstallationWizard } from "@/app/components/installation-wizard/installation-wizard"
import { PageContainer } from "@/app/components/layout/page-container"
import { PageHeader } from "@/app/components/layout/page-header"
import { integrations } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { dataIntegrationName } from "@/lib/yyc3/i18n/data"
import { Home } from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"

export default function IntegrationInstallClient() {
  const { t } = useI18n()
  const { id } = useParams()
  const integration = integrations.find((i) => i.id === id)

  if (!integration) {
    notFound()
  }

  return (
    <PageContainer>
      {/* 原页仅面包屑无 h1：补 PageHeader（无 crumbs）提供文档大纲；既有 4 级 Breadcrumb 原样保留 */}
      <PageHeader
        title={t("install.安装 {name}", { name: dataIntegrationName(integration.name) })}
        className="mb-6"
      />

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
    </PageContainer>
  )
}
