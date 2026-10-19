# YanYuCloudCube集成中心系统 - 开发者指南

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [开发环境设置](#开发环境设置)
4. [项目结构](#项目结构)
5. [核心功能模块](#核心功能模块)
6. [API文档](#api文档)
7. [组件库](#组件库)
8. [状态管理](#状态管理)
9. [路由系统](#路由系统)
10. [错误处理](#错误处理)
11. [测试指南](#测试指南)
12. [部署流程](#部署流程)
13. [贡献指南](#贡献指南)
14. [常见问题](#常见问题)

## 项目概述

YanYuCloudCube集成中心系统是一个现代化的集成应用管理平台，旨在帮助用户发现、连接并管理各种集成应用，提升业务效率。本系统采用最新的Web技术栈构建，提供直观的用户界面和强大的功能。

### 核心功能

- 集成应用发现与浏览
- 应用市场与详情展示
- 收藏管理与云同步
- 集成应用安装向导
- 智能AI助手
- 分类热度指标与订阅
- 端到端加密
- 版本检查与更新

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件**: shadcn/ui + Tailwind CSS
- **状态管理**: React Context
- **动画**: Framer Motion
- **AI集成**: 本地 ensemble 引擎 + OpenAI 兼容端点（原生 fetch）
- **类型系统**: TypeScript
- **构建工具**: Turbopack（Next.js 16 默认）
- **部署平台**: GitHub Pages（静态导出 `output: 'export'`）

## 开发环境设置

### 系统要求

- Node.js 20.9 或更高版本（推荐 22 LTS）
- pnpm 9 或更高版本
- Git
- 支持的操作系统: Windows 10/11, macOS 10.15+, Ubuntu 20.04+

### 安装步骤

1. 克隆代码库:

\`\`\`bash
git clone <https://github.com/yanyu-cloud/integration-center.git>
cd integration-center
\`\`\`

1. 安装依赖:

\`\`\`bash
npm install
\`\`\`

1. 设置环境变量:

复制 `.env.example` 文件为 `.env.local` 并填写必要的环境变量:

\`\`\`
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_DATE=2025-05-17T14:30:00.000Z
OPENAI_API_KEY=your_openai_api_key
\`\`\`

1. 启动开发服务器:

\`\`\`bash
npm run dev
\`\`\`

开发服务器将在 <http://localhost:3000> 启动。

### 编辑器设置

推荐使用 Visual Studio Code 作为代码编辑器，并安装以下扩展:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostCSS Language Support

项目根目录包含 `.vscode` 文件夹，其中包含推荐的编辑器设置。

## 项目结构

\`\`\`
/app                    # Next.js App Router 目录
  /api                  # API 路由
  /components           # 应用级组件
  /context              # React Context 提供者
  /data                 # 静态数据和模拟数据
  /hooks                # 自定义 React Hooks
  /integrations         # 集成应用页面
  /marketplace          # 应用市场页面
  /favorites            # 收藏管理页面
  /account              # 用户账户页面
  /services             # 服务层
  /utils                # 工具函数
/components             # 共享组件
  /ui                   # UI 组件库
/public                 # 静态资源
/styles                 # 全局样式
/types                  # TypeScript 类型定义
/lib                    # 第三方库集成
\`\`\`

### 命名约定

- **文件名**: 使用 kebab-case (如 `user-profile.tsx`)
- **组件名**: 使用 PascalCase (如 `UserProfile`)
- **函数名**: 使用 camelCase (如 `getUserData`)
- **常量**: 使用 UPPER_SNAKE_CASE (如 `MAX_ITEMS_PER_PAGE`)
- **CSS 类名**: 使用 kebab-case (如 `user-avatar`)

### 导入顺序

导入语句应按以下顺序排列:

1. React 和 Next.js 内置模块
2. 第三方库
3. 组件
4. Hooks
5. 工具函数和常量
6. 类型
7. 样式

每组之间应有一个空行。

## 核心功能模块

### 集成应用管理

集成应用是系统的核心实体，包含以下属性:

- ID: 唯一标识符
- 名称: 集成应用名称
- 描述: 详细描述
- 类别: 所属类别
- 子类别: 更具体的分类
- 图标: 应用图标
- 颜色: 品牌颜色
- 开发者: 开发公司或个人
- 评分: 用户评分
- 评论数: 用户评论数量
- 价格: 价格类型和具体价格
- 安装次数: 安装统计
- 发布日期: 首次发布日期
- 最后更新: 最后更新日期
- 版本: 当前版本号
- 标签: 关键词标签
- 特色标志: 是否为特色应用
- 新应用标志: 是否为新上线应用
- 热门标志: 是否为热门应用
- 行业焦点: 适用的行业

### 用户认证

用户认证系统使用 JWT 实现，支持以下功能:

- 用户注册
- 用户登录
- 密码重置
- 会话管理
- 权限控制

### 收藏管理

收藏管理允许用户保存感兴趣的集成应用，支持以下功能:

- 添加/删除收藏
- 收藏列表查看
- 收藏分类
- 云端同步
- 端到端加密

### 版本检查

版本检查系统用于通知用户应用更新，包含以下功能:

- 检查新版本
- 显示更新通知
- 版本比较
- 更新日志显示
- 用户设置控制

## API文档

### API 路由

API 路由位于 `app/api` 目录下，使用 Next.js API Routes 实现。主要端点包括:

#### 聊天 API

\`\`\`
POST /api/chat
\`\`\`

请求体:
\`\`\`json
{
  "messages": [
    { "role": "user", "content": "你好，我需要帮助" }
  ]
}
\`\`\`

响应:
\`\`\`
流式文本响应
\`\`\`

#### 版本检查 API

\`\`\`
GET /api/version
\`\`\`

响应:
\`\`\`json
{
  "version": "1.2.0",
  "releaseDate": "2025-05-17T14:30:00.000Z",
  "releaseNotes": "## 新功能\n\n- 添加了版本检查功能\n- 优化了性能\n- 修复了已知问题",
  "downloadUrl": "<https://example.com/download>",
  "critical": false
}
\`\`\`

#### 集成推荐 API

\`\`\`
POST /api/recommend
\`\`\`

请求体:
\`\`\`json
{
  "messages": ["用户与AI助手的对话内容"]
}
\`\`\`

响应:
\`\`\`json
{
  "recommendations": [
    {
      "id": "1",
      "name": "数据同步1",
      "description": "...",
      "category": "数据分析",
      "...": "..."
    }
  ]
}
\`\`\`

### 错误处理

API 响应应使用标准的 HTTP 状态码和一致的错误响应格式:

\`\`\`json
{
  "error": "错误类型",
  "message": "详细错误信息",
  "code": "错误代码"
}
\`\`\`

## 组件库

本项目使用 shadcn/ui 作为基础组件库，这是一个基于 Radix UI 和 Tailwind CSS 构建的组件集合。所有组件都位于 `components/ui` 目录下。

### 核心组件

- **Button**: 按钮组件，支持多种变体和大小
- **Card**: 卡片容器组件
- **Dialog**: 对话框组件
- **Input**: 输入框组件
- **Select**: 选择框组件
- **Tabs**: 标签页组件
- **Toast**: 通知提示组件

### 自定义组件

除了基础组件外，项目���包含多个自定义组件:

- **Navbar**: 导航栏组件
- **Footer**: 页脚组件
- **IntegrationCard**: 集成应用卡片
- **CategoryFilter**: 类别筛选器
- **SearchBar**: 搜索栏
- **Pagination**: 分页组件
- **ErrorBoundary**: 错误边界组件
- **UpdateNotification**: 更新通知组件

### 组件使用示例

\`\`\`tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  return (
    <form>
      <Input
        type="email"
        placeholder="邮箱地址"
        className="mb-4"
      />
      <Button type="submit">登录</Button>
    </form>
  )
}
\`\`\`

## 状态管理

本项目使用 React Context API 进行状态管理。主要的状态提供者包括:

### AuthProvider

管理用户认证状态，提供以下功能:

- 用户登录/注册
- 用户信息获取
- 会话管理
- 权限检查

\`\`\`tsx
const { user, isAuthenticated, login, logout } = useAuth()
\`\`\`

### FavoritesProvider

管理收藏状态，提供以下功能:

- 添加/删除收藏
- 收藏列表获取
- 收藏状态检查
- 云端同步

\`\`\`tsx
const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
\`\`\`

### EncryptionProvider

管理加密状态，提供以下功能:

- 加密设置
- 数据加密/解密
- 密钥管理

\`\`\`tsx
const { encrypt, decrypt, encryptionStatus } = useEncryption()
\`\`\`

### VersionCheckProvider

管理版本检查状态，提供以下功能:

- 检查更新
- 更新通知
- 用户设置

\`\`\`tsx
const { checkForUpdates, updateAvailable, updateInfo } = useVersionCheck()
\`\`\`

### SubscriptionProvider

管理订阅状态，提供以下功能:

- 订阅/取消订阅
- 订阅列表获取
- 订阅状态检查

\`\`\`tsx
const { subscriptions, subscribe, unsubscribe, isSubscribed } = useSubscriptions()
\`\`\`

## 路由系统

本项目使用 Next.js App Router 进行路由管理。主要路由包括:

- `/`: 首页
- `/integrations`: 集成应用列表页
- `/integrations/[id]`: 集成应用详情页
- `/integrations/[id]/install`: 集成应用安装页
- `/marketplace`: 应用市场页
- `/marketplace/integration/[id]`: 市场集成应用详情页
- `/favorites`: 收藏管理页
- `/account`: 账户管理页
- `/account/sync`: 同步设置页
- `/account/encryption`: 加密设置页
- `/account/subscriptions`: 订阅管理页
- `/about`: 关于页面
- `/about/version`: 版本信息页
- `/developer`: 开发者中心

### 路由参数

路由参数使用 Next.js 的动态路由功能实现:

\`\`\`tsx
// app/integrations/[id]/page.tsx
export default function IntegrationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  // ...
}
\`\`\`

### 路由导航

使用 Next.js 的 `Link` 组件和 `useRouter` hook 进行导航:

\`\`\`tsx
import Link from "next/link"
import { useRouter } from "next/navigation"

// 声明式导航
<Link href="/integrations/123">查看详情</Link>

// 命令式导航
const router = useRouter()
router.push("/integrations/123")
\`\`\`

## 错误处理

本项目实现了全面的错误处理机制，包括:

### 错误边界

使用 React 错误边界捕获渲染错误:

\`\`\`tsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
\`\`\`

### API 错误处理

使用 try/catch 块和统一的错误处理函数:

\`\`\`tsx
try {
  const response = await fetch("/api/endpoint")
  if (!response.ok) {
    throw new Error("API请求失败")
  }
  const data = await response.json()
} catch (error) {
  handleError(error)
}
\`\`\`

### 错误日志

使用错误日志服务记录错误:

\`\`\`tsx
import { logError } from "@/app/services/error-logging"

logError({
  error: error.toString(),
  componentStack: errorInfo.componentStack,
  url: window.location.href,
  timestamp: new Date().toISOString(),
})
\`\`\`

### 用户友好的错误提示

使用 Toast 组件显示用户友好的错误提示:

\`\`\`tsx
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

toast({
  title: "操作失败",
  description: "无法完成请求，请稍后重试",
  variant: "destructive",
})
\`\`\`

## 测试指南

本项目使用以下测试工具:

- Vitest: 单元测试框架（`tests/`，`pnpm test`）
- React Testing Library: 组件测试
- jsdom: 浏览器环境模拟（vitest 配置内置）

### 单元测试

单元测试统一存放于 `tests/unit/`，文件名以 `.test.ts` 或 `.test.tsx` 结尾:

\`\`\`tsx
// utils/format-date.test.ts
import { formatDate } from "./format-date"

describe("formatDate", () => {
  it("formats ISO date string to localized date", () => {
    const isoDate = "2025-05-17T14:30:00.000Z"
    const result = formatDate(isoDate)
    expect(result).toMatch(/2025年05月17日/)
  })

  it("returns fallback for invalid date", () => {
    const result = formatDate("invalid-date")
    expect(result).toBe("无效日期")
  })
})
\`\`\`

### 组件测试

组件测试使用 React Testing Library:

\`\`\`tsx
// components/ui/button.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>测试按钮</Button>)
    expect(screen.getByRole("button")).toHaveTextContent("测试按钮")
  })

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>点击我</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

### 端到端测试

端到端测试使用 Cypress:

\`\`\`js
// cypress/e2e/integration-list.cy.js
describe("Integration List Page", () => {
  beforeEach(() => {
    cy.visit("/integrations")
  })

  it("displays integration cards", () => {
    cy.get("[data-testid=integration-card]").should("have.length.at.least", 1)
  })

  it("filters integrations by category", () => {
    cy.get("[data-testid=category-filter]").click()
    cy.contains("数据分析").click()
    cy.get("[data-testid=integration-card]").should("have.length.at.least", 1)
    cy.get("[data-testid=category-badge]").should("contain", "数据分析")
  })
})
\`\`\`

### 运行测试

\`\`\`bash

# 运行单元测试和组件测试

npm test

# 运行特定测试文件

npm test -- utils/format-date.test.ts

# 运行端到端测试

npm run cypress:open
\`\`\`

## 部署流程

本项目为纯静态导出站点（`next.config` 中 `output: 'export'`），构建产物 `out/` 由 GitHub Actions 自动发布到 GitHub Pages，无需任何外部部署平台。

### 环境变量

构建期可配置以下环境变量:

- `NEXT_PUBLIC_APP_VERSION`: 应用版本号
- `NEXT_PUBLIC_BUILD_DATE`: 构建日期

说明: `OPENAI_API_KEY`、`DATABASE_URL` 等仅在本地 `mock-api` 联调时使用，静态产物不会内嵌任何密钥。

### 部署命令

\`\`\`bash

# 本地构建（产出静态站点到 out/）

pnpm build

# 本地预览静态产物

npx serve out

# 发布: 推送 main 分支，GitHub Actions 自动构建并部署 Pages

\`\`\`

### CI/CD 流程

本项目使用 GitHub Actions 进行 CI/CD:

1. 代码推送到 GitHub 仓库
2. GitHub Actions 运行构建（`pnpm install` → `pnpm build`）
3. 构建通过后，`out/` 自动发布到 GitHub Pages（自定义域名见 `public/CNAME`）
4. 部署完成后，GitHub 发送 Pages 构建通知

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于:

- 代码贡献
- 文档改进
- Bug 报告
- 功能请求
- 代码审查

### 开发流程

1. Fork 代码库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 编写单元测试
- 使用有意义的提交消息
- 保持代码简洁和可读
- 添加适当的注释
- 更新文档

### 提交消息规范

提交消息应遵循以下格式:

\`\`\`
<类型>(<范围>): <描述>

[可选的正文]

[可选的页脚]
\`\`\`

类型包括:

- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

示例:
\`\`\`
feat(auth): 添加用户注册功能

- 实现用户注册表单
- 添加邮箱验证
- 集成密码强度检查
\`\`\`

## 常见问题

### 如何添加新的集成应用类别?

在 `app/data/integrations.ts` 文件中的 `categories` 数组中添加新类别。

### 如何修改主题颜色?

编辑 `tailwind.config.js` 文件中的 `theme.extend.colors` 对象。

### 如何添加新的页面路由?

在 `app` 目录下创建新的目录和 `page.tsx` 文件。

### 如何处理 API 错误?

使用 `try/catch` 块捕获错误，并使用 `useErrorHandler` hook 处理错误。

### 如何添加新的环境变量?

在 `.env.local` 文件中添加新的环境变量，并在 `next.config.js` 中的 `env` 对象中声明。

### 如何解决常见的开发问题?

#### 开发服务器无法启动

检查 Node.js 版本，确保安装了所有依赖，检查端口是否被占用。

#### 构建失败

检查 TypeScript 错误，确保所有导入路径正确，检查环境变量是否配置正确。

#### API 请求失败

检查网络连接，确保 API 路由正确，检查请求格式和参数。

#### 组件不渲染

检查 React 错误，确保组件接收了正确的 props，检查条件渲染逻辑。

### 联系支持

如果您遇到无法解决的问题，请通过以下方式联系我们:

- 电子邮件: <china@0379.email>
- GitHub Issues: <https://github.com/yanyu-cloud/integration-center/issues>
- 开发者社区: <https://community.yanyu.cloud>

---

© YanYuCloudCube 2025. 保留所有权利。
