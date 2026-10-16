"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronRight,
  Search,
  FileCode,
  Package,
  Database,
  Server,
  Layers,
  TestTube,
  Rocket,
  GitBranch,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "@/app/hooks/use-i18n"
import { tc } from "@/lib/yyc3/i18n/data"

export default function DeveloperGuidePage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // 过滤文档内容
  const filterContent = (content: any[]) => {
    if (!searchQuery.trim()) return content

    return content.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // 文档内容
  const documentSections = {
    overview: [
      {
        title: "项目概述",
        content:
          "言语云³集成中心系统是一个现代化的集成应用管理平台，旨在帮助用户发现、连接并管理各种集成应用，提升业务效率。本系统采用最新的Web技术栈构建，提供直观的用户界面和强大的功能。",
      },
      {
        title: "核心功能",
        content:
          "• 集成应用发现与浏览\n• 应用市场与详情展示\n• 收藏管理与云同步\n• 集成应用安装向导\n• 智能AI助手\n• 分类热度指标与订阅\n• 端到端加密\n• 版本检查与更新",
      },
      {
        title: "技术栈",
        content:
          "• 前端框架: Next.js 14 (App Router)\n• UI组件: shadcn/ui + Tailwind CSS\n• 状态管理: React Context\n• 动画: Framer Motion\n• AI集成: AI SDK + OpenAI\n• 类型系统: TypeScript\n• 构建工具: Turbopack\n• 部署平台: GitHub Pages",
      },
    ],
    setup: [
      {
        title: "系统要求",
        content:
          "• Node.js 18.0.0 或更高版本\n• npm 9.0.0 或更高版本\n• Git\n• 支持的操作系统: Windows 10/11, macOS 10.15+, Ubuntu 20.04+",
      },
      {
        title: "开发环境设置",
        content:
          "1. 克隆代码库:\n```bash\ngit clone https://github.com/yanyu-cloud/integration-center.git\ncd integration-center\n```\n\n2. 安装依赖:\n```bash\nnpm install\n```\n\n3. 设置环境变量:\n复制 `.env.example` 文件为 `.env.local` 并填写必要的环境变量。\n\n4. 启动开发服务器:\n```bash\nnpm run dev\n```\n\n开发服务器将在 http://localhost:3000 启动。",
      },
      {
        title: "编辑器设置",
        content:
          "推荐使用 Visual Studio Code 作为代码编辑器，并安装以下扩展:\n\n• ESLint\n• Prettier\n• Tailwind CSS IntelliSense\n• PostCSS Language Support\n\n项目根目录包含 `.vscode` 文件夹，其中包含推荐的编辑器设置。",
      },
    ],
    structure: [
      {
        title: "项目结构",
        content:
          "```\n/app                    # Next.js App Router 目录\n  /api                  # API 路由\n  /components           # 应用级组件\n  /context              # React Context 提供者\n  /data                 # 静态数据和模拟数据\n  /hooks                # 自定义 React Hooks\n  /integrations         # 集成应用页面\n  /marketplace          # 应用市场页面\n  /favorites            # 收藏管理页面\n  /account              # 用户账户页面\n  /services             # 服务层\n  /utils                # 工具函数\n/components             # 共享组件\n  /ui                   # UI 组件库\n/public                 # 静态资源\n/styles                 # 全局样式\n/types                  # TypeScript 类型定义\n/lib                    # 第三方库集成\n```",
      },
      {
        title: "命名约定",
        content:
          "• 文件名: 使用 kebab-case (如 `user-profile.tsx`)\n• 组件名: 使用 PascalCase (如 `UserProfile`)\n• 函数名: 使用 camelCase (如 `getUserData`)\n• 常量: 使用 UPPER_SNAKE_CASE (如 `MAX_ITEMS_PER_PAGE`)\n• CSS 类名: 使用 kebab-case (如 `user-avatar`)",
      },
      {
        title: "导入顺序",
        content:
          "导入语句应按以下顺序排列:\n\n1. React 和 Next.js 内置模块\n2. 第三方库\n3. 组件\n4. Hooks\n5. 工具函数和常量\n6. 类型\n7. 样式\n\n每组之间应有一个空行。",
      },
    ],
    components: [
      {
        title: "组件库概述",
        content:
          "本项目使用 shadcn/ui 作为基础组件库，这是一个基于 Radix UI 和 Tailwind CSS 构建的组件集合。所有组件都位于 `components/ui` 目录下。",
      },
      {
        title: "组件使用示例",
        content:
          '```tsx\nimport { Button } from "@/components/ui/button"\nimport { Input } from "@/components/ui/input"\n\nexport function LoginForm() {\n  return (\n    <form>\n      <Input\n        type="email"\n        placeholder="邮箱地址"\n        className="mb-4"\n      />\n      <Button type="submit">登录</Button>\n    </form>\n  )\n}\n```',
      },
      {
        title: "自定义组件开发",
        content:
          '开发新组件时，请遵循以下原则:\n\n1. 组件应该是可重用的\n2. 使用 TypeScript 定义 props 接口\n3. 提供合理的默认值\n4. 使用 Tailwind CSS 进行样式设计\n5. 确保组件是响应式的\n6. 添加适当的注释\n7. 考虑可访问性 (ARIA 属性等)\n\n示例:\n```tsx\ninterface CardProps {\n  title: string\n  description?: string\n  className?: string\n  children: React.ReactNode\n}\n\nexport function Card({ title, description, className, children }: CardProps) {\n  return (\n    <div className={`rounded-lg border p-4 ${className}`}>\n      <h3 className="text-lg font-medium">{title}</h3>\n      {description && <p className="text-sm text-gray-500">{description}</p>}\n      <div className="mt-4">{children}</div>\n    </div>\n  )\n}\n```',
      },
    ],
    state: [
      {
        title: "状态管理概述",
        content:
          "本项目使用 React Context API 进行状态管理。主要的状态提供者包括:\n\n• AuthProvider: 用户认证状态\n• FavoritesProvider: 收藏管理状态\n• EncryptionProvider: 加密状态\n• VersionCheckProvider: 版本检查状态\n• SubscriptionProvider: 订阅状态",
      },
      {
        title: "Context 使用示例",
        content:
          '```tsx\n// 定义 Context\nimport { createContext, useContext, useState } from "react"\n\ninterface ThemeContextType {\n  theme: "light" | "dark"\n  toggleTheme: () => void\n}\n\nconst ThemeContext = createContext<ThemeContextType | undefined>(undefined)\n\n// 创建 Provider\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState<"light" | "dark">("light")\n  \n  const toggleTheme = () => {\n    setTheme(prev => prev === "light" ? "dark" : "light")\n  }\n  \n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  )\n}\n\n// 创建 Hook\nexport function useTheme() {\n  const context = useContext(ThemeContext)\n  if (!context) {\n    throw new Error("useTheme must be used within a ThemeProvider")\n  }\n  return context\n}\n```',
      },
      {
        title: "状态持久化",
        content:
          '对于需要持久化的状态，我们使用 localStorage 或 sessionStorage。例如:\n\n```tsx\n// 加载状态\nuseEffect(() => {\n  const savedState = localStorage.getItem("user_preferences")\n  if (savedState) {\n    setPreferences(JSON.parse(savedState))\n  }\n}, [])\n\n// 保存状态\nuseEffect(() => {\n  localStorage.setItem("user_preferences", JSON.stringify(preferences))\n}, [preferences])\n```',
      },
    ],
    api: [
      {
        title: "API 概述",
        content: "本项目使用 Next.js API Routes 实现后端功能。API 路由位于 `app/api` 目录下。",
      },
      {
        title: "API 路由示例",
        content:
          '```tsx\n// 浏览器端直连 OpenAI 兼容端点（无厂商 SDK 依赖）\nasync function chat(messages: Message[]) {\n  const res = await fetch("https://api.openai.com/v1/chat/completions", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json",\n      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,\n    },\n    body: JSON.stringify({\n      model: "gpt-4o-mini",\n      messages: [{ role: "system", content: "你是言语云³集成中心的智能助手..." }, ...messages],\n    }),\n  })\n  return (await res.json()).choices[0].message\n}\n```',
      },
      {
        title: "错误处理",
        content:
          'API 路由应该使用标准的 HTTP 状态码和一致的错误响应格式:\n\n```tsx\ntry {\n  // 业务逻辑\n} catch (error) {\n  console.error("API错误:", error)\n  return Response.json(\n    { error: "操作失败", message: error.message },\n    { status: 500 }\n  )\n}\n```',
      },
    ],
    data: [
      {
        title: "数据管理概述",
        content:
          "本项目使用多种数据源和存储方式:\n\n• 静态数据: 存储在 `app/data` 目录下的 TypeScript 文件\n• 本地存储: localStorage 用于客户端持久化\n• 远程 API: 用于获取动态数据",
      },
      {
        title: "数据模型",
        content:
          '主要数据模型包括:\n\n• Integration: 集成应用\n• User: 用户信息\n• Favorite: 收藏项\n• Subscription: 订阅信息\n• VersionInfo: 版本信息\n\n示例:\n```tsx\nexport type Integration = {\n  id: string\n  name: string\n  description: string\n  category: string\n  subcategory?: string\n  icon: React.ComponentType\n  color: string\n  developer: string\n  rating: number\n  reviewCount: number\n  price: {\n    type: "free" | "paid" | "freemium"\n    value?: number\n  }\n  installCount: number\n  releaseDate: string\n  lastUpdate: string\n  version: string\n  tags: string[]\n  featured?: boolean\n  new?: boolean\n  popular?: boolean\n  industryFocus?: string[]\n}\n```',
      },
      {
        title: "数据获取",
        content:
          '数据获取主要通过以下方式:\n\n• 静态导入: `import { integrations } from "@/app/data/integrations"`\n• React Query: 用于远程数据获取和缓存\n• SWR: 用于数据获取和重新验证\n• 自定义 hooks: 封装数据获取逻辑\n\n示例:\n```tsx\nconst { data, error, isLoading } = useSWR(\n  "/api/integrations",\n  fetcher\n)\n```',
      },
    ],
    testing: [
      {
        title: "测试概述",
        content:
          "本项目使用以下测试工具:\n\n• Jest: 单元测试框架\n• React Testing Library: 组件测试\n• Cypress: 端到端测试\n• MSW (Mock Service Worker): API 模拟",
      },
      {
        title: "单元测试示例",
        content:
          '```tsx\n// utils/format-date.test.ts\nimport { formatDate } from "./format-date"\n\ndescribe("formatDate", () => {\n  it("formats ISO date string to localized date", () => {\n    const isoDate = "2025-05-17T14:30:00.000Z"\n    const result = formatDate(isoDate)\n    expect(result).toMatch(/2025年05月17日/)\n  })\n\n  it("returns fallback for invalid date", () => {\n    const result = formatDate("invalid-date")\n    expect(result).toBe("无效日期")\n  })\n})\n```',
      },
      {
        title: "组件测试示例",
        content:
          '```tsx\n// components/ui/button.test.tsx\nimport { render, screen } from "@testing-library/react"\nimport userEvent from "@testing-library/user-event"\nimport { Button } from "./button"\n\ndescribe("Button", () => {\n  it("renders correctly", () => {\n    render(<Button>测试按钮</Button>)\n    expect(screen.getByRole("button")).toHaveTextContent("测试按钮")\n  })\n\n  it("calls onClick handler when clicked", async () => {\n    const handleClick = jest.fn()\n    render(<Button onClick={handleClick}>点击我</Button>)\n    await userEvent.click(screen.getByRole("button"))\n    expect(handleClick).toHaveBeenCalledTimes(1)\n  })\n})\n```',
      },
    ],
    deployment: [
      {
        title: "部署概述",
        content:
          "本项目使用 GitHub Pages 进行静态部署，通过 GitHub Actions CI/CD 自动化构建和发布。部署流程包括:\n\n1. 代码推送到 main 分支\n2. GitHub Actions 自动触发构建\n3. 静态导出生成 (next export)\n4. 自动部署到 GitHub Pages\n5. 自定义域名 nexus.yyc3.vip 生效",
      },
      {
        title: "环境变量",
        content:
          "构建时通过 GitHub Actions 配置以下环境变量:\n\n• `NEXT_PUBLIC_APP_VERSION`: 应用版本号\n• `NEXT_PUBLIC_BUILD_DATE`: 构建日期\n\n运行时环境变量在 `.env.local` 中配置，参考 `.env.example` 模板。",
      },
      {
        title: "部署命令",
        content:
          "```bash\n# 本地构建（静态导出）\npnpm build\n\n# 本地预览\nnpx serve out\n\n# 推送触发自动部署\ngit push origin main\n```",
      },
    ],
    contribution: [
      {
        title: "贡献指南",
        content: "我们欢迎所有形式的贡献，包括但不限于:\n\n• 代码贡献\n• 文档改进\n• Bug 报告\n• 功能请求\n• 代码审查",
      },
      {
        title: "开发流程",
        content:
          "1. Fork 代码库\n2. 创建功能分支 (`git checkout -b feature/amazing-feature`)\n3. 提交更改 (`git commit -m 'Add amazing feature'`)\n4. 推送到分支 (`git push origin feature/amazing-feature`)\n5. 创建 Pull Request",
      },
      {
        title: "代码规范",
        content:
          "• 遵循 ESLint 和 Prettier 配置\n• 编写单元测试\n• 使用有意义的提交消息\n• 保持代码简洁和可读\n• 添加适当的注释\n• 更新文档",
      },
    ],
    faq: [
      {
        title: "常见问题",
        content:
          "**Q: 如何添加新的集成应用类别?**\nA: 在 `app/data/integrations.ts` 文件中的 `categories` 数组中添加新类别。\n\n**Q: 如何修改主题颜色?**\nA: 编辑 `tailwind.config.js` 文件中的 `theme.extend.colors` 对象。\n\n**Q: 如何添加新的页面路由?**\nA: 在 `app` 目录下创建新的目录和 `page.tsx` 文件。\n\n**Q: 如何处理 API 错误?**\nA: 使用 `try/catch` 块捕获错误，并使用 `useErrorHandler` hook 处理错误。\n\n**Q: 如何添加新的环境变量?**\nA: 在 `.env.local` 文件中添加新的环境变量，并在 `next.config.js` 中的 `env` 对象中声明。",
      },
      {
        title: "故障排除",
        content:
          "**问题: 开发服务器无法启动**\n解决方案: 检查 Node.js 版本，确保安装了所有依赖，检查端口是否被占用。\n\n**问题: 构建失败**\n解决方案: 检查 TypeScript 错误，确保所有导入路径正确，检查环境变量是否配置正确。\n\n**问题: API 请求失败**\n解决方案: 检查网络连接，确保 API 路由正确，检查请求格式和参数。\n\n**问题: 组件不渲染**\n解决方案: 检查 React 错误，确保组件接收了正确的 props，检查条件渲染逻辑。",
      },
      {
        title: "联系支持",
        content:
          "如果您遇到无法解决的问题，请通过以下方式联系我们:\n\n• 电子邮件: china@0379.email\n• GitHub Issues: https://github.com/yanyu-cloud/integration-center/issues\n• 开发者社区: https://community.yanyu.cloud",
      },
    ],
  }

  const filteredSections = Object.entries(documentSections).reduce((acc, [key, value]) => {
    acc[key] = filterContent(value)
    return acc
  }, {} as any)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* 标题区域 */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t("developer.言语云³集成中心系统")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              {t("developer.开发者指南")}
            </motion.p>
          </div>

          {/* 搜索栏 */}
          <div className="relative max-w-2xl mx-auto w-full">
            <Input
              type="text"
              placeholder={t("developer.搜索开发文档...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          {/* 文档内容 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <ScrollArea className="max-w-full pb-2">
                  <TabsList className="p-0 bg-transparent h-12">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <FileCode className="h-4 w-4 mr-2" />
                      {t("developer.项目概述")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="setup"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {t("developer.环境设置")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="structure"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      {t("developer.项目结构")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="components"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {t("developer.组件库")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="state"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      {t("developer.状态管理")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="api"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Server className="h-4 w-4 mr-2" />
                      {t("developer.API文档")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="data"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      {t("developer.数据管理")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="testing"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {t("developer.测试指南")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="deployment"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      {t("developer.部署流程")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="contribution"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      {t("developer.贡献指南")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="faq"
                      className="data-[state=active]:bg-gray-100 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t("developer.常见问题")}
                    </TabsTrigger>
                  </TabsList>
                </ScrollArea>
              </div>

              {Object.entries(documentSections).map(([key, sections]) => (
                <TabsContent key={key} value={key} className="p-6">
                  {filteredSections[key].length > 0 ? (
                    <div className="space-y-8">
                      {filteredSections[key].map((section: any, index: number) => (
                        <div key={index} className="space-y-4">
                          <h2 className="text-2xl font-bold">{tc("developer", section.title)}</h2>
                          <div className="prose prose-gray max-w-none">
                            {section.content.split("\n").map((line: string, i: number) => (
                              <p key={i} className="whitespace-pre-wrap">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">{t("developer.没有找到相关内容")}</h3>
                      <p className="text-gray-500 mb-4">{t("developer.尝试使用不同的搜索关键词")}</p>
                      <Button onClick={() => setSearchQuery("")}>{t("developer.清除搜索")}</Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* 其他资源 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                    <GitBranch className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("developer.GitHub仓库")}</h3>
                    <p className="text-gray-500 mb-4">{t("developer.访问项目的GitHub仓库，查看源代码和提交问题。")}</p>
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        href="https://github.com/yanyu-cloud/integration-center"
                        target="_blank"
                        className="flex items-center justify-between"
                      >
                        <span>{t("developer.访问仓库")}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
