"use client"

import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, ChevronRight, Clock, FileText, Video } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { learningContent } from "@/app/data/learning-content"
import { findModuleById, type Module, type Step } from "@/app/data/learning-paths"
import { useI18n } from "@/app/hooks/use-i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { tc } from "@/lib/yyc3/i18n/data"

// 步骤类型图标映射
const stepTypeIcons = {
  阅读: BookOpen,
  视频: Video,
  练习: FileText,
  测验: FileText,
}

/** 计算已完成步骤比例（模拟进度：completed 标记来自学习路径数据）。 */
function computeProgress(module: Module): number {
  if (module.steps.length === 0) return 0
  const completed = module.steps.filter((s) => s.completed).length
  return Math.round((completed / module.steps.length) * 100)
}

export default function ModuleDetailClient() {
  const { t } = useI18n()
  const params = useParams()
  const moduleId = params.id as string

  // 模块数据来自全站唯一数据源 learning-paths（与列表页/元数据同源）
  const lookup = useMemo(() => findModuleById(moduleId), [moduleId])
  const [module, setModule] = useState<Module | null>(() =>
    lookup ? structuredClone(lookup.module) : null
  )
  const [activeStep, setActiveStep] = useState<Step | null>(() =>
    lookup?.module.steps[0] ?? null
  )
  const [progress, setProgress] = useState(() => (module ? computeProgress(module) : 0))

  useEffect(() => {
    // id 变化时重置本地态（延时回调中的 setState 不属于 effect 同步更新）
    const timer = setTimeout(() => {
      setProgress(module ? computeProgress(module) : 0)
    }, 0)
    return () => clearTimeout(timer)
  }, [moduleId, module])

  // 模块不存在：静态导出下该 URL 不会被预渲染，此回退仅覆盖运行时异常导航
  if (!lookup || !module) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16">
        <p className="text-muted-foreground">{t("developer.未找到该学习模块")}</p>
        <Button variant="outline" asChild>
          <Link href="/developer/progressive-guide">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("developer.返回学习路径")}
          </Link>
        </Button>
      </div>
    )
  }

  const currentActive = activeStep && module.steps.some((s) => s.id === activeStep.id)
    ? activeStep
    : module.steps[0]

  const handleStepChange = (stepId: string) => {
    const step = module.steps.find((s) => s.id === stepId)
    if (step) {
      setActiveStep(step)
    }
  }

  const handleCompleteStep = () => {
    if (!currentActive) return
    // 模拟完成步骤（实际应用中，这里会调用API更新进度）
    const updatedSteps = module.steps.map((step) =>
      step.id === currentActive.id ? { ...step, completed: true } : step
    )
    setModule({ ...module, steps: updatedSteps })

    // 找到下一个未完成的步骤
    const nextIncompleteStep = updatedSteps.find((step) => !step.completed)
    if (nextIncompleteStep) {
      setActiveStep(nextIncompleteStep)
    }

    // 更新进度
    const completedCount = updatedSteps.filter((step) => step.completed).length
    setProgress(Math.round((completedCount / updatedSteps.length) * 100))
  }

  const getNextStep = () => {
    if (!currentActive) return null
    const currentIndex = module.steps.findIndex((step) => step.id === currentActive.id)
    if (currentIndex < module.steps.length - 1) {
      return module.steps[currentIndex + 1]
    }
    return null
  }

  const getPrevStep = () => {
    if (!currentActive) return null
    const currentIndex = module.steps.findIndex((step) => step.id === currentActive.id)
    if (currentIndex > 0) {
      return module.steps[currentIndex - 1]
    }
    return null
  }

  const StepIcon = currentActive
    ? stepTypeIcons[currentActive.type as keyof typeof stepTypeIcons] || FileText
    : FileText
  const activeContent = currentActive ? learningContent[currentActive.id] : undefined

  return (
    <div className="pb-12">
      {/* 面包屑导航 */}
      <div className="bg-card border-b">
        <div className="mx-auto w-full max-w-page px-4 py-4">
          <div className="flex items-center text-sm">
            <Link href="/developer/progressive-guide" className="text-muted-foreground hover:text-foreground">
              {t("developer.递进式开发指南")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="text-muted-foreground">{tc("developer", lookup.path.title)}</span>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="font-medium">{tc("developer", module.title)}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 py-8">
        {/* 模块标题和进度 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{tc("developer", module.title)}</h1>
            <Badge variant="outline" className="text-base px-3 py-1">
              {tc("developer", lookup.path.title)}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground mb-4">{tc("developer", module.description)}</p>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{t("developer.总时长: {duration} 分钟", { duration: String(module.duration) })}</span>
          </div>

          <div className="bg-card p-4 rounded-lg border mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("developer.模块进度")}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：步骤列表 */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-4 sticky top-4">
              <h2 className="font-medium mb-4">{t("developer.学习步骤")}</h2>
              <div className="space-y-2">
                {module.steps.map((step, index) => {
                  const StepIcon = stepTypeIcons[step.type as keyof typeof stepTypeIcons] || FileText

                  return (
                    <button
                      key={step.id}
                      className={`flex items-center w-full p-3 rounded-md text-left ${currentActive?.id === step.id ? "bg-brand-50 border-brand-200 border" : "hover:bg-muted"
                        }`}
                      onClick={() => handleStepChange(step.id)}
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${step.completed ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${step.completed ? "text-success" : ""}`}>
                          {tc("developer", step.title)}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <StepIcon className="h-3 w-3 mr-1" />
                          <span>{tc("developer", step.type)}</span>
                          <span className="mx-1">•</span>
                          <span>{t("developer.{duration} 分钟", { duration: String(step.duration) })}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 右侧：内容显示 */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-6">
                {currentActive && (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-full bg-brand-100 mr-3">
                        <StepIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{tc("developer", currentActive.title)}</h2>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            {tc("developer", currentActive.type)}
                          </Badge>
                          <span>{t("developer.{duration} 分钟", { duration: String(currentActive.duration) })}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* 步骤内容：正文按模块逐步补齐，未收录时显示建设占位 */}
                    {activeContent ? (
                      <div className="prose prose-gray max-w-none">
                        {activeContent.split("\n").map((line, i) => (
                          <p key={i} className="whitespace-pre-wrap">
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">{t("developer.该步骤内容建设中")}</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          {t("developer.模块结构与学习路径已就绪，正文将持续更新")}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* 导航按钮 */}
            <div className="flex justify-between">
              {getPrevStep() ? (
                <Button variant="outline" onClick={() => handleStepChange(getPrevStep()!.id)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {tc("developer", getPrevStep()!.title)}
                </Button>
              ) : lookup.prevModule ? (
                <Button variant="outline" asChild>
                  <Link href={`/developer/progressive-guide/module/${lookup.prevModule.id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {tc("developer", lookup.prevModule.title)}
                  </Link>
                </Button>
              ) : (
                <span />
              )}

              {currentActive?.completed ? (
                getNextStep() ? (
                  <Button onClick={() => handleStepChange(getNextStep()!.id)}>
                    {tc("developer", getNextStep()!.title)}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : lookup.nextModule ? (
                  <Button asChild>
                    <Link href={`/developer/progressive-guide/module/${lookup.nextModule.id}`}>
                      {tc("developer", lookup.nextModule.title)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/developer/progressive-guide">
                      {t("developer.返回学习路径")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )
              ) : (
                <Button onClick={handleCompleteStep}>
                  {t("developer.完成本步骤")}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
