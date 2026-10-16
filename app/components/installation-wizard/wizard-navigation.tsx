"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useWizard } from "./wizard-context"
import { useI18n } from "@/app/hooks/use-i18n"

interface WizardNavigationProps {
  onComplete?: () => void
  isSubmitting?: boolean
  disableNext?: boolean
}

export function WizardNavigation({ onComplete, isSubmitting = false, disableNext = false }: WizardNavigationProps) {
  const { goToNextStep, goToPreviousStep, isLastStep, isFirstStep, connectionStatus } = useWizard()
  const { t } = useI18n()

  const handleNext = () => {
    if (isLastStep && onComplete) {
      onComplete()
    } else {
      goToNextStep()
    }
  }

  const isTesting = connectionStatus === "testing"
  const isNextDisabled = disableNext || isSubmitting || isTesting

  return (
    <div className="flex justify-between mt-8 pt-4 border-t">
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep || isSubmitting || isTesting}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("install.上一步")}
      </Button>

      <Button onClick={handleNext} disabled={isNextDisabled} className="gap-2">
        {isSubmitting || isTesting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isTesting ? t("install.测试连接中") : t("install.处理中")}
          </>
        ) : (
          <>
            {isLastStep ? t("install.完成安装") : t("install.下一步")}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
