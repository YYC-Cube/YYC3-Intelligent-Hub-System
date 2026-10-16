"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Clock, BookOpen, Video, FileText, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

// 模拟模块数据
const moduleData = {
  id: "component-basics",
  title: "组件基础",
  description: "了解React组件和基本用法",
  pathId: "frontend-basics",
  pathTitle: "前端基础",
  duration: 60,
  progress: 33,
  steps: [
    {
      id: "react-intro",
      title: "React 基础",
      type: "阅读",
      duration: 20,
      completed: true,
      content: `
# React 基础

React 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发并维护，被广泛用于构建单页应用程序。

## 核心概念

### 组件

React 应用由组件构成。组件是可重用的、独立的代码块，它们返回要在页面上渲染的 React 元素。

\`\`\`jsx
function Welcome(props) {
  return <h1>你好，{props.name}</h1>;
}
\`\`\`

### JSX

JSX 是 JavaScript 的语法扩展，它允许你在 JavaScript 中编写类似 HTML 的代码。

\`\`\`jsx
const element = <h1>Hello, world!</h1>;
\`\`\`

### Props

Props 是从父组件传递到子组件的数据。

\`\`\`jsx
function Welcome(props) {
  return <h1>你好，{props.name}</h1>;
}

// 使用
<Welcome name="言语云" />
\`\`\`

### State

State 是组件内部管理的数据，当 state 改变时，组件会重新渲染。

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}
\`\`\`

## 在言语云³集成中心的应用

在言语云³集成中心，我们使用 React 组件来构建用户界面。每个集成应用都是由多个组件组成的，这些组件可以是：

- 页面组件：如集成列表页、详情页等
- UI组件：如按钮、卡片、表单等
- 功能组件：如数据加载器、错误边界等

通过掌握 React 基础，你将能够理解和开发言语云³集成中心的前端部分。
      `,
    },
    {
      id: "component-structure",
      title: "组件结构",
      type: "阅读",
      duration: 20,
      completed: false,
      content: `
# 组件结构

在言语云³集成中心，我们遵循一定的组件结构规范，以确保代码的可维护性和可扩展性。

## 组件类型

### 页面组件

页面组件位于 \`app\` 目录下，对应于应用的路由。例如：

\`\`\`
app/
  integrations/
    page.tsx      # 集成列表页
    [id]/
      page.tsx    # 集成详情页
\`\`\`

### 共享组件

共享组件位于 \`components\` 目录下，可以被多个页面复用。例如：

\`\`\`
components/
  ui/             # UI组件
    button.tsx
    card.tsx
  layout/         # 布局组件
    sidebar.tsx
    header.tsx
\`\`\`

## 组件文件结构

一个典型的组件文件结构如下：

\`\`\`tsx
// 1. 导入
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. 类型定义
interface CardProps {
  title: string
  description?: string
  children: React.ReactNode
}

// 3. 组件定义
export function Card({ title, description, children }: CardProps) {
  // 3.1 状态和钩子
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 3.2 事件处理函数
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  
  // 3.3 渲染
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-gray-500">{description}</p>}
      
      <div className={isExpanded ? 'mt-4' : 'mt-4 max-h-20 overflow-hidden'}>
        {children}
      </div>
      
      <Button onClick={handleToggle} variant="ghost" className="mt-2">
        {isExpanded ? '收起' : '展开'}
      </Button>
    </div>
  )
}
\`\`\`

## 最佳实践

1. **组件命名**：使用 PascalCase 命名组件
2. **文件命名**：使用 kebab-case 命名文件
3. **组件大小**：保持组件小而专注，一个组件应该只做一件事
4. **组件组合**：通过组合小组件构建复杂UI，而不是创建庞大的组件
5. **状态管理**：将状态尽可能保持在最低必要的层级
6. **Props接口**：为组件定义明确的Props接口
7. **默认值**：为可选props提供合理的默认值
      `,
    },
    {
      id: "props-state",
      title: "Props 和 State",
      type: "练习",
      duration: 20,
      completed: false,
      content: `
# Props 和 State 练习

在这个练习中，你将创建一个简单的集成卡片组件，它使用props接收数据，并使用state管理内部状态。

## 任务描述

创建一个 \`IntegrationCard\` 组件，它应该：

1. 接收集成应用的数据作为props
2. 显示集成的名称、描述、图标和类别
3. 有一个"收藏"按钮，点击时切换收藏状态
4. 有一个"查看详情"按钮，点击时导航到详情页

## 起始代码

\`\`\`tsx
import { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 完成下面的代码
interface IntegrationCardProps {
  // 定义props接口
}

export function IntegrationCard({ /* 解构props */ }: IntegrationCardProps) {
  // 添加收藏状态
  
  // 添加切换收藏的处理函数
  
  return (
    <Card>
      <CardContent className="p-4">
        {/* 显示集成数据 */}
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* 添加收藏按钮 */}
        {/* 添加查看详情按钮 */}
      </CardFooter>
    </Card>
  )
}
\`\`\`

## 参考解决方案

\`\`\`tsx
import { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

interface IntegrationCardProps {
  integration: Integration
  initialFavorite?: boolean
}

export function IntegrationCard({ 
  integration, 
  initialFavorite = false 
}: IntegrationCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
            <img 
              src={integration.icon || "/placeholder.svg"} 
              alt={integration.name} 
              className="w-6 h-6"
            />
          </div>
          <div>
            <h3 className="font-medium">{integration.name}</h3>
            <p className="text-sm text-gray-500">{integration.description}</p>
            <Badge variant="outline" className="mt-2">
              {integration.category}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggleFavorite}
        >
          <Star 
            className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""} 
            size={16} 
          />
          <span className="ml-1">
            {isFavorite ? '已收藏' : '收藏'}
          </span>
        </Button>
        <Button asChild size="sm">
          <Link href={'/integrations/' + integration.id}>
            查看详情
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
\`\`\`

## 提交你的解决方案

完成练习后，你可以：

1. 在开发环境中测试你的组件
2. 将代码提交到你的项目仓库
3. 在社区中分享你的解决方案，获取反馈
      `,
    },
  ],
  nextModule: {
    id: "ui-components",
    title: "UI组件库",
  },
  prevModule: {
    id: "intro-to-yanyu",
    title: "言语云³集成中心简介",
  },
}

// 步骤类型图标映射
const stepTypeIcons = {
  阅读: BookOpen,
  视频: Video,
  练习: FileText,
  测验: FileText,
}

export default function ModuleDetailClient() {
  const { t } = useI18n()
  const params = useParams()
  const moduleId = params.id as string
  const [module, setModule] = useState(moduleData)
  const [activeStep, setActiveStep] = useState(moduleData.steps[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 模拟进度加载动画（延时回调中的 setState 不属于 effect 同步更新）
    const timer = setTimeout(() => {
      setProgress(moduleData.progress)
    }, 500)
    return () => clearTimeout(timer)
  }, [moduleId])

  const handleStepChange = (stepId: string) => {
    const step = module.steps.find((s) => s.id === stepId)
    if (step) {
      setActiveStep(step)
    }
  }

  const handleCompleteStep = () => {
    // 模拟完成步骤
    // 实际应用中，这里会调用API更新进度
    const updatedSteps = module.steps.map((step) => (step.id === activeStep.id ? { ...step, completed: true } : step))
    setModule({ ...module, steps: updatedSteps })

    // 找到下一个未完成的步骤
    const nextIncompleteStep = updatedSteps.find((step) => !step.completed)
    if (nextIncompleteStep) {
      setActiveStep(nextIncompleteStep)
    }

    // 更新进度
    const completedCount = updatedSteps.filter((step) => step.completed).length
    const newProgress = Math.round((completedCount / updatedSteps.length) * 100)
    setProgress(newProgress)
  }

  const getNextStep = () => {
    const currentIndex = module.steps.findIndex((step) => step.id === activeStep.id)
    if (currentIndex < module.steps.length - 1) {
      return module.steps[currentIndex + 1]
    }
    return null
  }

  const getPrevStep = () => {
    const currentIndex = module.steps.findIndex((step) => step.id === activeStep.id)
    if (currentIndex > 0) {
      return module.steps[currentIndex - 1]
    }
    return null
  }

  const StepIcon = stepTypeIcons[activeStep.type as keyof typeof stepTypeIcons] || FileText

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center text-sm">
            <Link href="/developer/progressive-guide" className="text-gray-500 hover:text-gray-900">
              {t("developer.递进式开发指南")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link
              href={`/developer/progressive-guide?path=${module.pathId}`}
              className="text-gray-500 hover:text-gray-900"
            >
              {tc("developer", module.pathTitle)}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium">{tc("developer", module.title)}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* 模块标题和进度 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{tc("developer", module.title)}</h1>
            <Badge variant="outline" className="text-base px-3 py-1">
              {tc("developer", module.pathTitle)}
            </Badge>
          </div>
          <p className="text-xl text-gray-600 mb-4">{tc("developer", module.description)}</p>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{t("developer.总时长: {duration} 分钟", { duration: String(module.duration) })}</span>
          </div>

          <div className="bg-white p-4 rounded-lg border mb-4">
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
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <h2 className="font-medium mb-4">{t("developer.学习步骤")}</h2>
              <div className="space-y-2">
                {module.steps.map((step, index) => {
                  const StepIcon = stepTypeIcons[step.type as keyof typeof stepTypeIcons] || FileText

                  return (
                    <button
                      key={step.id}
                      className={`flex items-center w-full p-3 rounded-md text-left ${
                        activeStep.id === step.id ? "bg-blue-50 border-blue-200 border" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleStepChange(step.id)}
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                          step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${step.completed ? "text-green-600" : ""}`}>
                          {tc("developer", step.title)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
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
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <StepIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{tc("developer", activeStep.title)}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Badge variant="outline" className="mr-2">
                        {tc("developer", activeStep.type)}
                      </Badge>
                      <span>{t("developer.{duration} 分钟", { duration: String(activeStep.duration) })}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* 步骤内容 */}
                <div className="prose prose-gray max-w-none">
                  {activeStep.content.split("\n").map((line, i) => (
                    <p key={i} className="whitespace-pre-wrap">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 导航按钮 */}
            <div className="flex justify-between">
              {getPrevStep() ? (
                <Button variant="outline" onClick={() => handleStepChange(getPrevStep()!.id)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {tc("developer", getPrevStep()!.title)}
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`/developer/progressive-guide/module/${module.prevModule.id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {tc("developer", module.prevModule.title)}
                  </Link>
                </Button>
              )}

              {activeStep.completed ? (
                getNextStep() ? (
                  <Button onClick={() => handleStepChange(getNextStep()!.id)}>
                    {tc("developer", getNextStep()!.title)}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href={`/developer/progressive-guide/module/${module.nextModule.id}`}>
                      {tc("developer", module.nextModule.title)}
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
