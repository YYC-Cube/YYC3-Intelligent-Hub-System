import type React from "react"

import {
  BookOpen,
  Code,
  Server,
  Settings,
  Zap,
} from "lucide-react"

/**
 * 渐进式学习路径 —— 全站唯一数据源。
 *
 * 消费方（必须同源，禁止复制副本）：
 * - app/developer/progressive-guide/page.tsx        学习路径总览（client）
 * - app/developer/progressive-guide/module/[id]/page.tsx    generateStaticParams / generateMetadata（server）
 * - app/developer/progressive-guide/module/[id]/client-page.tsx  模块详情渲染（client）
 *
 * 步骤正文（markdown）不在本文件：见 app/data/learning-content.ts。
 */

export interface Step {
  id: string
  title: string
  type: "阅读" | "视频" | "练习" | "测验"
  completed?: boolean
  duration: number // 分钟
}

export interface Module {
  id: string
  title: string
  description: string
  completed?: boolean
  locked?: boolean
  duration: number // 分钟
  steps: Step[]
}

export interface LearningPath {
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

export const learningPaths: LearningPath[] = [
  {
    id: "getting-started",
    title: "入门指南",
    description: "了解YanYuCloudCube集成中心的基本概念和环境设置",
    level: "入门",
    estimatedHours: 2,
    icon: BookOpen,
    color: "bg-primary",
    modules: [
      {
        id: "intro-to-yanyu",
        title: "YanYuCloudCube集成中心简介",
        description: "了解系统架构和核心概念",
        completed: true,
        duration: 30,
        steps: [
          { id: "what-is-yanyu", title: "什么是YanYuCloudCube集成中心", type: "阅读", completed: true, duration: 10 },
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
    color: "bg-accent",
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
    color: "bg-success",
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
    color: "bg-warning",
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
    color: "bg-destructive",
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

export interface ModuleLookup {
  module: Module
  path: Pick<LearningPath, "id" | "title" | "description" | "level">
  prevModule: Pick<Module, "id" | "title"> | null
  nextModule: Pick<Module, "id" | "title"> | null
}

/** 按 id 查找模块及所属路径与前后模块（全路径扁平顺序）。 */
export function findModuleById(id: string): ModuleLookup | null {
  for (const path of learningPaths) {
    const index = path.modules.findIndex((m) => m.id === id)
    if (index === -1) continue

    const mod = path.modules[index]
    return {
      module: mod,
      path: { id: path.id, title: path.title, description: path.description, level: path.level },
      prevModule: index > 0 ? path.modules[index - 1] : null,
      nextModule: index < path.modules.length - 1 ? path.modules[index + 1] : null,
    }
  }
  return null
}

/** 全部模块 id（generateStaticParams / sitemap 消费，禁止硬编码副本）。 */
export function getAllModuleIds(): string[] {
  return learningPaths.flatMap((path) => path.modules.map((m) => m.id))
}
