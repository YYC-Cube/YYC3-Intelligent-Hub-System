"use client"
import { DbAssistant } from "@/app/components/ai-assistant/db-assistant"
import { useI18n } from "@/app/hooks/use-i18n"

export default function AiAssistantPage() {
  const { t } = useI18n()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t("ai.言语云³智能助手")}</h1>
      {(DbAssistant as any)({ initialExpanded: true })}
    </div>
  )
}
