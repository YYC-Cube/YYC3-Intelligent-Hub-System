"use client"

import { WizardContainer } from "./wizard-container"
import { useWizard } from "./wizard-context"
import { StepBasicInfo } from "./step-basic-info"
import { StepAuthentication } from "./step-authentication"
import { StepConfiguration } from "./step-configuration"
import { StepConnectionTest } from "./step-connection-test"
import { StepCompletion } from "./step-completion"
import type { Integration } from "@/app/data/integrations"
import { useI18n } from "@/app/hooks/use-i18n"
import { dataIntegrationName } from "@/lib/yyc3/i18n/data"

interface InstallationWizardProps {
  integration: Integration
}

export function InstallationWizard({ integration }: InstallationWizardProps) {
  const { t } = useI18n()
  const steps: any[] = [
    {
      id: "basic-info",
      title: t("install.基本信息"),
      description: t("install.设置集成的基本信息"),
    },
    {
      id: "authentication",
      title: t("install.认证"),
      description: t("install.配置认证信息"),
    },
    {
      id: "configuration",
      title: t("install.配置"),
      description: t("install.设置集成选项"),
    },
    {
      id: "connection-test",
      title: t("install.连接测试"),
      description: t("install.测试连接"),
    },
    {
      id: "completion",
      title: t("install.完成"),
      description: t("install.安装完成"),
    },
  ]

  const initialData = {
    name: integration.name,
  }

  return (
    <WizardContainer
      title={t("install.安装 {name}", { name: dataIntegrationName(integration.name) })}
      description={t("install.按照以下步骤安装和配置集成应用")}
      steps={steps}
      onComplete={() => {}}
      onCancel={() => {}}
    />
  )
}

function WizardStepContent() {
  const { currentStepIndex, steps } = useWizard()
  const { t } = useI18n()
  const currentStep = steps[currentStepIndex]

  switch (currentStep.id) {
    case "basic-info":
      return <StepBasicInfo />
    case "authentication":
      return <StepAuthentication />
    case "configuration":
      return <StepConfiguration />
    case "connection-test":
      return <StepConnectionTest />
    case "completion":
      return <StepCompletion />
    default:
      return <div>{t("install.未知步骤")}</div>
  }
}
