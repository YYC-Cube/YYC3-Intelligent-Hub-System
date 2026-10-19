/**
 * 学习模块步骤正文（markdown）—— 与 learning-paths.ts 的步骤 id 对应。
 *
 * 覆盖策略：内容按模块逐步补齐；未收录 stepId 的步骤由客户端渲染
 * 「内容建设中」占位（结构与导航仍来自 learning-paths 真实数据）。
 */

const componentBasicsReactIntro = `
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

## 在YanYuCloudCube集成中心的应用

在YanYuCloudCube集成中心，我们使用 React 组件来构建用户界面。每个集成应用都是由多个组件组成的，这些组件可以是：

- 页面组件：如集成列表页、详情页等
- UI组件：如按钮、卡片、表单等
- 功能组件：如数据加载器、错误边界等

通过掌握 React 基础，你将能够理解和开发YanYuCloudCube集成中心的前端部分。
`

const componentBasicsComponentStructure = `
# 组件结构

在YanYuCloudCube集成中心，我们遵循一定的组件结构规范，以确保代码的可维护性和可扩展性。

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
      {description && <p className="text-muted-foreground">{description}</p>}

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
`

const componentBasicsPropsState = `
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
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
            <img
              src={integration.icon || "/placeholder.svg"}
              alt={integration.name}
              className="w-6 h-6"
            />
          </div>
          <div>
            <h3 className="font-medium">{integration.name}</h3>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
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
            className={isFavorite ? "fill-warning text-warning" : ""}
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
`

/** stepId → markdown 正文。 */
export const learningContent: Record<string, string> = {
  "react-intro": componentBasicsReactIntro,
  "component-structure": componentBasicsComponentStructure,
  "props-state": componentBasicsPropsState,
}
