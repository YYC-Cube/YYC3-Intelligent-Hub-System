"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  BookOpen,
  Code,
  Layers,
  Package,
  Server,
  Settings,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

// 定义学习路径类型
interface LearningPath {
  id: string
  title: string
  description: string
  level: "入门" | "基础" | "中级" | "高级" | "专家"
  estimatedHours: number
  modules: Module[]
  prerequisites?: string[]
  icon: React.ElementType
  color: string
}

interface Module {
  id: string
  title: string
  description: string
  completed?: boolean
  locked?: boolean
  duration: number // 分钟
  steps: Step[]
}

interface Step {
  id: string
  title: string
  type: "阅读" | "视频" | "练习" | "测验"
  completed?: boolean
  duration: number // 分钟
}

// 模拟用户进度数据
const userProgress = {
  completedPaths: ["getting-started"],
  completedModules: ["intro-to-yanyu", "setup-environment", "first-integration"],
  currentModule: "component-basics",
  overallProgress: 28,
}

// 学习路径数据
const learningPaths: LearningPath[] = [
  {
    id: "getting-started",
    title: "入门指南",
    description: "了解言语云³集成中心的基本概念和环境设置",
    level: "入门",
    estimatedHours: 2,
    icon: BookOpen,
    color: "bg-blue-500",
    modules: [
      {
        id: "intro-to-yanyu",
        title: "言语云³集成中心简介",
        description: "了解系统架构和核心概念",
        completed: true,
        duration: 30,
        steps: [
          { id: "what-is-yanyu", title: "什么是言语云³集成中心", type: "阅读", completed: true, duration: 10 },
          { id: "system-overview", title: "系统架构概览", type: "阅读", completed: true, duration: 10 },
          { id: "core-concepts", title: "核心概念和术语", type: "阅读", completed: true, duration: 10 },
        ],
      },
      {
        id: "setup-environment",
        title: "环境设置",
        description: "配置开发环境和必要工具",
        completed: true,
        duration: 45,
        steps: [
          { id: "install-nodejs", title: "安装 Node.js 和 npm", type: "阅读", completed: true, duration: 15 },
          { id: "setup-editor", title: "配置代码编辑器", type: "阅读", completed: true, duration: 15 },
          { id: "clone-repo", title: "克隆项目仓库", type: "练习", completed: true, duration: 15 },
        ],
      },
      {
        id: "first-integration",
        title: "创建第一个集成",
        description: "构建一个简单的集成应用",
        completed: true,
        duration: 45,
        steps: [
          { id: "create-project", title: "创建项目", type: "练习", completed: true, duration: 15 },
          { id: "basic-structure", title: "基本结构", type: "阅读", completed: true, duration: 15 },
          { id: "run-locally", title: "本地运行", type: "练习", completed: true, duration: 15 },
        ],
      },
    ],
  },
  {
    id: "frontend-basics",
    title: "前端基础",
    description: "学习前端组件和UI开发",
    level: "基础",
    estimatedHours: 4,
    icon: Code,
    color: "bg-purple-500",
    prerequisites: ["getting-started"],
    modules: [
      {
        id: "component-basics",
        title: "组件基础",
        description: "了解React组件和基本用法",
        duration: 60,
        steps: [
          { id: "react-intro", title: "React 基础", type: "阅读", duration: 20 },
          { id: "component-structure", title: "组件结构", type: "阅读", duration: 20 },
          { id: "props-state", title: "Props 和 State", type: "练习", duration: 20 },
        ],
      },
      {
        id: "ui-components",
        title: "UI组件库",
        description: "使用shadcn/ui组件库",
        locked: true,
        duration: 90,
        steps: [
          { id: "shadcn-intro", title: "shadcn/ui 简介", type: "阅读", duration: 20 },
          { id: "common-components", title: "常用组件", type: "阅读", duration: 30 },
          { id: "custom-components", title: "自定义组件", type: "练习", duration: 40 },
        ],
      },
      {
        id: "styling",
        title: "样式和主题",
        description: "使用Tailwind CSS和主题定制",
        locked: true,
        duration: 90,
        steps: [
          { id: "tailwind-basics", title: "Tailwind CSS 基础", type: "阅读", duration: 30 },
          { id: "responsive-design", title: "响应式设计", type: "练习", duration: 30 },
          { id: "theming", title: "主题定制", type: "练习", duration: 30 },
        ],
      },
    ],
  },
  {
    id: "backend-development",
    title: "后端开发",
    description: "学习API和数据处理",
    level: "中级",
    estimatedHours: 6,
    icon: Server,
    color: "bg-green-500",
    prerequisites: ["frontend-basics"],
    modules: [
      {
        id: "api-routes",
        title: "API路由",
        description: "创建和使用Next.js API路由",
        locked: true,
        duration: 90,
        steps: [
          { id: "api-intro", title: "API路由简介", type: "阅读", duration: 20 },
          { id: "create-api", title: "创建API端点", type: "练习", duration: 40 },
          { id: "api-testing", title: "API测试", type: "练习", duration: 30 },
        ],
      },
      {
        id: "database",
        title: "数据库集成",
        description: "使用Neon PostgreSQL数据库",
        locked: true,
        duration: 120,
        steps: [
          { id: "db-setup", title: "数据库设置", type: "阅读", duration: 30 },
          { id: "data-models", title: "数据模型", type: "阅读", duration: 30 },
          { id: "crud-operations", title: "CRUD操作", type: "练习", duration: 60 },
        ],
      },
      {
        id: "authentication",
        title: "用户认证",
        description: "实现用户认证和授权",
        locked: true,
        duration: 150,
        steps: [
          { id: "auth-concepts", title: "认证概念", type: "阅读", duration: 30 },
          { id: "auth-setup", title: "认证设置", type: "练习", duration: 60 },
          { id: "role-based-access", title: "基于角色的访问控制", type: "练习", duration: 60 },
        ],
      },
    ],
  },
  {
    id: "advanced-features",
    title: "高级功能",
    description: "学习高级功能和集成",
    level: "高级",
    estimatedHours: 8,
    icon: Zap,
    color: "bg-amber-500",
    prerequisites: ["backend-development"],
    modules: [
      {
        id: "ai-integration",
        title: "AI助手集成",
        description: "集成和自定义AI助手",
        locked: true,
        duration: 180,
        steps: [
          { id: "ai-concepts", title: "AI集成概念", type: "阅读", duration: 40 },
          { id: "openai-setup", title: "OpenAI设置", type: "练习", duration: 60 },
          { id: "custom-assistant", title: "自定义助手行为", type: "练习", duration: 80 },
        ],
      },
      {
        id: "data-visualization",
        title: "数据可视化",
        description: "创建交互式数据可视化",
        locked: true,
        duration: 150,
        steps: [
          { id: "viz-libraries", title: "可视化库介绍", type: "阅读", duration: 30 },
          { id: "charts-graphs", title: "图表和图形", type: "练习", duration: 60 },
          { id: "interactive-dashboards", title: "交互式仪表板", type: "练习", duration: 60 },
        ],
      },
      {
        id: "performance",
        title: "性能优化",
        description: "优化应用性能",
        locked: true,
        duration: 150,
        steps: [
          { id: "perf-metrics", title: "性能指标", type: "阅读", duration: 30 },
          { id: "code-splitting", title: "代码分割", type: "练习", duration: 60 },
          { id: "caching", title: "缓存策略", type: "练习", duration: 60 },
        ],
      },
    ],
  },
  {
    id: "deployment",
    title: "部署与运维",
    description: "学习部署和维护应用",
    level: "专家",
    estimatedHours: 6,
    icon: Settings,
    color: "bg-red-500",
    prerequisites: ["advanced-features"],
    modules: [
      {
        id: "github-pages-deployment",
        title: "GitHub Pages 部署",
        description: "通过 GitHub Actions 自动部署到 GitHub Pages",
        locked: true,
        duration: 120,
        steps: [
          { id: "gh-pages-setup", title: "GitHub Pages 配置", type: "阅读", duration: 30 },
          { id: "ci-cd-config", title: "CI/CD 工作流配置", type: "练习", duration: 45 },
          { id: "custom-domains", title: "自定义域名 nexus.yyc3.vip", type: "练习", duration: 45 },
        ],
      },
      {
        id: "monitoring",
        title: "监控和日志",
        description: "设置监控和日志系统",
        locked: true,
        duration: 120,
        steps: [
          { id: "monitoring-tools", title: "监控工具", type: "阅读", duration: 30 },
          { id: "log-setup", title: "日志设置", type: "练习", duration: 45 },
          { id: "alerts", title: "警报配置", type: "练习", duration: 45 },
        ],
      },
      {
        id: "ci-cd",
        title: "CI/CD流程",
        description: "设置持续集成和部署",
        locked: true,
        duration: 120,
        steps: [
          { id: "ci-cd-concepts", title: "CI/CD概念", type: "阅读", duration: 30 },
          { id: "github-actions", title: "GitHub Actions", type: "练习", duration: 45 },
          { id: "automated-testing", title: "自动化测试", type: "练习", duration: 45 },
        ],
      },
    ],
  },
]

export default function ProgressiveGuidePage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 模拟进度加载动画
    const timer = setTimeout(() => {
      setProgress(userProgress.overallProgress)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handlePathSelect = (path: LearningPath) => {
    setSelectedPath(path)
    setActiveTab("path-details")
  }

  const isPathCompleted = (pathId: string) => {
    return userProgress.completedPaths.includes(pathId)
  }

  const isPathUnlocked = (path: LearningPath) => {
    if (!path.prerequisites || path.prerequisites.length === 0) return true
    return path.prerequisites.every((prereq) => isPathCompleted(prereq))
  }

  const isModuleCompleted = (moduleId: string) => {
    return userProgress.completedModules.includes(moduleId)
  }

  const isModuleCurrent = (moduleId: string) => {
    return userProgress.currentModule === moduleId
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "入门":
        return "bg-blue-500"
      case "基础":
        return "bg-green-500"
      case "中级":
        return "bg-yellow-500"
      case "高级":
        return "bg-orange-500"
      case "专家":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("developer.递进式开发指南")}</h1>
          <p className="text-xl opacity-90 max-w-3xl">{t("developer.从入门到精通，循序渐进地学习言语云³集成中心系统的开发")}</p>

          {/* 总体进度 */}
          <div className="mt-8 bg-white/20 p-4 rounded-lg backdrop-blur-sm max-w-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{t("developer.总体学习进度")}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="overview">{t("developer.学习路径概览")}</TabsTrigger>
            <TabsTrigger value="path-details" disabled={!selectedPath}>
              {selectedPath ? tc("developer", selectedPath.title) : t("developer.路径详情")}
            </TabsTrigger>
          </TabsList>

          {/* 学习路径概览 */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path) => {
                const isUnlocked = isPathUnlocked(path)
                const isCompleted = isPathCompleted(path.id)

                return (
                  <Card
                    key={path.id}
                    className={`overflow-hidden transition-all ${
                      isUnlocked ? "hover:shadow-md cursor-pointer" : "opacity-75"
                    }`}
                    onClick={() => isUnlocked && handlePathSelect(path)}
                  >
                    <div className={`h-2 ${path.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-full ${path.color} bg-opacity-20`}>
                          <path.icon className={`h-6 w-6 ${path.color.replace("bg-", "text-")}`} />
                        </div>
                        <Badge variant="outline" className={`${getLevelColor(path.level)} text-white`}>
                          {tc("developer", path.level)}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{tc("developer", path.title)}</h3>
                      <p className="text-gray-600 mb-4">{tc("developer", path.description)}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{t("developer.约 {hours} 小时", { hours: String(path.estimatedHours) })}</span>
                        </div>
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-1" />
                          <span>{t("developer.{count} 个模块", { count: String(path.modules.length) })}</span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>{t("developer.已完成")}</span>
                        </div>
                      ) : isUnlocked ? (
                        <Button className="w-full">
                          {userProgress.currentModule === path.modules[0].id
                            ? t("developer.继续学习")
                            : t("developer.开始学习")}
                        </Button>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <Lock className="h-5 w-5 mr-2" />
                          <span>{t("developer.需要完成前置路径")}</span>
                        </div>
                      )}

                      {path.prerequisites && path.prerequisites.length > 0 && (
                        <div className="mt-4 text-sm text-gray-500">
                          <p>{t("developer.前置要求：")}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {path.prerequisites.map((prereq) => {
                              const prereqPath = learningPaths.find((p) => p.id === prereq)
                              return (
                                <Badge key={prereq} variant="outline" className="bg-gray-100">
                                  {prereqPath ? tc("developer", prereqPath.title) : prereq}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 路径详情 */}
          <TabsContent value="path-details" className="space-y-8">
            {selectedPath && (
              <>
                <div className="flex items-center space-x-2 mb-6">
                  <Button variant="ghost" onClick={() => setActiveTab("overview")}>
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    {t("developer.返回")}
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <h2 className="text-2xl font-bold">{tc("developer", selectedPath.title)}</h2>
                  <Badge variant="outline" className={`${getLevelColor(selectedPath.level)} text-white ml-2`}>
                    {tc("developer", selectedPath.level)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* 左侧：路径信息 */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardContent className="p-6">
                        <div className={`p-3 rounded-full ${selectedPath.color} bg-opacity-20 inline-block mb-4`}>
                          <selectedPath.icon className={`h-6 w-6 ${selectedPath.color.replace("bg-", "text-")}`} />
                        </div>

                        <h3 className="text-xl font-bold mb-2">{tc("developer", selectedPath.title)}</h3>
                        <p className="text-gray-600 mb-6">{tc("developer", selectedPath.description)}</p>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">{t("developer.难度级别")}</span>
                            <Badge variant="outline" className={`${getLevelColor(selectedPath.level)} text-white`}>
                              {tc("developer", selectedPath.level)}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">{t("developer.预计学习时间")}</span>
                            <span>{t("developer.{hours} 小时", { hours: String(selectedPath.estimatedHours) })}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">{t("developer.模块数量")}</span>
                            <span>{t("developer.{count} 个", { count: String(selectedPath.modules.length) })}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">{t("developer.完成状态")}</span>
                            {isPathCompleted(selectedPath.id) ? (
                              <Badge className="bg-green-500">{t("developer.已完成")}</Badge>
                            ) : (
                              <Badge className="bg-blue-500">{t("developer.进行中")}</Badge>
                            )}
                          </div>
                        </div>

                        {selectedPath.prerequisites && selectedPath.prerequisites.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-medium mb-2">{t("developer.前置要求")}</h4>
                            <div className="space-y-2">
                              {selectedPath.prerequisites.map((prereq) => {
                                const prereqPath = learningPaths.find((p) => p.id === prereq)
                                return (
                                  <div key={prereq} className="flex items-center justify-between">
                                    <span>{prereqPath ? tc("developer", prereqPath.title) : prereq}</span>
                                    {isPathCompleted(prereq) ? (
                                      <Badge className="bg-green-500">{t("developer.已完成")}</Badge>
                                    ) : (
                                      <Badge className="bg-amber-500">{t("developer.未完成")}</Badge>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* 右侧：模块列表 */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedPath.modules.map((module, index) => {
                      const isCompleted = isModuleCompleted(module.id)
                      const isCurrent = isModuleCurrent(module.id)
                      const isLocked = module.locked && !isCompleted && !isCurrent

                      return (
                        <Collapsible key={module.id} className="border rounded-lg overflow-hidden">
                          <CollapsibleTrigger
                            className={`flex items-center justify-between w-full p-4 text-left ${
                              isLocked ? "bg-gray-100" : isCurrent ? "bg-blue-50" : isCompleted ? "bg-green-50" : ""
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-3 text-gray-700">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium">{tc("developer", module.title)}</h3>
                                <p className="text-sm text-gray-500">{tc("developer", module.description)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {isLocked ? (
                                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                              ) : isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              ) : isCurrent ? (
                                <Badge className="bg-blue-500 mr-2">{t("developer.当前")}</Badge>
                              ) : null}
                              <span className="text-sm text-gray-500 mr-2">
                                {t("developer.{duration} 分钟", { duration: String(module.duration) })}
                              </span>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent className={`${isLocked ? "bg-gray-50" : ""}`}>
                            <div className="p-4 border-t">
                              {isLocked ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                  <Lock className="h-12 w-12 text-gray-400 mb-2" />
                                  <p className="text-gray-500 mb-4">{t("developer.完成前面的模块以解锁此内容")}</p>
                                  {index > 0 && <Button variant="outline">{t("developer.前往上一模块")}</Button>}
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <h4 className="font-medium mb-2">{t("developer.学习步骤")}</h4>
                                  <div className="space-y-2">
                                    {module.steps.map((step, stepIndex) => (
                                      <div
                                        key={step.id}
                                        className="flex items-center justify-between p-3 bg-white border rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mr-3 text-xs">
                                            {stepIndex + 1}
                                          </div>
                                          <div>
                                            <p className="font-medium">{tc("developer", step.title)}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                              <Badge variant="outline" className="mr-2">
                                                {tc("developer", step.type)}
                                              </Badge>
                                              <span>{t("developer.{duration} 分钟", { duration: String(step.duration) })}</span>
                                            </div>
                                          </div>
                                        </div>
                                        {step.completed ? (
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                          <Button size="sm">{t("developer.开始")}</Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex justify-between pt-4">
                                    {index > 0 && (
                                      <Button variant="outline">
                                        <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                                        {t("developer.上一模块")}
                                      </Button>
                                    )}
                                    {index < selectedPath.modules.length - 1 && (
                                      <Button className="ml-auto">
                                        {t("developer.下一模块")}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* 推荐资源 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t("developer.推荐学习资源")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("developer.API参考文档")}</h3>
                    <p className="text-gray-500 mb-4">{t("developer.完整的API参考文档，包含所有端点和参数说明。")}</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/developer/api" className="flex items-center justify-between">
                        <span>{t("developer.查看文档")}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("developer.组件示例")}</h3>
                    <p className="text-gray-500 mb-4">{t("developer.浏览所有UI组件的示例和用法说明。")}</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/developer/components" className="flex items-center justify-between">
                        <span>{t("developer.查看组件")}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("developer.开发者社区")}</h3>
                    <p className="text-gray-500 mb-4">{t("developer.加入我们的开发者社区，获取帮助和分享经验。")}</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        href="https://community.yanyu.cloud"
                        target="_blank"
                        className="flex items-center justify-between"
                      >
                        <span>{t("developer.加入社区")}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
