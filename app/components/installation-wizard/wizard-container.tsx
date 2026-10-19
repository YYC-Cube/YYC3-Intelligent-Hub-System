"use client"

import type React from "react"

import { useI18n } from "@/app/hooks/use-i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AlertCircle, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isOptional?: boolean
  isCompleted?: boolean
  hasError?: boolean
}

interface WizardContainerProps {
  steps: WizardStep[]
  onComplete: (data: any) => void
  onCancel: () => void
  title: string
  description?: string
}

export function WizardContainer({ steps, onComplete, onCancel, title, description }: WizardContainerProps) {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepData, setStepData] = useState<Record<string, any>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showStepDetails, setShowStepDetails] = useState(false)

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setCurrentStep(currentStep + 1)
    } else {
      // 完成所有步骤
      onComplete(stepData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepData = (stepId: string, data: any) => {
    setStepData((prev) => ({
      ...prev,
      [stepId]: data,
    }))
  }

  const canProceed = () => {
    const currentStepData = stepData[steps[currentStep].id]
    return currentStepData && Object.keys(currentStepData).length > 0
  }

  const CurrentStepComponent = steps[currentStep]?.component

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              {description && <p className="text-muted-foreground mt-2">{description}</p>}
            </div>
            <Button variant="outline" onClick={onCancel}>
              {t("install.取消")}
            </Button>
          </div>

          {/* 进度条 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t("install.步骤 {current} / {total}", {
                  current: String(currentStep + 1),
                  total: String(steps.length),
                })}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("install.{percent}% 完成", { percent: String(Math.round(progress)) })}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 步骤概览 */}
          <Collapsible open={showStepDetails} onOpenChange={setShowStepDetails}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mt-4 p-2 hover:bg-muted rounded-lg transition-colors">
              <span className="text-sm font-medium">{t("install.查看所有步骤")}</span>
              <ChevronRight className={cn("h-4 w-4 transition-transform", showStepDetails && "rotate-90")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center p-3 rounded-lg border transition-colors",
                      index === currentStep && "border-primary/30 bg-brand-50",
                      completedSteps.has(index) && "border-success/30 bg-success/15",
                      step.hasError && "border-destructive/30 bg-destructive/15",
                    )}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {completedSteps.has(index) ? (
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-success-foreground" />
                        </div>
                      ) : step.hasError ? (
                        <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-destructive-foreground" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                            index === currentStep
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.isOptional && <span className="text-xs text-muted-foreground">{t("install.（可选）")}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardContent>
          {/* 当前步骤内容 */}
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{steps[currentStep]?.title}</h3>
              <p className="text-muted-foreground">{steps[currentStep]?.description}</p>
            </div>

            {CurrentStepComponent && (
              <CurrentStepComponent
                data={stepData[steps[currentStep].id] || {}}
                onDataChange={(data: any) => handleStepData(steps[currentStep].id, data)}
              />
            )}
          </div>

          {/* 导航按钮 */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("install.上一步")}
            </Button>

            <div className="flex items-center space-x-2">
              {steps[currentStep]?.isOptional && (
                <Button variant="ghost" onClick={handleNext}>
                  {t("install.跳过")}
                </Button>
              )}
              <Button onClick={handleNext} disabled={!canProceed() && !steps[currentStep]?.isOptional}>
                {currentStep === steps.length - 1 ? t("install.完成") : t("install.下一步")}
                {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
