"use client"
import { DbAssistant } from "@/app/components/ai-assistant/db-assistant"
import { PageContainer } from "@/app/components/layout/page-container"
import { useI18n } from "@/app/hooks/use-i18n"

export default function AiAssistantPage() {
  const { t } = useI18n()

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">{t("ai.YanYuCloudCube智能助手")}</h1>
      {(DbAssistant as any)({ initialExpanded: true })}
    </PageContainer>
  )
}
